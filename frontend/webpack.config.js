const VuwLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: "development",

    entry: {
        admin: "./src/index.ts",
    },

    devServer: {
        contentBase: "./dist",
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                        }
                    }
                ],
            },
            {
                test: /\.scss$/,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader",
                ],
            },
            {
                test: /\.vue$/,
                use: ["vue-loader"],
            },
        ]
    },

    plugins: [
        new VuwLoaderPlugin(),
    ]
}
