const path = require("path");
// const fs = require("fs");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const webExtensionConfig = {
  mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  target: "web", // extensions run in a webworker context
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    publicPath: "",
    path: path.join(__dirname, "./dist"),
    library: {
      name: "main",
      type: "amd",
    },
    // umdNamedDefine: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
  resolve: {
    mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
    extensions: [".js"], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
      // assert: require.resolve("assert"),
      // stream: require.resolve("stream-browserify"),
      // path: require.resolve("path-browserify"),
      // url: require.resolve("url/"),
    },
  },
  module: {
    noParse: /(@zorse\/drop|requirejs)/,
    rules: [
      // {
      //   test: /\.wasm$/,
      //   type: "asset/resource",
      //   generator: {
      //     outputPath: "drop/",
      //   },
      // },
      // {
      //   test: /node_modules\/@zorse\/drop\/lib\.js$/,
      //   use: [
      //     {
      //       loader: "string-replace-loader",
      //       options: {
      //         multiple: [
      //           {
      //             search: /require\(/g,
      //             replace: "zorse_require(",
      //           },
      //           {
      //             search: /^/,
      //             // require buffer in zorse using webpack chunk id 1.
      //             replace: `const Buffer = __webpack_require__(1).Buffer;\n`,
      //           },
      //           {
      //             search: `ie(Z="busybox_unstripped.wasm")||(J=Z,Z=e.locateFile?e.locateFile(J,g):g+J);`,
      //             replace: `Z=zorse_require("busybox_unstripped.wasm");`,
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: require.resolve("requirejs"), to: "scripts/require.js" }],
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable chunks by default since web extensions must be a single bundle
    }),
    // new webpack.ProvidePlugin({
    //   process: "process/browser", // provide a shim for the global `process` variable
    //   // eslint-disable-next-line @typescript-eslint/naming-convention
    //   Buffer: path.resolve("webpack", "buffer.js"),
    // }),
  ],
  performance: {
    hints: false,
  },
  devtool: "inline-source-map", // create a source map that points to the original source file
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

module.exports = [webExtensionConfig];
