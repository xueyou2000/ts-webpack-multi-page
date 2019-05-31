import path from "path";
import { Configuration } from "./index";
import packageInfo from "../package.json";

const config: Configuration = {
    output: path.join(__dirname, "../dist"),
    assetsPublicPath: "https://file.365wifi.com.cn/uat/gateway/",
    filename: "js/[name]-[contenthash].js",
    chunkFilename: "js/[name]-[contenthash:5].js",
    devtool: false,
    variable: {
        NODE_ENV: "production",
        VERSION: packageInfo.version
    },
    devServer: {}
};

export default config;
