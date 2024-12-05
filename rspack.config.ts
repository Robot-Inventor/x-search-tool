import { CopyRspackPlugin, CssExtractRspackPlugin, HtmlRspackPlugin } from "@rspack/core";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { defineConfig } from "@rspack/cli";

const isProduction = process.env.NODE_ENV === "production";
const config = defineConfig({
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map",
    entry: {
        "js/script.js": "./src/ts/script.ts"
    },
    output: {
        filename: (pathData) => `${pathData.chunk?.name}?${pathData.contentHash}`,
        clean: true
    },
    devServer: {
        static: {
            directory: "./dist"
        },
        port: 8080,
        client: {
            overlay: false,
            progress: true
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/u,
                exclude: [/node_modules/u],
                loader: "builtin:swc-loader",
                options: {
                    // Ref: https://github.com/lit/lit/issues/4580#issuecomment-1996733777
                    jsc: {
                        parser: {
                            syntax: "typescript",
                            decorators: true
                        },
                        keepClassNames: true,
                        transform: {
                            legacyDecorator: true,
                            useDefineForClassFields: false
                        }
                    }
                },
                type: "javascript/auto"
            },
            {
                test: /\.css$/i,
                use: [CssExtractRspackPlugin.loader, "css-loader"],
                type: "javascript/auto"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new CopyRspackPlugin({
            patterns: [
                {
                    context: "./public/",
                    from: "**/*",
                    to: "./"
                }
            ]
        }),
        new CssExtractRspackPlugin({
            runtime: false,
            filename: (pathData) =>
                `css/${pathData.chunk?.name?.replace("js/", "").replace(/\.js$/, "")}.css?${pathData.contentHash}`
        }),
        new HtmlRspackPlugin({
            template: "./src/html/index.html",
            filename: "./index.html",
            minify: true,
            chunks: ["js/script.js"]
        }),
        new ForkTsCheckerWebpackPlugin()
    ]
});

export default config;
