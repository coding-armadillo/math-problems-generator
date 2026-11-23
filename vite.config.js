import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const appSource = readFileSync(new URL("./app.js", import.meta.url), "utf8");

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [
    {
      name: "copy-client-script",
      apply: "build",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "app.js",
          source: appSource
        });
      }
    }
  ]
});
