<template>
    <div>
        <h1 class="logo"></h1>
        <div class="leftMenu">
            <el-menu router :default-active="active" class="el-menu-vertical-demo" ref="menu" background-color="#242424" text-color="white">
                <el-submenu index="1">
                    <template slot="title">
                        <span>在线音乐</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="recommend" route="recommend">推荐</el-menu-item>
                        <el-menu-item index="musicHall" route="musicHall">音乐馆</el-menu-item>
                        <el-menu-item index="videoMV" route="videoMV">视频MV</el-menu-item>
                        <el-menu-item index="radioStation" route="radioStation">电台</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <span>我的音乐</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="myLike" route="myLike">我喜欢</el-menu-item>
                        <el-menu-item index="download" route="download">本地和下载</el-menu-item>
                        <el-menu-item index="recentlyPlayed" route="recentlyPlayed">最近播放</el-menu-item>
                        <el-menu-item index="auditionList" route="auditionList">试听列表</el-menu-item>
                        <el-menu-item index="purchasedMusic" route="purchasedMusic">已购音乐</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <span>我的歌单</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="myLikeList" route="myLikeList">我的喜欢歌单</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$refs.menu.open("1")
        this.$refs.menu.open("2")
        this.$refs.menu.open("3")
    },
    data() {
        return {

        }
    },
    computed: {
        active() {
            return this.$route.path.slice(1)
        }
    },
    methods: {

    }
}
</script>

<style lang="scss">
.logo {
    background: url(https://s2.music.126.net/style/web2/img/frame/topbar.png?79b15b371ac691457849f05e64b4c40a)
        no-repeat 0 9999px;
    color: #333;
    font-family: Arial, Helvetica, sans-serif;
    word-wrap: break-word;
    word-break: break-word;
    padding: 0;
    margin: auto;
    width: 176px;
    height: 69px;
    background-position: 0 0;
}
</style>