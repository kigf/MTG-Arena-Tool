process.env.NODE_ENV = "production";

const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const post = require("./webpack.post.js");

console.log("MODE: production");

const merged = merge(common, {
  mode: "production"
});

module.exports = post(merged);
