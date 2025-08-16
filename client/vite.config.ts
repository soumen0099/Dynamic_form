import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    optimizeDeps: {
        include: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
    },
    build: {
        chunkSizeWarningLimit: 5000,
    },
});
