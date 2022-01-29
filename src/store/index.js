import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recommendResource:[],
    userCookie:'',
    audioSrc:[],
    searchSongs:[],
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
    updateSearchSongs(state,data){
      state.searchSongs=data
    },
  },
  actions: {
  },
  modules: {
  }
})
