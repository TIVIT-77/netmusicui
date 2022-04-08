import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recommendResource:[],
    recommendSongsList:[],
    userCookie:'',
    audioSrc:[{"id":1498723813,"name":"玫瑰少年 - 小提琴版（翻自 蔡依林）","alia":[],"al":{"id":98788307,"name":"玫瑰少年","picUrl":"http://p4.music.126.net/Qx8SIwpQPVh9KVhNK1L6WA==/109951166731888934.jpg","tns":[],"pic_str":"109951166731888934","pic":109951166731888930},"alPicUrl":"http://p4.music.126.net/Qx8SIwpQPVh9KVhNK1L6WA==/109951166731888934.jpg","ar":[{"id":12320819,"name":"龚明威","tns":[],"alias":[]}],"songList":[{"id":12320819,"name":"龚明威"}],"singsString":"龚明威","index":0,"dt":240.042,"searchKeyWords":"玫瑰少年"},{"id":1878001125,"name":"再","alia":[],"al":{"id":133204585,"name":"再","picUrl":"http://p4.music.126.net/AvS558nPHm6R2TGt82SbCQ==/109951166382736408.jpg","tns":[],"pic_str":"109951166382736408","pic":109951166382736420},"alPicUrl":"http://p4.music.126.net/AvS558nPHm6R2TGt82SbCQ==/109951166382736408.jpg","ar":[{"id":12276375,"name":"NINEONE#","tns":[],"alias":[]}],"songList":[{"id":12276375,"name":"NINEONE#"}],"singsString":"NINEONE#","index":1,"dt":231.961,"searchKeyWords":"再"}],
    searchSongs:[],
    auditionList:[],
    searchPageNum:1,
    userInfo:{},
    likeIdslist:[],
  },
  mutations: {
    updateRecommend(state,data){
      state.recommendResource = data
    },
    updateRecommendSongsList(state,data){
      state.recommendSongsList = data
    },
    updateUserCookie(state,data){
      state.userCookie=data
    },
    updateAudioSrc(state,data){
      state.audioSrc=data
    },
    updateAuditionList(state,data){
      state.auditionList=data
    },
    updateSearchSongs(state,data){
      state.searchSongs=data
    },
    updateSearchPageNum(state,data){
      state.searchPageNum=data
    },
    updateUserInfo(state,data){
      state.userInfo=data
    },
    updateLikeIdsList(state,data){
      state.likeIdslist=data
    },
  },
  actions: {
  },
  modules: {
  }
})
