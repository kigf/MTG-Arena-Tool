const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require ('path');

const MODE = process.env.ENV || 'development';

console.log ('__dirname: ', __dirname);
console.log ('MODE: ', MODE);
let common_config = {
  node: {
    __dirname: false,
  },
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: '@teamsupercell/typings-for-css-modules-loader'
          },
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: "camelCase"
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: [/node_modules/, path.join (__dirname, 'src/ui')],
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        loader: 'file-loader',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webm)$/i,
        loader: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.json', '.scss', 'jpeg','jpg', '.png'],
  },
};

module.exports = [
  Object.assign ({}, common_config, {
    target: 'electron-main',
    entry: {
      main: './src/main/index.ts',
    },
    output: {
      filename: 'main.js',
      path: path.join (__dirname, 'dist'),
    },
  }),
  Object.assign ({}, common_config, {
    target: 'electron-renderer',
    entry: {
      renderer: './src/renderer/index.tsx',
    },
    output: {
      filename: 'index.js',
      path: path.join (__dirname, 'dist/renderer'),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: MODE == "development" ? '[name].css' : '[name].[hash].css',
        chunkFilename: MODE == "development" ? '[id].css' : '[id].[hash].css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/assets/template.html'
      })
    ]
  }),
  Object.assign ({}, common_config, {
    target: 'electron-renderer',
    entry: {
      renderer: './src/background/index.ts',
    },
    output: {
      filename: 'index.js',
      path: path.join (__dirname, 'dist/background'),
    },
    plugins: [new HtmlWebpackPlugin({
      template: 'src/assets/template-nocss.html'
    })]
  }),
  Object.assign ({}, common_config, {
    target: 'electron-renderer',
    entry: {
      renderer: './src/overlay/index.tsx',
    },
    output: {
      filename: 'index.js',
      path: path.join (__dirname, 'dist/overlay'),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: MODE == "development" ? '[name].css' : '[name].[hash].css',
        chunkFilename: MODE == "development" ? '[id].css' : '[id].[hash].css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/assets/template.html'
      })
    ]
  }),
  Object.assign ({}, common_config, {
    target: 'electron-renderer',
    entry: {
      renderer: './src/updater/index.ts',
    },
    output: {
      filename: 'index.js',
      path: path.join (__dirname, 'dist/updater'),
    },
    plugins: [new HtmlWebpackPlugin({
      template: 'src/assets/template-nocss.html'
    })]
  }),
];
