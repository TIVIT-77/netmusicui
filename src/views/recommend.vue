<template>
    <div>
        <h1>this is Recommend推荐页面</h1>
        <div class="title">每日歌单推荐</div>
        <div class="Recommendation">
            <ul>
                <li v-for="(item,i) in recommend" :key="i">
                    <img :src="item.picUrl" alt/>
                    <a :href="`https://music.163.com/playlist?id=${item.id}`" target="view_window">{{ item.name }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    computed:{
        recommend() {
            let list = []
            for (let item of this.$store.state.recommendResource) {
                list.push(item);
            }
            return list
        }
    }
}
</script>

<style lang="scss" scoped>

</style>