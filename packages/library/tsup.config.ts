import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  minify: false,
  dts: {
    compilerOptions: {
      composite: false,
    },
  },
  tsconfig: "tsconfig.json",
});
