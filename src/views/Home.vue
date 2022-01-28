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
  components: {asideMenu, headerVue,footerVue}
}

</script>
<style lang="scss">
.el-badge{
  line-height: 50px;
}
.el-header,
.el-footer {
  background-color: #242424;
  color: white;
  text-align: center;
  line-height: 60px;
}
.el-footer{
  height: 80px!important;
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
  height: 800px;
  .title {
    color: white;
    height: 35px;
    width: 1600px;
    line-height: 35px;
    border-bottom: 2px solid #c10d0c;
    font-size: larger;
  }
  .Recommendation {
    margin: 0;
    padding: 0;
    height: 230px;
    width: 1600px;
    display: block;
    list-style: none;
    li {
      float: left;
      display: block;
      width: 140px;
      height: 204px;
      padding-left: 42px;
      font-size: 12px;
      color: #333;
      font-family: Arial, Helvetica, sans-serif;
      overflow: hidden;
      padding: 0 0 15px 50px;
      line-height: 1.4;
      img {
        display: block;
        width: 100%;
      }
      a {
        color: white;
        cursor: pointer;
      }
    }
  }
}
</style>
