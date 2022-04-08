<template>
  <div>
    <template v-if="this.$store.state.userCookie">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="歌曲名"></el-table-column>
        <el-table-column prop="singsString" label="歌手"> </el-table-column>
        <el-table-column prop="dt" label="时长" :formatter="formatSecond"> </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <div class="empty">
        <el-empty description="请先登录"></el-empty>
      </div>
    </template>
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
    if (this.$store.state.userCookie) {
      this.init()
    }
  },
  data() {
    return {
      tableData: [],
      likeIdsList: [],
    }
  },
  methods: {
    init() {
      this.axios('/api/likelist', {
        params: {
          uid: this.$store.state.userInfo.account.id,
        },
      }).then((res) => {
        this.likeIdsList = res.data.ids
        this.axios('/api/song/detail', {
          params: {
            ids: this.likeIdsList.join(','),
          },
        }).then((res) => {
          this.handleSongs(res.data.songs)
        })
      })
    },
    handleSongs(songs, playlistItem = {}) {
      // songs = res.data.songs
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
        parameters.playlistName = playlistItem.name
        parameters.dt = item.dt / 1000
        parameters.index = index
        return parameters
      })
      this.tableData = songs
      console.log(this.tableData)
      // this.$store.commit('updateAudioSrc', songs)
    },
    formatSecond(row) {
      return realFormatSecond(row.dt)
    },
  },
}
</script>

<style lang="scss" scoped>
.empty {
  height: 833px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
