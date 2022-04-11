const portFinderSync = require("portfinder-sync");
const Visualizer = require("webpack-visualizer-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HtmlWebpackSkipAssetsPlugin } = require("html-webpack-skip-assets-plugin");
const port = portFinderSync.getPort(8080);

const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
module.exports = {
    entry: {
        main: path.resolve("./assets/frontend/dashboard/index.jsx"),
        style: path.resolve("./assets/scss/style_main.scss"),
    },
    output: {
        path: path.resolve(__dirname, "static"),
        filename: "[name].[hash].js",
        chunkFilename: "[contenthash:8].chunk.js",
        crossOriginLoading: "anonymous",
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    node: {
        fs: "empty",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-syntax-dynamic-import",
                            "react-hot-loader/babel",
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, // instead of style-loader
                    // "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader", // compiles Sass to CSS, using Node Sass by default
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file-loader",
            },
        ],
    },
    devServer: {
        port,
        contentBase: path.join(__dirname, "static"),
        writeToDisk: true,
        historyApiFallback: true,
        proxy: {
            "/api": "http://127.0.0.1:8000",
        },
    },
    plugins: [
        new Dotenv({
            path: "./.env", // load this now instead of the ones in '.env'
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: true, // hide any errors
            defaults: false, // load '.env.defaults' as the default values if empty.
        }),
        new SriPlugin({
            hashFuncNames: ["sha512"],
            enabled: process.env.NODE_ENV === "production",
        }),
        new Visualizer(),
        new HtmlWebpackPlugin({
            template: "assets/frontend/index.html",
        }),
        new HtmlWebpackSkipAssetsPlugin({
            // skipAssets: [/style.js\?id=.*/i]
            skipAssets: [/style.(.*).js/i],
        }),
        new Visualizer(),
        new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true,
            cleanOnceBeforeBuildPatterns: ["!images/*", "!svgs/*"],
            cleanAfterEveryBuildPatterns: ["style.js"],
        }),
        new ManifestPlugin({
            publicPath: "/static/",
            basePath: "",
            merge: true,
            fileName: "manifest.json",
        }),
    ],
};
