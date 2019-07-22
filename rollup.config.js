import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";
import tsconfig from "./tsconfig.json";


export default [
  // Browser-friendly UMD build
  {
    input: "src/main.ts",
    output: {
      name: "Library",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      // uglify(),     // Minify and uglify
      resolve({
        browser: true
      }), // So rollup can find imports
      commonjs(), // Convert to an ES module
      typescript({
        ...tsconfig.compilerOptions,
        include: '**/*.{js,ts}',
      }) // Convert TypeScript to JavaScript
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/main.ts",
    plugins: [
      typescript({
      ...tsconfig.compilerOptions,
        include: "**/*.{js,ts}"
      })
    ],
    external: ["lodash-es", "d3-time-format", "query-string"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }
];
