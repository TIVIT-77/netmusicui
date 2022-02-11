<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

</script>
<style lang="scss">
#app {
  @font-face {
    font-family: 腾祥伯当行楷简;
    src: url(./assets/fonts/TTXingKaiJ.ttf);
  }

  @font-face {
    font-family: 方正风雅楷宋简体;
    src: url(./assets/fonts/FZFengYKSJ.ttf);
  }

  @font-face {
    font-family: 方正榜书行简体;
    src: url(./assets/fonts/FZBangSXJW.ttf);
  }

  @font-face {
    font-family: STHUPO;
    src: url(./assets/fonts/STHUPO.TTF);
  }
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  width: 1920px;
  height: 973px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.el-popover {
  // element UI中 .el-popover 中比较特殊，el-popover修改样式不生效是因为其与App同级。
  text-align: center;
  min-width: 25px;
  i{
    font-size: 25px;
  }
}
.el-menu{
    border: none;
    font-family: 方正榜书行简体;
}
</style>
