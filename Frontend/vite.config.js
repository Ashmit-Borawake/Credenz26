import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        // target: 'https://mainweb.credenz.co.in',
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["gsap", "framer-motion", "react-icons", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Optimize build
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  assetsInclude: ["**/*.glb", "**/*.gltf"],
});
