const path = require("path");
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
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "public"),
      },
      {
        directory: path.dirname(require.resolve("@zorse/drop")),
      },
    ],
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
      assert: require.resolve("assert"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      // url: require.resolve("url/"),
    },
  },
  module: {
    noParse: /(@zorse\/drop)/,
    rules: [
      {
        test: /node_modules\/@zorse\/drop\/lib\.js$/,
        use: [
          {
            loader: "string-replace-loader",
            options: {
              multiple: [
                {
                  search: /__dirname/g,
                  replace: "''",
                },
                {
                  search: /^/,
                  // require buffer in zorse using webpack chunk id 1.
                  replace: `const Buffer = (__webpack_require__(32).Buffer);\ndebugger;console.log(Buffer);\n`,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: require.resolve("requirejs"), to: "scripts/require.js" }],
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // disable chunks by default since web extensions must be a single bundle
    }),
    // shim globals
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: path.resolve("webpack", "buffer.js"),
    }),
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
