<template>
  <div>
    <el-carousel type="card">
      <el-carousel-item v-for="(item, key) in bannerInfoList" :key="key">
        <img :src="item.pic" alt height="100%" @click="bannerClick(key)" />
      </el-carousel-item>
    </el-carousel>

    <div class="cardList">
      <p>热门电台</p>
      <div class="hotDjList">
        <div class="hotDj" v-for="(item, i) in list" :key="i" @click="getDjDetail(item)">
          <img :src="item.picUrl" alt="item.name" width="100%" />
          <p class="annotation">
            <span>[{{ item.category }}]</span>
            <span>{{ item.copywriter }}</span>
          </p>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.init()
  },
  data() {
    return {
      bannerInfoList: [],
      list: [],
      djList: [],
    }
  },
  methods: {
    init() {
      this.axios('/api/dj/banner').then((res) => {
        this.bannerInfoList = res.data.data
      })
      this.axios.get('/api/dj/hot').then((res) => {
        this.list = res.data.djRadios
      })
    },
    getDjDetail(item) {
      let loadingInstance = this.$loading({
        text: '正在努力加载', // 显示在加载图标下方的加载文案
        target: document.querySelector('main'),
        background: 'rgba(0, 0, 0,0.5)', // 遮罩层颜色
      })
      //电台 - 节目
      this.axios
        .get('/api/dj/program', {
          params: {
            rid: item.id,
            limit: 999999,
          },
        })
        .then((res) => {
          let radio = res.data.programs
          radio = radio.map((item, index) => {
            let parameters = {}
            parameters.id = item.mainSong.id
            parameters.name = item.mainSong.name
            parameters.radio = item.radio
            parameters.alia = item.radio.desc //描述
            parameters.alPicUrl = parameters.radio.intervenePicUrl //封面
            parameters.singsString = parameters.radio.name
            parameters.playlistName = parameters.radio.name
            parameters.index = index
            return parameters
          })
          this.$store.commit('updateAudioSrc', radio)
          loadingInstance.close()
        })
    },
    bannerClick(index) {
      if (this.bannerInfoList[index].targetId && this.bannerInfoList[index].url && this.bannerInfoList[index].url.includes('orpheus://program/')) {
        this.axios('/api/dj/program/detail', {
          params: {
            id: this.bannerInfoList[index].targetId,
          },
        }).then((res) => {
          let songs = res.data.program.songs
          songs.forEach((item) => {
            item.radio = res.data.program.radio
            item.alia = res.data.program.radio.desc //描述
            res.data.program.songs.map((item) => {
              item.alPicUrl = item.album.picUrl
            }) //封面
            item.singsString = item.artists
              .map((item) => {
                return item.name
              })
              .join(' / ')
            item.playlistName = res.data.program.mainSong.name
            item.index = index
          })
          console.log(songs[0].singsString)
          this.$store.commit('updateAudioSrc', songs)
        })
      } else if(this.bannerInfoList[index].targetId && this.bannerInfoList[index].url && this.bannerInfoList[index].url.includes('orpheus://djradio/')){
        let item=this.bannerInfoList[index]
        item.id=item.targetId
        this.getDjDetail(item)
      }else {
        // window.location.href = this.bannerInfoList[index].url.replace('orpheus://','https://music.163.com/#/')
        window.open(this.bannerInfoList[index].url.replace('orpheus://', 'https://music.163.com/#/'))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-carousel__mask {
  background-color: unset !important;
}
</style>
