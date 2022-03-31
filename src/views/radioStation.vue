<template>
    <div>
        <el-carousel type="card">
            <el-carousel-item v-for="(item, key) in banner" :key="key">
                <img :src="item.pic" alt height="100%" />
            </el-carousel-item>
        </el-carousel>

        <div class="cardList">
            <p>热门电台</p>
            <div class="hotDjList">
                <div class="hotDj" v-for="(item, i) in list" :key="i">
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
</template>

<script>
export default {
    created() {
        this.init()
    },
    data() {
        return {
            banner: [],
            list: [],
        }
    },
    methods: {
        init() {
            this.axios('/api/dj/banner').then(res => {
                console.log(res.data);
                this.banner = res.data.data
            })
            this.axios.get('/api/dj/hot').then(res => {
                this.list = res.data.djRadios
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>