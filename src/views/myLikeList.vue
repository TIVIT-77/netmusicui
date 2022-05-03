<template>
  <div>
    <template v-if="this.$store.state.userCookie">
      <div class="cardList">
        <p>收藏的歌单</p>
        <div class="hotDjList">
          <div
            class="hotDj"
            v-for="(item, i) in playlist"
            :key="i"
            @click.stop="
              $router.push({
                name: 'listDetail',
                query: {
                  id: item.id,
                },
              })
            "
          >
            <img :src="item.coverImgUrl" alt="item.name" width="100%" />
            <div class="bottom">
              <div>
                <i class="el-icon-service"></i>
                <span> {{ parseInt(item.playCount / 10000) }}万 </span>
              </div>
              <i class="el-icon-video-play" @click.stop="getPlayListAudio(item)"></i>
            </div>
            <p class="annotation">
              <span v-if="item.tags.join()">[{{ item.tags.join() }}]</span>
              <span>{{ item.description }}</span>
            </p>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="empty">
        <span><i class="el-icon-user-solid"></i>请先登录账号</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  watch: {
    '$store.state.userCookie'(val) {
      if (val) {
        this.init()
      }
    },
  },
  data() {
    return {
      playlist: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.$store.state.userInfo && this.$store.state.userInfo.account && this.$store.state.userInfo.account.id) {
        this.axios('/api/user/playlist', {
          params: {
            uid: this.$store.state.userInfo.account.id,
          },
        }).then((res) => {
          this.playlist = res.data.playlist
        })
      }
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
      this.$store.commit('updateAudioSrc', songs)
    },
    getPlayListAudio(playlistItem) {
      this.axios(`/api/playlist/track/all?id=${playlistItem.id}`).then((res) => {
        this.handleSongs(res.data.songs, playlistItem)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.empty {
  height: 833px;
  line-height: 833px;
  font-size: larger;
}
.cardList {
  border: 0 !important;
}
</style>
