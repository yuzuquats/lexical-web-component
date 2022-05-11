const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "lexical.bundle.min.js",
    library: "Lexical",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "development",
};
