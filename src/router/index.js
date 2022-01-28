import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import recommend from '../views/recommend.vue'
import musicHall from '../views/musicHall.vue'
import videoMV from '../views/videoMV.vue'
import radioStation from '../views/radioStation.vue'
import myLike from '../views/myLike.vue'
import download from '../views/download.vue'
import recentlyPlayed from '../views/recentlyPlayed.vue'
import auditionList from '../views/auditionList.vue'
import purchasedMusic from '../views/purchasedMusic.vue'
import myLikeListVue from '../views/myLikeList.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    component:Home,
    children: [
      {
        path:"",
        redirect:"/musicHall",
      },
      {
        path:"recommend",
        component:recommend,
      },
      {
        path: 'musicHall',
        component:musicHall,
      },
      {
        path: 'videoMV',
        component:videoMV,
      },
      {
        path: 'radioStation',
        component:radioStation,
      },
      {
        path: 'myLike',
        component:myLike,
      },
      {
        path: 'download',
        component:download,
      },
      {
        path: 'recentlyPlayed',
        component:recentlyPlayed,
      },
      {
        path: 'auditionList',
        component:auditionList,
      },
      {
        path: 'purchasedMusic',
        component:purchasedMusic,
      },
      {
        path: 'myLikeList',
        component:myLikeListVue,
      },
    ]
  },



]

const router = new VueRouter({
  routes
})

export default router