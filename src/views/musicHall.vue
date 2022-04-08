<template>
  <div>
    <el-carousel type="card" trigger="click">
      <el-carousel-item v-for="(item, key) in bannerInfoList" :key="key">
        <img :src="item.imageUrl" alt height="100%" width="100%" @click="bannerClick(key)" />
      </el-carousel-item>
    </el-carousel>

    <div class="cardList">
      <p>网友精选碟(歌单)</p>
      <div class="hotDjList">
        <div class="hotDj" v-for="(item, i) in playlists" :key="i" @click="getPlayListAudio(item)">
          <img :src="item.coverImgUrl" alt="item.name" width="100%" />
          <p class="annotation">
            <span>[{{ item.tags.join() }}]</span>
            <span>{{ item.description }}</span>
          </p>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      playlists: [],
      bannerInfoList: [],
    }
  },
  computed: {},
  created() {
    this.init()
  },

  methods: {
    init() {
      axios(`/api/banner?type=0`).then((res) => {
        this.bannerInfoList = res.data.banners
      })
      axios(`/api/top/playlist?limit=42`).then((res) => {
        this.playlists = res.data.playlists
      })
    },
    bannerClick(index) {
      if (this.bannerInfoList[index].url) {
        window.location.href = this.bannerInfoList[index].url.replace('orpheus://','https://music.163.com/#/')
      } else {
        this.axios('/api/song/detail', {
          params: {
            ids: this.bannerInfoList[index].targetId,
          },
        }).then((res) => {
          let loadingInstance = this.$loading({
            text: '正在加载歌单', // 显示在加载图标下方的加载文案
            target: document.querySelector('main'),
            background: 'rgba(0, 0, 0,0.5)', // 遮罩层颜色
          })
          this.handleSongs(res.data.songs)
          loadingInstance.close()
        })
      }
    },
    getPlayListAudio(playlistItem) {
      let loadingInstance = this.$loading({
        text: '正在加载歌单', // 显示在加载图标下方的加载文案
        target: document.querySelector('main'),
        background: 'rgba(0, 0, 0,0.5)', // 遮罩层颜色
      })
      axios(`/api/playlist/track/all?id=${playlistItem.id}`).then((res) => {
        this.handleSongs(res.data.songs,playlistItem)
        loadingInstance.close()
      })
    },
    handleSongs(songs,playlistItem={}) {
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
        parameters.index = index
        return parameters
      })
      this.$store.commit('updateAudioSrc', songs)
    },
  },
}
</script>

<style lang="scss" scoped></style>
