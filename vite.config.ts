import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {
            BASE_URL: 'https://redeeming-romance.netlify.app/', // Update this with your actual deployment URL
        },
    },
});
