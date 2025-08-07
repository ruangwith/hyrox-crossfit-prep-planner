import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Ensure API key is available for mobile builds
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey && mode === 'production') {
        console.warn('WARNING: GEMINI_API_KEY not found in environment variables for production build');
    }
    
    return {
      base: mode === 'production' ? '/hyrox-crossfit-prep-planner/' : '/',
      define: {
        // Multiple ways to inject the API key for cross-platform compatibility
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'globalThis.__ENV__': JSON.stringify({ GEMINI_API_KEY: apiKey }),
        // Fallback for mobile browsers
        '__ENV__': JSON.stringify({ GEMINI_API_KEY: apiKey })
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Optimize for mobile performance
      build: {
        target: ['es2015', 'safari11'],
        rollupOptions: {
          output: {
            manualChunks: {
              'google-genai': ['@google/genai']
            }
          }
        }
      },
      // Enable HTTPS for development testing on mobile
      server: {
        https: false,
        host: true, // Expose to network for mobile testing
        port: 5173
      }
    };
});
