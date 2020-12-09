<template>
  <el-color-picker
    v-model="theme"
    :predefine="[
      '#409EFF',
      '#1890ff',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d'
    ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
const version = require("element-ui/package.json").version; // element-ui version from node_modules
const ORIGINAL_THEME = "#409EFF"; // default color

export default {
  data() {
    return {
      chalk: "", // content of theme-chalk css
      theme: ""
    };
  },
  computed: {
    defaultTheme() {
      return this.$store.state.app.theme;
    }
  },
  watch: {
    defaultTheme: {
      handler: function(val, oldVal) {
        console.log(val, oldVal);
        this.theme = val;
      },
      immediate: true
    },
    theme(val) {
      this.themeChangeHandle(val);
    }
  },
  mounted() {
    this.themeChangeHandle(this.$store.state.app.theme);
  },
  methods: {
    async themeChangeHandle(val) {
      console.log(val);
      const oldVal = this.chalk ? this.theme : ORIGINAL_THEME;
      if (typeof val !== "string") return;
      const themeCluster = this.getThemeCluster(val.replace("#", ""));
      const originalCluster = this.getThemeCluster(oldVal.replace("#", ""));
      console.log(themeCluster, originalCluster);

      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(
            ORIGINAL_THEME.replace("#", "")
          );
          const newStyle = this.updateStyle(
            this[variable],
            originalCluster,
            themeCluster
          );
          // 在页面上加 style 标签，把生成的样式填进去
          let styleTag = document.getElementById(id);
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.setAttribute("id", id);
            document.head.appendChild(styleTag);
          }
          styleTag.innerText = newStyle;
        };
      };
      // 如果没有chalk就是第一次换颜色，需要远程获取css文件，赋值给chalk
      // 后续的换颜色操作，就不用远程获取了
      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
        await this.getCSSString(url, "chalk");
      }

      const chalkHandler = getHandler("chalk", "chalk-style");

      chalkHandler();

      const styles = [].slice
        .call(document.querySelectorAll("style"))
        .filter(style => {
          const text = style.innerText;
          return (
            new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
          );
        });
      styles.forEach(style => {
        const { innerText } = style;
        if (typeof innerText !== "string") return;
        style.innerText = this.updateStyle(
          innerText,
          originalCluster,
          themeCluster
        );
      });

      this.$store.dispatch("app/changeTheme", val);
    },
    /* 更新样式 - 使用新的颜色变量替换之前的 */
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
      });
      return newStyle;
    },

    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "");
            resolve();
          }
        };
        xhr.open("GET", url);
        xhr.send();
      });
    },
    // 根据用户选择的颜色，生成相应的颜色
    /**
     * 传入一个颜色的HEX，得到这个颜色的深浅颜色数组
     * 我们知道，我们默认的主色调蓝色，在实际使用中，还需要对应的浅蓝和深蓝
     * @param  {[string]]} theme [color]
     * @return {[array]}       [对应的深浅颜色数组]
     */
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(",");
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));

          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);

          return `#${red}${green}${blue}`;
        }
      };

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      };

      const clusters = [theme];
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
      }
      clusters.push(shadeColor(theme, 0.1));
      return clusters;
    }
  }
};
</script>

<style lang="scss">
.theme-picker {
  width: 26px;
  height: 26px;
  .el-color-picker__trigger {
    height: 100% !important;
    width: 100% !important;
    padding: 2px;
  }
}

.theme-picker-dropdown {
  .el-color-dropdown__link-btn {
    display: none;
  }
}
</style>
