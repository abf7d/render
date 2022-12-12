import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { babel } from '@rollup/plugin-babel';

import packageJson from "./package.json" assert { type: "json" };


// https://dev.to/siddharthvenkatesh/component-library-setup-with-react-typescript-and-rollup-onj
// rollup-plugin-postcss - To handle our css
// rollup-plugin-terser - To minify our bundle

// jsx transform
// https://stackoverflow.com/questions/67811412/rollup-react-17-with-new-jsx-transform-react-is-not-defined

export default [
  {
    input: "src/index.ts",
    output: [
      // {
      //   file: packageJson.main,
      //   format: "cjs",
      //   sourcemap: true,
      // },
      
      // Creates esm folder with index.js with what looks like the code base
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true
      },

      /// cjs, cretes many files but index.js refers to a file with what appears to be the code base
      // {
      //   dir: 'dist',
      //   // file: packageJson.module,
      //   format: "cjs",
      //   sourcemap: true,
      // },


      /// using cjs and file instead of directory with inlineDyanmaic imports 
      {
        //dir: 'dist',
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        inlineDynamicImports: true
      },



      
      // {
      //   dir: 'dist',
      //   // file: packageJson.module,
      //   format: "esm",
      //   sourcemap: true,
      // },


      
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({ babelHelpers: 'bundled' }),
      
    ],

    /// excluding node_modules folder
    // plugins: [
    //   resolve(),
    //   commonjs(),
    //   typescript({ tsconfig: "./tsconfig.json" }),
    //   babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
      
    // ],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];