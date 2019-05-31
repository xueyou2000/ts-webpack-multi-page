import Path from "path";
import Webpack from "webpack";

export default () => {
    const webpackConfig: Webpack.Configuration = {
        mode: "production",
        entry: Path.resolve(__dirname, "./src/utils/polyfill.js"),
        output: {
            path: Path.resolve(__dirname, "./static"),
            filename: "js/polyfill.js"
        }
    };

    return webpackConfig;
};
