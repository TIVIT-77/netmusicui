<template>
    <div>
        <el-carousel type="card" trigger="click">
            <el-carousel-item v-for="(item,key) in imageUrl" :key="key">
                <img :src="item" alt height="100%" width="100%" @click="bannerClick(key)"/>
            </el-carousel-item>
        </el-carousel>

        <div class="title">网友精选碟(歌单)</div>
        <div class="Recommendation">
            <ul>
                <li v-for="(item, i) in playlists" :key="i">
                    <label @click="getPlayListAudio(item)">
                        <img :src="item.coverImgUrl" alt />
                        <a target="view_window">{{ item.name }}</a>
                        <!-- <a target="view_window" :href="`https://music.163.com/playlist?id=${item.id}`">{{ item.name }}</a> -->
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import HomeVue from './Home.vue';
const axios = require('axios');
export default {
    data() {
        return {
            imageUrl: [],
            playlists: [],
            bannerInfoList:[],
        }
    },
    computed: {

    },
    created() {
        this.init();
    },

    methods: {
        init() {
            axios(`/api/banner?type=0`).then(res => {
                for (let item of res.data.banners){
                   this.imageUrl.push(item.imageUrl) 
                }
                this.bannerInfoList=res.data.banners.map(item=>{
                    let parameters={}
                    parameters.targetId=item.targetId
                    parameters.typeTitle=item.typeTitle
                    parameters.url=item.url
                    parameters.encodeId=item.encodeId
                    return parameters
                })
            })
            axios(`/api/top/playlist?limit=40`).then(res => {
                this.playlists = res.data.playlists
            })
        },
        bannerClick(index){
            console.log(index);
            this.bannerInfoList[index].url?window.location.href=this.bannerInfoList[index].url:''
        },
        getPlayListAudio(playlistItem) {
            let loadingInstance = this.$loading({
                text: '正在加载歌单', // 显示在加载图标下方的加载文案
                target: document.querySelector("main"),
                background: 'rgba(0, 0, 0,0.5)', // 遮罩层颜色
            });
            axios(`/api/playlist/track/all?id=${playlistItem.id}`).then(res => {
                let songs = res.data.songs
                songs = songs.map((item,index) => {
                    let parameters = {}
                    parameters.id = item.id
                    parameters.name = item.name
                    parameters.alia = item.alia   //歌曲描述
                    parameters.al = item.al   //专辑
                    parameters.alPicUrl = item.al.picUrl //专辑封面
                    parameters.ar = item.ar   //演唱者
                    parameters.songList = parameters.ar.map(item => {
                        let songsinfo = {}
                        songsinfo.id = item.id
                        songsinfo.name = item.name
                        return songsinfo
                    })
                    parameters.singsString = (parameters.songList.map(item => {
                        return item.name
                    })).join(' / ')
                    parameters.playlistName = playlistItem.name
                    parameters.index=index
                    return parameters
                })
                this.$store.commit('updateAudioSrc', songs)
                loadingInstance.close();
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.Recommendation {
    height: 1100px;
    ul {
        li {
            label {
                cursor: pointer;
            }
            a {
                margin-top: 5px;
                text-decoration: none;
                font-size: 15px;
            }
        }
    }
}
</style>