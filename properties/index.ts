import Webpack from "webpack";
import devConfig from "./dev";
import proConfig from "./pro";
import uatConfig from "./uat";

/**
 * 环境配置
 * @description	不同编译环境不同配置
 */
export interface Configuration {
    /**
     * 编译输出路径
     */
    output: string;
    /**
     * 资源路径前缀
     */
    assetsPublicPath: string;
    /**
     * 输出文件名
     */
    filename: string;
    /**
     * 输出chunk名
     */
    chunkFilename: string;
    /**
     * 生成map方式
     */
    devtool: Webpack.Options.Devtool;
    /**
     * 开发服务器配置
     */
    devServer: any;
    /**
     * 运行变量
     */
    variable: { [key: string]: string };
}

/**
 * 编译环境
 */
export enum WebpackBuildEnvironmentEnum {
    /**
     * 开发环境
     */
    dev = "dev",
    /**
     * 生产环境
     */
    prod = "prod",
    /**
     * 灰度环境
     */
    uat = "uat"
}

export function ConfigurationFactory(env: WebpackBuildEnvironmentEnum): Configuration {
    switch (env) {
        case WebpackBuildEnvironmentEnum.dev:
            return devConfig;
        case WebpackBuildEnvironmentEnum.prod:
            return proConfig;
        case WebpackBuildEnvironmentEnum.uat:
            return proConfig;
        default:
            throw new Error("invalid env params, must be WebpackBuildEnvironmentEnum Type");
    }
}
