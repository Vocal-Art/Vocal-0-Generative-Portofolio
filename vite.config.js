import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { exec } from "child_process"; // Ajout pour copier _redirects après build

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: "dist", // Dossier de sortie
    assetsDir: "assets", // Dossier des assets
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  // Hook pour copier _redirects après la construction
  server: {
    host: true,
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});

// Copier le fichier _redirects après la construction
exec("cp public/_redirects dist/_redirects", (err) => {
  if (err) console.error("Error copying _redirects:", err);
  else console.log("_redirects copied successfully!");
});
