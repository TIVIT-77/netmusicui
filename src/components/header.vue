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
        @change="autocompleteChange"
        :fetch-suggestions="querySearch"
        prefix-icon="el-icon-search"
        v-model="searchData"
        clearable
        @keypress.native.enter="onEnterPress('select')"
        @select="onEnterPress('select')"
      ></el-autocomplete>
    </div>
    <div class="login">
      <div v-if="!this.$store.state.userCookie">
        <div class="user">
          <i class="el-icon-user" style="font-size: 30px"></i>&emsp; <el-input v-model="phone" placeholder="请输入手机号" clearable></el-input>&emsp;
          <el-input placeholder="请输入密码" v-model="password" show-password clearable></el-input>&emsp;
          <el-button type="primary" icon="el-icon-check" circle @click="login" style="background-color: white; color: black"></el-button>
          <el-button type="text" @click="register">注册</el-button>
        </div>
      </div>
      <div v-else class="user" style="margin-right: 15px">
        <div>
          <span style="display: block; height: 20px; font-family: emoji; margin-right: 5px">{{ username }}</span>
          <el-button type="text" @click="logout" id="logOutBtn">注销</el-button>
        </div>
        <el-avatar :src="userImgUrl" :alt="username"></el-avatar>
      </div>
    </div>
    <el-dialog title="手机号注册" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-input placeholder="请输入手机号" v-model="phone" clearable type="tel" ref="telInput"></el-input>
      <el-input placeholder="请输入验证码" v-model="verificationCode" clearable>
        <el-button slot="append" @click="getVerificationCode" :class="verificationCodeLabel == '发送验证码'?'':'prohibited'">{{ verificationCodeLabel }}</el-button>
      </el-input>
      <el-input placeholder="请输入密码" v-model="password" show-password clearable></el-input>
      <p class="passTip">密码8-20位，至少包含字母数字字符2种组合</p>
      <el-input placeholder="请输入昵称" v-model="nickName" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
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
    '$store.state.searchPageNum'(val, old) {
      this.pageNum = val
      if (val > old || val == 1) {
        this.onEnterPress()
      }
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
      dialogVisible: false,
      verificationCode: '',
      verificationCodeLabel: '发送验证码',
      nickName: '',
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
        .post('/api/cellphone/existence/check', {
          phone: this.phone,
        })
        .then((res) => {
          if (res.data && res.data.code == 200 && res.data.exist == 1 && res.data.hasPassword) {
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
                  //获取每日推荐歌曲
                  axios.get('/api/recommend/songs').then((res) => {
                    this.$store.commit('updateRecommendSongsList', res.data.data)
                  })
                } else {
                  // return this.$message.error('登录失败')
                }
                loadingInstance.close()
              })
          } else {
            this.$message.error('手机号尚未注册')
          }
        })
    },
    register() {
      this.dialogVisible = true
    },
    getVerificationCode() {
      if (this.phone && this.phone.length == 11) {
        if (this.verificationCodeLabel == '发送验证码') {
          this.axios(`/api/captcha/sent?phone=${this.phone}`).then((res) => {
            if (res.data.data && res.data.code == 200) {
              this.$message.success(`验证码已发送到手机号:${this.phone},请注意查收！`)
              this.verificationCodeLabel = 60
              let timer = setInterval(() => {
                this.verificationCodeLabel--
                if (this.verificationCodeLabel <= 0) {
                  clearInterval(timer)
                  this.verificationCodeLabel = '发送验证码'
                }
              }, 1000)
            }
          })
        }
      } else {
        this.$message.error(this.phone ? '请输入正确格式十一位手机号' : '请输入手机号')
        this.$refs.telInput.focus()
      }
    },
    submit() {
      if (!this.phone) {
        this.$message.error('请输入手机号')
        return
      }
      if (!this.verificationCode) {
        this.$message.error('请输入验证码')
        return
      }
      if (!this.password) {
        this.$message.error('请输入密码')
        return
      }
      if (!this.nickName) {
        this.$message.error('请输入昵称')
        return
      }
      this.axios
        .get('/api/register/cellphone', {
          params: {
            captcha: this.verificationCode,
            phone: this.phone,
            password: this.password,
            nickname: this.nickName,
          },
        })
        .then((res) => {
          if (res.data && res.data.code == 200) {
            this.dialogVisible = false
            this.$message.success(`登陆成功，${res.data.profile.nickname} 欢迎回来`)
            // console.log(res)
            // console.log(res.data.profile.avatarUrl)
            // console.log(res.data.profile.nickname);
            this.username = res.data.profile.nickname
            this.userImgUrl = res.data.profile.avatarUrl
            this.userId = res.data.profile.userId
            this.$store.commit('updateUserCookie', res.data.cookie)
            this.$store.commit('updateUserInfo', res.data)
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
            //获取每日推荐歌曲
            axios.get('/api/recommend/songs').then((res) => {
              this.$store.commit('updateRecommendSongsList', res.data.data)
            })
          }
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
    onEnterPress(type) {
      //网易云经典问题，返回数据延迟，使用post请求返回数据始终是第一次请求返回的旧数据，get请求则问题解决
      if (type == 'select') {
        this.$store.state.searchPageNum = 1
      }
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
        .catch((err) => {
          this.$store.state.searchPageNum--
        })
    },
    autocompleteChange(val) {
      if (val) {
        this.$store.state.searchPageNum = 1
      }
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
#logOutBtn {
  margin: 0;
  padding: 0;
}
.el-icon-arrow-left,
.el-icon-arrow-right,
.el-icon-refresh {
  cursor: pointer;
}
.el-input-group__append {
  border-radius: 0 20px 20px 0;
}
.passTip {
  text-align: left;
  height: 15px;
  line-height: 15px;
  margin: 0;
  padding: 0;
  padding-left: 15px;
}
.prohibited:hover{
  cursor: not-allowed;
}
</style>
