const webpack = require("webpack");

module.exports = {
  entry: "./src/electron_main/main.ts",
  output: {
    path: __dirname + "/public",
    publicPath: "/",
    filename: "main.js"
  },
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js", ".jsx"]
  },
  devServer: {
    contentBase: "/public",
    port: 8082
  }
};
