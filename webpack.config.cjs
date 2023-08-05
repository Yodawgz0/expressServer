const path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.ts",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "final.js",
  },
  target: "node",
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            onlyCompileBundledFiles: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
};
