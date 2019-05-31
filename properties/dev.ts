import path from "path";
import { Configuration } from "./index";
import packageInfo from "../package.json";
import apiMocker from "mocker-api";

const config: Configuration = {
    output: path.join(__dirname, "../dist"),
    assetsPublicPath: "/",
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
    devtool: "eval-source-map",
    variable: {
        NODE_ENV: "development",
        VERSION: packageInfo.version
    },
    devServer: {
        // host: "192.168.1.3",
        port: 8280,
        hot: true,
        inline: true,
        open: true,
        disableHostCheck: true,
        quiet: true,
        openPage: "index.html",
        contentBase: path.join(__dirname, ".."),
        before(app) {
            apiMocker(app, path.resolve(__dirname, "../mocker/index.js"), {
                changeHost: true
            });
        }
        // proxy: [
        //     {
        //         target: "http://192.168.1.12:9001",
        //         context: [`/gateway/**`]
        //     },
        //     {
        //         target: "http://192.168.1.12:2002",
        //         context: [`/boss/**`]
        //     },
        //     {
        //         target: "http://192.168.1.12:6005",
        //         context: [`/boss-server/**`]
        //     },
        //     {
        //         target: "http://192.168.1.12:6014",
        //         context: [`/ticket/**`]
        //     },
        //     {
        //         target: "http://192.168.1.12:8080",
        //         context: [`/chat/**`]
        //     }
        // ]
    }
};

export default config;
