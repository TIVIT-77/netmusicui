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
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="歌曲名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="singsString" label="歌手" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dt" label="时长" :formatter="formatSecond" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
</template>

<script>
function realFormatSecond(second) {
    var secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)
        var hours = Math.floor(second / 3600)
        second = second - hours * 3600
        var mimute = Math.floor(second / 60)
        second = second - mimute * 60
        return ('0' + hours).slice(-2) + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
        return '00:00:00'
    }
}
import axios from "axios"
export default {
    data() {
        return {
            likeflag: { ...false },
            playList: [],
            searchType: 1,//type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
        }
    },
    methods: {
        handleCurrentChange(row) {
            this.playList.unshift(row)
            this.$store.commit('updateAudioSrc', this.playList)
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'background-color:#3a3a3a;color:#fff;'
        },
        formatSecond(row) {
            return realFormatSecond(row.dt)
        }
    },
    filters: {
        formatSecond(second) {
            return realFormatSecond(second)
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