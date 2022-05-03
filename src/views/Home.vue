<template>
  <el-container>
    <el-aside width="200px">
      <asideMenu></asideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <headerVue></headerVue>
      </el-header>
      <el-main>
        <mtw-scroll ref="mtwScroll">
          <router-view></router-view>
        </mtw-scroll>
      </el-main>
      <el-footer>
        <footerVue></footerVue>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import asideMenu from '../components/asideMenu.vue'
import headerVue from '../components/header.vue'
import footerVue from '../components/footer.vue'
export default {
  components: { asideMenu, headerVue, footerVue },
  watch: {
    $route(val) {
      this.$refs['mtwScroll'].scrollTo({ x: 0, y: 0 }, 0)
    },
  },
}
</script>
<style lang="scss">
.el-container {
  width: 100%;
  height: 100%;
}
.el-badge {
  line-height: 50px;
}
.el-header,
.el-footer {
  background-color: #242424;
  color: white;
  text-align: center;
  line-height: 60px;
}
.el-footer {
  height: 80px !important;
  line-height: 80px;
}

.el-aside {
  background-color: #242424;
  color: white;
  text-align: center;
}

.el-main {
  background-color: #242424;
  color: white;
  text-align: center;
  padding: 0;
  .cardList {
    color: white;
    width: 1600px;
    margin: 0 auto;
    margin-bottom: 15px;
    line-height: 35px;
    border-bottom: 2px solid #c10d0c;
    font-size: larger;
  }
  .hotDjList {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    margin: 25px 0;
    .hotDj {
      width: 215px;
      margin: 25px;
      position: relative;
      .bottom {
        position: absolute;
        top: 180px;
        width: 215px;
        color: white;
        background-color: #242424;
        opacity: 0.7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-icon-service{
          margin-left: 15px;
        }
        .el-icon-video-play{
          margin-right: 15px;
          cursor: pointer;
        }
      }
      img {
        cursor: pointer;
      }
      p {
        margin: 0;
        margin-top: -10px;
        font-size: 15px;
        font-family: 腾祥伯当行楷简, Arial, Helvetica, sans-serif;
        cursor: pointer;
      }
      .annotation {
        font-size: 7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span:first-child {
          padding: 2px;
          border: 1px solid #e60026;
          color: #e60026;
        }
        span:last-child {
          margin-left: 2px;
          padding: 2px;
          color: #95a5a6;
          border: 0;
        }
      }
    }
  }
}
.aixin {
  color: #ff6a6a;
  font-size: 35px !important;
}
.el-table {
  background-color: transparent !important;
  color: white;
  th {
    background-color: transparent !important;
  }
  tr {
    background-color: transparent !important;
  }
  td.el-table__cell {
    border: 0;
  }
  .el-table__body tr.current-row > td.el-table__cell {
    background-color: transparent !important;
    color: #6f98fe;
  }
  //CSS 优先规则：优先级关系：内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器
  //所以上面当前行样式优先级高于下边标签选择每一行,实现hover不影响当前行颜色
  .el-table__body tr:hover > td {
    background-color: transparent !important;
    color: #13c2c2;
  }
  &::before {
    height: 0 !important;
  }
}
.el-popover {
  background-color: #242424;
}
</style>

