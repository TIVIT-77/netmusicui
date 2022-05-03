import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import recommend from '../views/recommend.vue'
import musicHall from '../views/musicHall.vue'
import videoMV from '../views/videoMV.vue'
import radioStation from '../views/radioStation.vue'
import myLike from '../views/myLike.vue'
import myLikeListVue from '../views/myLikeList.vue'
import search from '../views/search.vue'
import listDetail from '../views/listDetail.vue'
Vue.use(VueRouter)
// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/musicHall',
      },
      {
        path: 'recommend',
        component: recommend,
      },
      {
        path: 'musicHall',
        component: musicHall,
      },
      {
        path: 'videoMV',
        component: videoMV,
      },
      {
        path: 'radioStation',
        component: radioStation,
      },
      {
        path: 'myLike',
        component: myLike,
        meta: {
          name: '我的喜欢',
          stateType: 1,
        },
      },
      {
        path: 'recentlyPlayed',
        component: myLike,
        meta: {
          name: '最近播放',
          stateType: 2,
        },
      },
      {
        path: 'auditionList',
        component: myLike,
        meta: {
          name: '试听列表',
          stateType: 3,
        },
      },
      {
        path: 'myLikeList',
        name: 'myLikeList',
        component: myLikeListVue,
      },
      {
        path: 'listDetail',
        name: 'listDetail',
        component: listDetail,
      },
      {
        path: 'search',
        component: search,
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router

