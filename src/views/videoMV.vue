<template>
    <div class="page">
        <el-dialog
            :title="elDialogName"
            :visible.sync="dialogVisible"
            width="70%"
            :append-to-body="true"
            center
            destroy-on-close
            @close="dialogClose"
        >
            <video
                :src="videoSrc"
                controls="controls"
                width="95%"
                :poster="videoPicSrc"
            >您的浏览器不支持 video 标签。</video>
        </el-dialog>

        <h1>推荐MV</h1>

        <el-carousel trigger="click" height="500px" :autoplay="false" indicator-position="outside">
            <el-carousel-item v-for="(item, key) in mvRecommend" :label="item.name" :name="item.name" :key="key" >
                <el-image fit="contain" :src="item.picUrl" @click="getMv(item, 1)"></el-image>
            </el-carousel-item>
        </el-carousel>
        <h1>MV</h1>
        <div class="recommendMv">
            <div v-for="(item, key) in mvList" :key="key" @click="getMv(item,2)">
                <img :src="item.cover" />
                <p>{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>import axios from "axios"

export default {
    created() {
        this.init()
    },
    data() {
        return {
            mvRecommend: [],
            mvList: [],
            dialogVisible: false,
            videoSrc: '',
            elDialogName: '',
            videoPicSrc: '',
        }
    },
    methods: {
        init() {
            axios('/api/personalized/mv').then(res => {
                this.mvRecommend = res.data.result
            })
            axios('/api/mv/all').then(res => {
                this.mvList = res.data.data
            })
        },
        getMv(item, type) {
            //post请求，网易云返回数据会延迟
            axios(`/api/mv/url?id=${item.id}`).then(res => {
                console.log(res.data.data);
                this.videoSrc = res.data.data.url
                this.elDialogName = item.name
                this.videoPicSrc = type == 1 ? item.picUrl : item.cover
                this.dialogVisible = true
            })
            // window.location.href=`https://music.163.com/?from=itab#/mv?id=${item.id}`
        },
        dialogClose() {
            this.videoSrc = ''
            this.videoPicSrc = ''
            console.log('dialogClose');
        }
    }

}
</script>

<style lang="scss" scoped>
.page {
    width: 100%;
    h1 {
        border-bottom: red 1px solid;
        padding-bottom: 30px;
    }
    .recommendMv {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        cursor: pointer;
    }
    img {
        width: 700px;
        margin: 50px;
    }
    p {
        margin-top: -40px;
    }
}
::v-deep .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
}
.el-carousel{
    width: 100%;
    .el-image{
        width: 100%;
        height: 100%;
    }
    
}
</style>