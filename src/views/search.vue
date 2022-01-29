<template>
    <div>
        <el-table
        ref="searchTable"
            height="760px"
            :data="$store.state.searchSongs"
            style="width: 100%"
            :row-style="{ 'cursor': 'pointer', 'background-color': '#eceeec' }"
            :header-cell-style="tableHeaderColor"
            highlight-current-row
            @row-click="handleCurrentChange"
        >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="歌曲名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="singsString" label="歌手" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from "axios"
export default {
    data() {
        return {
            likeflag: { ...false },
            playList:[]
        }
    },
    methods: {
        
        handleCurrentChange(row){
            this.playList.unshift(row)
            this.$store.commit('updateAudioSrc', this.playList)
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'background-color:#3a3a3a;color:#fff;'
        }
    }
}
</script>

<style lang="scss" scoped>
.cell {
    i {
        font-size: 35px;
    }
}
</style>