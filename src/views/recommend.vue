<template>
    <div v-if="$store.state.userCookie">
        <div class="cardList">
            <p>每日歌单推荐</p>
            <div class="hotDjList">
                <div class="hotDj" v-for="(item, i) in recommend" :key="i" @click="getPlayListAudio(i)">
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
    <div v-else class="promptLogin">
        <h1>请先登录账号</h1>
    </div>
</template>

<script>
const axios = require('axios');
export default {
    computed: {
        recommend() {
            let list = []
            for (let item of this.$store.state.recommendResource) {
                list.push(item);
            }
            return list
        }
    },
    methods: {
        getPlayListAudio(i) {
            let loadingInstance = this.$loading({
                text: '正在加载歌单', // 显示在加载图标下方的加载文案
                target: document.querySelector("main"),
                background: 'rgba(0, 0, 0,0.5)', // 遮罩层颜色
            });
            console.log(this.$store.state.recommendResource);
            axios(`/api/playlist/track/all?id=${this.$store.state.recommendResource[i].id}`).then(res => {
                let songs = res.data.songs
                songs = songs.map((item, index) => {
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
                    parameters.playlistName = this.$store.state.recommendResource[i].name
                    parameters.index = index
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
.promptLogin{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 760px;
}
.title{
    padding: 50px 0;
}
li{
    margin: 50px;
}
</style>