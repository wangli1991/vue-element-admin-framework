/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 14:46:23
 */
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  env: {
    development: {
      plugins: ["dynamic-import-node"]
    }
  },
  plugins: [
    // 主题换肤
    [
      "babel-plugin-component",
      {
        libraryName: "element-ui",
        styleLibraryName: "~node_modules/element-theme-chalk/src",
        ext: ".scss"
      }
    ]
  ],
  comments: false
};
