<template>
    <div class="page">
        <h1>推荐MV</h1>
        <div class="recommendMv">
            <div v-for="(item, key) in mvRecommend" :key="key" width>
                <img :src="item.picUrl" />
                <p>{{ item.name }}</p>
            </div>
        </div>
        <h1>MV</h1>
        <div class="recommendMv">
            <div v-for="(item, key) in mvList" :key="key" width>
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
            mvList:[]
        }
    },
    methods: {
        init() {
            axios('/api/personalized/mv').then(res => {
                this.mvRecommend = res.data.result
            })
            axios('http://localhost:9527/api/mv/all').then(res=>{
                this.mvList=res.data.data
            })
        },
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
    }
    img {
        width: 700px;
        margin: 50px;
        cursor: pointer;
    }
    p {
        margin-top: -40px;
    }
}
</style>