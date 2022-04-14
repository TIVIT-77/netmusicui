<template>
  <div class="header">
    <div style="float: left">
      <el-tooltip class="item" effect="dark" content="后退" placement="bottom">
        <i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="前进" placement="bottom">
        <i class="el-icon-arrow-right" @click="$router.go(1)"></i>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
        <i class="el-icon-refresh" @click="$router.go(0)"></i>
      </el-tooltip>
    </div>
    <div style="float: left; margin-left: 30px; width: 400px">
      <el-autocomplete
        :placeholder="placeholder"
        @focus="placeholder = defaultPlaceholder"
        @blur="placeholder = '搜索音乐'"
        @change="$store.state.searchPageNum=1"
        :fetch-suggestions="querySearch"
        prefix-icon="el-icon-search"
        v-model="searchData"
        clearable
        @keypress.native.enter="onEnterPress"
        @select="onEnterPress"
      ></el-autocomplete>
    </div>
    <div class="login">
      <div v-if="!this.$store.state.userCookie">
        <div class="user">
          <i class="el-icon-user" style="font-size: 30px"></i>&emsp; <el-input v-model="phone" placeholder="请输入手机号" clearable></el-input>&emsp;
          <el-input placeholder="请输入密码" v-model="password" show-password clearable></el-input>&emsp;
          <el-button type="primary" icon="el-icon-check" circle @click="login" style="background-color: white; color: black"></el-button>
        </div>
      </div>
      <div v-else class="user" style="margin-right: 15px;">
        <div>
          <span style="display: block; height: 20px;font-family: emoji;margin-right: 5px;">{{ username }}</span>
          <el-button type="text" @click="logout" id="logOutBtn">注销</el-button>
        </div>
        <el-avatar :src="userImgUrl" :alt="username"></el-avatar>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  created() {
    this.init()
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  watch: {
    '$store.state.searchPageNum'(val) {
      this.pageNum = val
      this.onEnterPress()
    },
  },
  data() {
    return {
      searchData: '',
      username: '',
      userImgUrl: '',
      phone: '',
      password: '',
      userId: '',
      placeholder: '搜索音乐',
      defaultPlaceholder: '',
      restaurants: [],
      pageSize: 30,
      pageNum: 1,
      searchType: 1, //type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
    }
  },
  methods: {
    init() {
      axios('/api/search/default').then((res) => {
        this.defaultPlaceholder = res.data.data.showKeyword
      })
      axios('/api/search/hot').then((res) => {
        this.restaurants = res.data.result.hots.map((item) => {
          return { value: item.first }
        })
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    loadAll() {
      return this.restaurants
    },
    login() {
      axios
        .post(`/api/login/cellphone`, {
          phone: this.phone,
          password: this.password,
        })
        .then((res) => {
          let loadingInstance = this.$loading({
            text: '正在登录',
            target: document.querySelector('section'),
            background: 'rgba(0, 0, 0,0.5)',
          })
          if (res && res.data && res.data.profile) {
            this.$message.success(`登陆成功，${res.data.profile.nickname} 欢迎回来`)
            // console.log(res)
            // console.log(res.data.profile.avatarUrl)
            // console.log(res.data.profile.nickname);
            this.username = res.data.profile.nickname
            this.userImgUrl = res.data.profile.avatarUrl
            this.userId = res.data.profile.userId
            this.$store.commit('updateUserCookie', res.data.cookie)
            this.$store.commit('updateUserInfo', res.data)
          } else {
            return this.$message.error('登录失败')
          }
          loadingInstance.close()
        })
        .then(() => {
          //获取每日推荐歌单
          axios
            .post(`/api/recommend/resource`, {
              cookie: this.$store.state.userCookie,
            })
            .then((res) => {
              // this.$store.state.recommendResource=res.data.recommend;
              this.$store.commit('updateRecommend', res.data.recommend)
              // console.log(res);
            })
        })
        .then(() => {
          //获取每日推荐歌曲
          axios.get('/api/recommend/songs').then((res) => {
            this.$store.commit('updateRecommendSongsList', res.data.data)
          })
        })
    },
    logout() {
      this.axios('/api/logout').then((res) => {
        if (res.data.code == 200) {
          this.$message.success('注销成功')
          this.$store.commit('updateUserCookie', '')
          this.$store.commit('updateUserInfo', '')
        }
      })
    },
    onEnterPress() {
      //网易云经典问题，返回数据延迟，使用post请求返回数据始终是第一次请求返回的旧数据，get请求则问题解决
      axios
        .get(`/api/cloudsearch`, {
          params: {
            keywords: this.searchData,
            limit: this.pageSize,
            offset: (this.pageNum - 1) * this.pageSize,
            type: this.searchType,
          },
        })
        .then((res) => {
          let songs = res.data.result.songs
          songs = songs.map((item, index) => {
            let parameters = {}
            parameters.id = item.id
            parameters.name = item.name
            parameters.alia = item.alia //歌曲描述
            parameters.al = item.al //专辑
            parameters.alPicUrl = item.al.picUrl //专辑封面
            parameters.ar = item.ar //演唱者
            parameters.songList = parameters.ar.map((item) => {
              let songsinfo = {}
              songsinfo.id = item.id
              songsinfo.name = item.name
              return songsinfo
            })
            parameters.singsString = parameters.songList
              .map((item) => {
                return item.name
              })
              .join(' / ')
            parameters.index = index
            parameters.dt = item.dt / 1000
            parameters.searchKeyWords = this.searchData
            return parameters
          })
          this.pageNum == 1 ? this.$store.commit('updateSearchSongs', songs) : this.$store.state.searchSongs.push(...songs)
          this.$router.push('search')
        })
    },
  },
}
</script>

<style>
.header {
  font-family: YouYuan, STHUPO, Arial, Helvetica, sans-serif;
  height: 60px;
}
.login {
  float: right;
}
.user {
  display: flex;
  justify-content: center;
  align-items: center;
}
.item {
  margin: 7px;
}
.el-input__inner {
  border-radius: 20px;
}
.el-icon-arrow-left:hover {
  color: #fff;
}
.el-icon-arrow-right:hover {
  color: #fff;
}
#logOutBtn{
  margin: 0;
  padding: 0;
}
</style>
