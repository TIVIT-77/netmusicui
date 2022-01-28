<template>
    <div class="header">
        <div style="float: left;">
            <el-tooltip class="item" effect="dark" content="后退" placement="bottom">
                <i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="前进" placement="bottom">
                <i class="el-icon-arrow-right" @click="$router.go(1)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
                <i class="el-icon-refresh" @click="$router.go(0)"></i>
            </el-tooltip>
        </div>
        <div style="float: left;margin-left:30px;width:400px">
            <el-input
                placeholder="搜索音乐"
                prefix-icon="el-icon-search"
                v-model="searchData"
                clearable
            ></el-input>
        </div>
        <div class="login">
            <div v-if="!username">
                <div class="user">
                    <i class="el-icon-user" style="font-size: 30px;"></i>&emsp;
                    <el-input v-model="phone" placeholder="请输入手机号" clearable></el-input>&emsp;
                    <el-input placeholder="请输入密码" v-model="password" show-password clearable></el-input>&emsp;
                    <el-button type="primary" icon="el-icon-check" circle @click="login" style="background-color: white; color: black;"></el-button>
                </div>
            </div>
            <div v-else class="user">
                <span>{{ username }}</span>&nbsp;
                <el-avatar :src="userImgUrl" :alt="username"></el-avatar>
            </div>
        </div>
    </div>
</template>

<script>
const axios = require('axios');
export default {
    data() {
        return {
            searchData: "",
            username: "",
            userImgUrl: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            phone: "",
            password: '',
            userId: "",
        }
    },
    methods: {
        init(){
            axios('/api/search/default').then(res=>{
                console.log(res.data);
            })
        },
        login() {
            axios.post(`/api/login/cellphone`, {
                phone: this.phone,
                password: this.password,
            }).then(res => {
                // console.log(res)
                // console.log(res.data.profile.avatarUrl)
                // console.log(res.data.profile.nickname);
                this.username = res.data.profile.nickname;
                this.userImgUrl = res.data.profile.avatarUrl;
                this.userId = res.data.profile.userId;
                this.$store.commit('updateUserCookie', res.data.cookie)
            }).then(() => {
                //获取每日推荐歌单
                axios.post(`/api/recommend/resource`, {
                    cookie: this.$store.state.userCookie,
                })
                    .then(res => {
                        // this.$store.state.recommendResource=res.data.recommend;
                        this.$store.commit('updateRecommend', res.data.recommend)
                        // console.log(res);
                    })
            })
        }
    }
}
</script>


<style>
.header {
    font-family: YouYuan, STHUPO, Arial, Helvetica, sans-serif;
    height: 60px;
}
.login {
    float: right;
}
.user {
    display: flex;
    justify-content:center;
    align-items: center;
}
.item {
    margin: 7px;
}
.el-input__inner {
    border-radius: 20px;
}
.el-icon-arrow-left:hover {
    color: #fff;
}
.el-icon-arrow-right:hover {
    color: #fff;
}
</style>