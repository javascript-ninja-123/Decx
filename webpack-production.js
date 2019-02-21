const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env',"@babel/preset-react"],
                    plugins:["@babel/plugin-proposal-object-rest-spread","@babel/plugin-transform-runtime",
                    "babel-plugin-styled-components",
                    [ "@babel/plugin-proposal-decorators", {"legacy":true}],
                    "@babel/plugin-proposal-class-properties",
                    "transform-remove-console"
                    ]
                  }
                }
            }
        ]
      },
      plugins: [
        new MinifyPlugin({}, {comments:false})
      ]
}
