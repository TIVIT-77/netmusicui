<template>
  <div>
    <div class="content" v-if="playlist.coverImgUrl && playlist.creator.avatarUrl">
      <div class="resume">
        <div class="left">
          <img :src="playlist.coverImgUrl" alt="等待接口回应中..." />
          <p>播放累计次数：{{ playlist.playCount }}</p>
          <p>
            <el-button type="success" icon="el-icon-video-play" round @click="playAll">播放全部</el-button>
            <template v-if="playlist.specialType==0">
              <el-button v-if="startFlag" type="danger" icon="el-icon-star-on" round @click="start">取消收藏</el-button>
              <el-button v-else type="danger" icon="el-icon-star-off" round @click="start">收藏歌单</el-button>
            </template>
          </p>
        </div>
        <div class="right">
          <h2>{{ playlist.name }}</h2>
          <div style="display: flex; align-items: center; justify-content: center">
            <img :src="playlist.creator.avatarUrl" alt="等待接口回应中..." width="50px" /><span>{{ playlist.creator.nickname }}</span>
          </div>
          <p>创建时间：{{ this.dayjs(playlist.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
          <div>
            <div class="tag" v-for="(item, i) in playlist.tags" :key="i">{{ item }}</div>
          </div>
          <div class="description">
            {{ playlist.description }}
          </div>
        </div>
      </div>
      <div class="songsTable">
        <el-table :data="tableData" style="width: 100%" row-key="id" highlight-current-row @current-change="handleCurrentChange">
          <el-table-column type="index" width="50px"></el-table-column>
          <el-table-column prop="name" label="歌曲名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="singsString" label="歌手" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="dt" label="时长" :formatter="formatSecond"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
function realFormatSecond(second) {
  var secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60
    return ('0' + hours).slice(-2) + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '00:00:00'
  }
}
export default {
  watch: {
    '$store.state.userCookie'(val) {
      if (val) {
        this.init()
      }
    },
  },
  created() {
    this.init()
  },
  data() {
    return {
      playlist: {
        creator: {},
      },
      startFlag: false,
      startList: [],
      tableData: [],
    }
  },
  methods: {
    formatSecond(row) {
      return realFormatSecond(row.dt)
    },
    init() {
      this.axios(`/api/playlist/detail?id=${this.$route.query.id}`).then((res) => {
        this.playlist = res.data.playlist
      })
      if (this.$store.state.userInfo && this.$store.state.userInfo.account && this.$store.state.userInfo.account.id) {
        this.axios('/api/user/playlist', {
          params: {
            uid: this.$store.state.userInfo.account.id,
          },
        }).then((res) => {
          this.startList = res.data.playlist
          res.data.playlist.map((item) => {
            if (item.id == this.$route.query.id) {
              this.startFlag = true
            }
          })
        })
      }
      this.axios(`/api/playlist/track/all?id=${this.$route.query.id}`).then((res) => {
        this.handleSongs(res.data.songs, this.playlist)
      })
    },
    start() {
      if (this.$store.state.userInfo && this.$store.state.userInfo.account && this.$store.state.userInfo.account.id) {
        this.axios(`/api/playlist/subscribe?t=${this.startFlag ? 2 : 1}&id=${this.$route.query.id}`).then((res) => {
          if (res.data && res.data.code == 200) {
            this.$notify.success('收藏成功')
            this.init()
          }
        })
      } else {
        this.$message.error('请先登录账号')
      }
    },
    handleSongs(data, playlistItem = {}) {
      // songs = res.data.songs
      let songs = []
      songs = data.map((item, index) => {
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
        parameters.playlistName = playlistItem.name
        parameters.dt = item.dt / 1000
        item.dt = item.dt / 1000
        parameters.index = index
        return { ...parameters, ...item }
      })
      this.tableData = songs
      console.log(this.tableData)
    },
    playAll() {
      this.axios(`/api/playlist/track/all?id=${this.$route.query.id}`).then((res) => {
        this.handleSongs(res.data.songs, this.playlist)
        this.$store.commit('updateAudioSrc', this.tableData)
      })
    },
    handleCurrentChange(row, column) {
      this.$store.commit('updateAudioSrc', [row])
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  .resume {
    display: flex;
    height: 500px;
    justify-content: center;
    .left {
      text-align: center;
      width: 500px;
      img {
        width: 300px;
        margin-top: 20px;
        border-radius: 5px;
        border: 7px groove #f5f3f2;
      }
      p {
        .el-button {
          margin: 5px 15px;
          letter-spacing: 2px;
          font-size: 16px;
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
      }
    }
    .right {
      width: 700px;
      .tag {
        display: inline-block;
        margin: 0 15px;
        height: 2em;
        line-height: 2em;
        background: linear-gradient(90deg, #755bea, #ff72c0);
        border-radius: 1em;
        color: white;
        padding: 0 20px;
        letter-spacing: 2px;
      }
      .description {
        white-space: pre-line;
        text-align: left;
        width: 90%;
        margin: 20px auto;
        height: 221px;
        overflow: auto;
      }
    }
  }
}
</style>
