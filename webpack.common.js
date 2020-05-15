const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require("webpack-merge");
const path = require("path");

console.log("__dirname: ", __dirname);

let common_config = {
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: "@teamsupercell/typings-for-css-modules-loader",
            options: {
              verifyOnly: process.env.NODE_ENV === "production",
            },
          },
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localsConvention: "camelCase",
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
        exclude: [/node_modules/, path.join(__dirname, "src/ui")],
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        loader: "file-loader",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webm)$/i,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [
      ".tsx",
      ".ts",
      ".js",
      ".css",
      ".json",
      ".scss",
      "jpeg",
      "jpg",
      ".png",
    ],
  },
};

module.exports = common_config;