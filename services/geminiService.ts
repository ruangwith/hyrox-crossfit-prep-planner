
import { GoogleGenAI, Type } from "@google/genai";
import type { FullPlan, Difficulty } from '../types';

// Per project guidelines, API key is assumed to be in the environment.
// Handle environment variables for both development and production builds
const getApiKey = (): string => {
    // Try different ways to access the API key for cross-platform compatibility
    const apiKey = process.env.API_KEY || 
                   process.env.GEMINI_API_KEY || 
                   (window as any).__ENV__?.GEMINI_API_KEY ||
                   (globalThis as any).process?.env?.GEMINI_API_KEY;
                   
    if (!apiKey) {
        console.error('API Key access failed. Available env vars:', Object.keys(process.env || {}));
        throw new Error('GEMINI_API_KEY is not set. Please add your API key to the environment variables.');
    }
    return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
      warmUp: {
        type: Type.OBJECT,
        properties: {
          title: {type: Type.STRING},
          duration: {type: Type.STRING},
          exercises: {
            type: Type.ARRAY,
            items: {type: Type.STRING}
          }
        },
        required: ["title", "duration", "exercises"]
      },
      coolDown: {
        type: Type.OBJECT,
        properties: {
          title: {type: Type.STRING},
          duration: {type: Type.STRING},
          exercises: {
            type: Type.ARRAY,
            items: {type: Type.STRING}
          }
        },
        required: ["title", "duration", "exercises"]
      },
      weeklyPlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            week: {type: Type.INTEGER},
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: {type: Type.STRING},
                  title: {type: Type.STRING},
                  notes: {type: Type.STRING},
                  workouts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: {type: Type.STRING},
                        details: {type: Type.STRING}
                      },
                      required: ["name", "details"]
                    }
                  }
                },
                required: ["day", "title", "workouts"]
              }
            }
          },
          required: ["week", "days"]
        }
      }
    },
    required: ["warmUp", "coolDown", "weeklyPlan"]
  };
  
const createPrompt = (difficulty: Difficulty): string => {
    return `
    You are a world-class fitness coach designing a 4-week (Month 1) training program for a user with a **${difficulty}** fitness level. The goal is to build all-around strength, endurance, and functional fitness to prepare for events like CrossFit, Hyrox, and Redline Fitness. Tailor the intensity, volume, and complexity of exercises to the specified difficulty level. For 'Beginner', focus on fundamentals. For 'Advanced', use complex movements and higher intensity.

    Follow these rules STRICTLY:
    1.  **Schedule**: The week starts on Tuesday. Rest days are Monday and Friday.
    2.  **Weekly Structure**:
        *   **Tuesday (Push Day)**: 6 weight training exercises. Focus on chest, shoulders, triceps.
        *   **Wednesday (Pull Day)**: 6 weight training exercises. Focus on back and biceps.
        *   **Thursday (Leg Day)**: 6 weight training exercises. Focus on quads, hamstrings, glutes, and calves.
        *   **Saturday (HIIT)**: A high-intensity workout (For Time, AMRAP, or EMOM) lasting 20-30 minutes. Can include running.
        *   **Sunday (Endurance Simulation)**: A long workout (> 1 hour) simulating a Hyrox event. It MUST be "For Time" and alternate running with functional workout stations.
    3.  **Exercise Constraints**:
        *   Include EXACTLY one Tricep-focused exercise per week.
        *   Include EXACTLY two Bicep-focused exercises per week.
        *   Distribute these across Push and Pull days as appropriate.
    4.  **Equipment Available (Home Gym)**:
        *   Treadmill, Barbell, Dumbbell, Kettlebell, Jump Box, Pull-Up Bar, Landmine, Sandbag, Wallball, Bodyweight, a single high-pulley Cable.
        *   **IMPORTANT**: NO machine exercises. NO low-pulley cable exercises. Maximize equipment variety throughout the 4 weeks.
    5.  **Workout Details & Formatting**:
        *   For **Weight Training Days** (Tues, Wed, Thurs), provide the specific exercise name in the \`name\` field and the sets/reps in the \`details\` field (e.g., "4 sets of 8-12 reps").
        *   For **HIIT & Endurance Days** (Sat, Sun), you MUST structure the data as follows:
            *   The \`title\` field should describe the workout's format (e.g., "Sprint & Strength Blitz (For Time)").
            *   The \`notes\` field should contain the overall goal or structure (e.g., "5 Rounds For Time (Target: 20-25 minutes)").
            *   The \`workouts\` array MUST contain each individual movement as a separate object. Do NOT put the entire workout sequence in a single string.
            *   **MANDATORY Example**: \`workouts: [{ "name": "Treadmill Sprint", "details": "200m" }, { "name": "Push-ups", "details": "15 reps" }, ...]\`.
    6.  **Uniqueness**: Ensure the program is varied and not repetitive week-to-week to prevent boredom. Change exercises, formats, or rep schemes.
    7.  **Output**: Provide the output ONLY in the specified JSON format. Provide a generic but effective Warm-up and Cool-down routine.
    `;
};

// Create a timeout promise for mobile network reliability
const createTimeoutPromise = (timeoutMs: number) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - mobile connection may be slow')), timeoutMs);
    });
};

// Retry logic for mobile network issues
const retryWithBackoff = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            console.warn(`Attempt ${attempt + 1} failed:`, error);
            
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError!;
};

export const generateWorkoutPlan = async (difficulty: Difficulty): Promise<Omit<FullPlan, 'id' | 'difficulty'>> => {
    let responseText = '';
    
    const performRequest = async (): Promise<Omit<FullPlan, 'id' | 'difficulty'>> => {
        try {
            const prompt = createPrompt(difficulty);

            // Create the API request with timeout handling for mobile
            const apiCall = ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                    temperature: 0.8,
                },
            });

            // Race between API call and timeout (30 seconds for mobile)
            const response = await Promise.race([
                apiCall,
                createTimeoutPromise(30000)
            ]);

            responseText = (response as any).text;
            
            // The AI can sometimes wrap the JSON in markdown code blocks. Clean it up.
            const cleanedText = responseText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
            
            if (!cleanedText) {
                throw new Error("The AI returned an empty response.");
            }

            const parsedPlan: Omit<FullPlan, 'id' | 'difficulty'> = JSON.parse(cleanedText);
            
            if (!parsedPlan.weeklyPlan || parsedPlan.weeklyPlan.length !== 4) {
                console.error("Invalid plan structure received from AI:", parsedPlan);
                throw new Error("Invalid plan structure received from AI.");
            }

            return parsedPlan;

        } catch (error) {
            console.error("Error in API call:", error);
            
            // Enhanced error handling for mobile debugging
            if (error instanceof SyntaxError) {
                console.error("Failed to parse JSON. Raw response from AI:", responseText);
                throw new Error("The AI returned a response in an unexpected format. Please try again.");
            }
            
            // Specific handling for different error types
            if ((error as Error).message.includes('timeout')) {
                throw new Error("Network timeout - please check your internet connection and try again.");
            }
            
            if ((error as Error).message.includes('API key')) {
                throw new Error("API configuration error. Please contact support if this persists.");
            }
            
            if ((error as Error).message.includes('fetch')) {
                throw new Error("Network error - please check your internet connection and try again.");
            }
            
            throw new Error(`API request failed: ${(error as Error).message}`);
        }
    };

    // Use retry logic with backoff for mobile reliability
    try {
        return await retryWithBackoff(performRequest, 2, 2000);
    } catch (error) {
        console.error("Final error after retries:", error);
        throw error;
    }
};
