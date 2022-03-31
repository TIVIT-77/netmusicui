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
        <mtw-scroll>
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
import asideMenu from "../components/asideMenu.vue"
import headerVue from '../components/header.vue'
import footerVue from "../components/footer.vue"
export default {
  components: { asideMenu, headerVue, footerVue }
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
    height: 35px;
    width: 1600px;
    margin: 0 auto;
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
      p {
        margin: 0;
        margin-top: -10px;
        font-size: 15px;
        font-family: 腾祥伯当行楷简, Arial, Helvetica, sans-serif;
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
</style>
