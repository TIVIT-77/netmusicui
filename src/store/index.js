import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recommendResource:[],
    userCookie:'',
    audioSrc:[],
    searchSongs:[],
    auditionList:[],
    searchPageNum:1,
  },
  mutations: {
    updateRecommend(state,data){
      state.recommendResource = data
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
  },
  actions: {
  },
  modules: {
  }
})
