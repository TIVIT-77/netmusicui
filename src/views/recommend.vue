<template>
  <div v-if="$store.state.userCookie">
    <div class="cardList">
      <p>每日歌单推荐</p>
      <div class="hotDjList">
        <div class="hotDj" v-for="(item, i) in recommend" :key="i" @click="getPlayListAudio(i)">
          <img :src="item.picUrl" alt="item.name" width="100%" />
          <p class="annotation">
            <!-- <span>[{{ item.category }}]</span> -->
            <el-tooltip effect="dark" :content="item.copywriter" placement="bottom">
              <span>{{ item.copywriter }}</span>
            </el-tooltip>
          </p>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="cardList">
      <p>每日推荐歌曲</p>
      <div class="hotDjList">
        <div class="hotDj" v-for="(item, i) in recommendSongsList" :key="i + 6" @click="getPlayListAudio(i, 'songs')">
          <img :src="item.alPicUrl" alt="item.name" width="100%" />
          <p class="annotation">
            <!-- <span>[{{ item.category }}]</span> -->
            <el-tooltip effect="dark" :content="item.reason" placement="bottom">
              <span>{{ item.reason }}</span>
            </el-tooltip>
          </p>
          <p>{{ item.name }}--{{ item.singer }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="promptLogin">
    <h1>请先登录账号</h1>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  computed: {
    recommend() {
      let list = []
      for (let item of this.$store.state.recommendResource) {
        list.push(item)
      }
      list.slice(0, 7) //只取六个
      return list
    },
    recommendSongsList() {
      let list = []
      if (this.$store.state.recommendSongsList.dailySongs && this.$store.state.recommendSongsList.dailySongs.length > 0) {
        this.$store.state.recommendSongsList.dailySongs.forEach((item) => {
          list.push(item)
        })
        list = list.map((item, index) => {
          let parameters = {}
          parameters.id = item.id
          parameters.name = item.name
          parameters.alia = item.alia //歌曲描述
          parameters.al = item.al //专辑
          parameters.alPicUrl = item.al.picUrl //专辑封面
          parameters.ar = item.ar //演唱者List
          parameters.singer = parameters.ar
            .map((item) => {
              return item.name
            })
            .join('/')
          parameters.reason = item.reason //推荐原因
          return parameters
        })
      }
      return list.slice(0, parseInt(list.length / 6) * 6)
    },
  },
  methods: {
    handleSongs(data, i) {
      let songs = data
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
        i ? (parameters.playlistName = this.$store.state.recommendResource[i].name) : ''
        parameters.index = index
        return parameters
      })
      return songs
    },
    getPlayListAudio(i, type) {
      let loadingInstance = this.$loading({
        text: '正在加载歌单', // 显示在加载图标下方的加载文案
        target: document.querySelector('main'),
        background: 'rgba(0, 0, 0,0.5)', // 遮罩层颜色
      })
      if (type == 'songs') {
        let songs = this.handleSongs(this.$store.state.recommendSongsList.dailySongs.slice(i,i+1))
        this.$store.commit('updateAudioSrc',songs)
        loadingInstance.close()
      } else {
        axios(`/api/playlist/track/all?id=${this.$store.state.recommendResource[i].id}`).then((res) => {
          let songs = this.handleSongs(res.data.songs,i)
          this.$store.commit('updateAudioSrc', songs)
          loadingInstance.close()
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.promptLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 760px;
}
.title {
  padding: 50px 0;
}
li {
  margin: 50px;
}
</style>
