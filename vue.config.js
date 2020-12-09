"use strict";
const path = require("path");
// 主题换肤
const webpack = require("webpack");
const ThemeColorReplacer = require("webpack-theme-color-replacer");
const forElementUI = require("webpack-theme-color-replacer/forElementUI");
const themeConfig = require("./config/theme");

const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

function assetsPath(_path) {
  return path.posix.join("static", _path);
}

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  publicPath: "/",
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: "dist",
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "static",
  /* 代码保存时进行eslint检测 */
  lintOnSave: process.env.NODE_ENV === "development",
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* webpack-dev-server 相关配置 */
  devServer: {
    hot: true,
    port: port,
    /* 自动打开浏览器 */
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 请求代理配置 -> can be modified
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true, // 支持跨域
        // secure: false, // 支持 https
        pathRewrite: {
          // '^/api': '/api' // 连接开发环境，走网关的那种
          "^/api": "/"
          // '^/api/[a-zA-Z_]+/': '/' // 本地开发，不走网关，直接调本地服务
        }
      }
    }
    // before: require("./mock/mock-server.js")
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@SYS": resolve("src/modules/sys")
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          $THEME_COLOR: JSON.stringify(themeConfig.themeColor)
        },
        $THEME_COLOR: JSON.stringify(themeConfig.themeColor)
      }),
      // 生成仅包含颜色的替换样式（主题色等）
      new ThemeColorReplacer({
        fileName: assetsPath("css/theme-colors.css"),
        matchColors: [
          ...forElementUI.getElementUISeries(themeConfig.themeColor), // element-ui 主题色
          themeConfig.themeColor // 自定义主题色
        ],
        changeSelector: forElementUI.changeSelector
      })
    ]
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial"
      }
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
  /* sass，scss，less的配置 */
  css: {
    loaderOptions: {
      scss: {
        prependData: `$THEME_COLOR: ${themeConfig.themeColor};@import "~@/assets/css/variables.scss";`
      }
    }
  }
};
