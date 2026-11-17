import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  publicDir: false,
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        workspace: resolve(projectRoot, "public/index.html")
      },
      plugins: [
        {
          name: "emit-service-worker",
          generateBundle(_options, bundle) {
            const precacheUrls = [
              "/",
              ...Object.keys(bundle)
                .filter((fileName) => /\.(html|js|css)$/.test(fileName))
                .map((fileName) => `/${fileName}`)
            ];
            const serviceWorker = readFileSync(
              resolve(projectRoot, "public/sw.js"),
              "utf8"
            ).replace("__PRECACHE_URLS__", JSON.stringify(precacheUrls));

            this.emitFile({
              type: "asset",
              fileName: "sw.js",
              source: serviceWorker
            });
          }
        }
      ]
    }
  }
});
