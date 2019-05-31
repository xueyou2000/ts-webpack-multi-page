import Path from "path";
import Glob from "glob";
import Webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import ErudaWebpackPlutin from "eruda-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { WebpackBuildEnvironmentEnum, Configuration, ConfigurationFactory } from "./properties";

export default () => {
    const env = process.env.WEBPACK_ENV as WebpackBuildEnvironmentEnum;
    const config = ConfigurationFactory(env);
    const devMode = env === WebpackBuildEnvironmentEnum.dev;
    const { entries, htmlWebpackPlugins } = FindPages(config, devMode);

    const webpackConfig: Webpack.Configuration & { devServer: any } = {
        entry: entries,
        devtool: config.devtool,
        devServer: config.devServer,
        mode: devMode ? "development" : "production",
        output: {
            path: config.output,
            filename: config.filename,
            publicPath: config.assetsPublicPath
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            alias: { "@": Path.join(__dirname, "src") }
        },
        externals: {
            react: "React",
            "react-dom": "ReactDOM"
        },
        module: {
            rules: [
                {
                    test: /\.(ts)x?$/,
                    include: [/src/],
                    use: {
                        loader: "awesome-typescript-loader",
                        options: {
                            useCache: true,
                            reportFiles: ["src/**/*.{ts,tsx}"],
                            cacheDirectory: "./node_modules/.awcache,",
                            forceIsolatedModules: true
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: devMode ? ["style-loader", "css-loader"] : [MiniCssExtractPlugin.loader, require.resolve("css-loader")]
                },
                {
                    test: /\.scss$$/,
                    include: [/src/],
                    use: devMode ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] : [MiniCssExtractPlugin.loader, "css-loader", "sass-loader", "postcss-loader"]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 100,
                        name: "images/[name].[hash:5].[ext]"
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 100,
                        name: "media/[name].[hash:5].[ext]"
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 100,
                        name: "fonts/[name].[hash:5].[ext]"
                    }
                }
            ]
        },
        optimization: {
            removeEmptyChunks: true,
            removeAvailableModules: true,
            minimize: env === WebpackBuildEnvironmentEnum.prod
        },
        plugins: GetPlugins(config, devMode).concat(htmlWebpackPlugins)
    };

    return webpackConfig;
};

/**
 * 寻找页面
 * @param config    配置
 * @param devMode   是否开发模式
 */
function FindPages(config: Configuration, devMode: boolean) {
    const entries: Webpack.Entry = {};
    const htmlWebpackPlugins: Webpack.Plugin[] = [];

    Glob.sync(Path.join(__dirname, "./src/pages/*/config.json")).forEach((entry) => {
        const dirname = Path.dirname(entry);
        const name = Path.basename(dirname);
        const pageConfig = require(entry);

        console.log("✔ \t", pageConfig);

        entries[name] = `${dirname}/index.tsx`;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                filename: `${name}.html`,
                template: pageConfig.userDefaultPage ? "index.html" : `${dirname}/index.html`,
                inject: true,
                title: pageConfig.title,
                assetsPublicPath: config.assetsPublicPath
            })
        );
    });

    console.log("\n\n");
    return { entries, htmlWebpackPlugins };
}

/**
 * 获取Webpack插件
 * @param config    配置
 * @param devMode   是否开发模式
 */
function GetPlugins(config: Configuration, devMode: boolean): Webpack.Plugin[] {
    let environmentPlugins: Webpack.Plugin[] = [];
    const basePlugins: Webpack.Plugin[] = [WebpackVariablePlugin(config), new CaseSensitivePathsPlugin(), new CopyWebpackPlugin([{ from: Path.resolve("static/**/*"), to: Path.resolve(config.output) }]), new HardSourceWebpackPlugin()];

    if (devMode) {
        environmentPlugins = [new Webpack.HotModuleReplacementPlugin(), new FriendlyErrorsWebpackPlugin(), new ErudaWebpackPlutin()];
    } else {
        environmentPlugins = [
            new CleanWebpackPlugin(),
            new ManifestPlugin(),
            new Webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({ filename: "css/[name].[contenthash:5].css" }),
            new OptimizeCSSAssetsPlugin(),
            new Webpack.optimize.ModuleConcatenationPlugin(),
            new BundleAnalyzerPlugin()
        ];
    }

    return basePlugins.concat(environmentPlugins);
}

/**
 * 创建webpack变量插件
 * @param {*} config
 */
function WebpackVariablePlugin(config: Configuration) {
    const variable: any = {};
    for (let variableName in config.variable) {
        variable[`process.env.${variableName}`] = JSON.stringify(config.variable[variableName]);
    }
    return new Webpack.DefinePlugin(variable);
}
