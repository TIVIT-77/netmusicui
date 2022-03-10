<template>
    <div>
        <div v-if="$store.state.searchSongs && $store.state.searchSongs.length > 0">
            <div class="edit">
                <div class="searchTitle">搜索：{{ $store.state.searchSongs[0].searchKeyWords }}</div>
                <div class="round">
                    <el-button
                        type="primary"
                        round
                        icon="el-icon-document-copy"
                        @click="add(1)"
                    >添加到播放列表</el-button>
                    <el-button
                        type="success"
                        round
                        icon="el-icon-folder-add"
                        @click="add(2)"
                    >添加到试听列表</el-button>
                </div>
            </div>
            <el-table
                ref="searchTable"
                height="735px"
                :data="$store.state.searchSongs"
                style="width: 1720px"
                :row-style="{ 'cursor': 'pointer', 'background-color': '#eceeec' }"
                :header-cell-style="tableHeaderColor"
                highlight-current-row
                @row-click="handleCurrentChange"
                @select="select($event)"
                @select-all="select($event)"
            >
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="歌曲名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="singsString" label="歌手" show-overflow-tooltip></el-table-column>
                <el-table-column
                    prop="dt"
                    label="时长"
                    :formatter="formatSecond"
                    show-overflow-tooltip
                ></el-table-column>
            </el-table>
            <el-alert type="success" :closable="false" center effect="dark" v-if="isLoading||isEnd">
                <template slot="title" v-if="isLoading">
                    <i class="el-icon-loading"></i> 正在努力加载...
                </template>
                <template slot="title" v-else-if="isEnd">
                    <i class="el-icon-finished"></i> 到底啦...
                </template>
            </el-alert>
        </div>
        <template v-else>
            <h1>还没有搜索关键词哦</h1>
        </template>
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
    updated() {
        if (this.$store.state.searchSongs && this.$store.state.searchSongs.length > 0) {
            // 获取表格对象
            let dom = document.querySelector(".el-table__body-wrapper");
            dom.addEventListener("scroll", (v) => {
                const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
                // 判断是否到底，并且防止用户重复触发，可以加载下一页
                if (scrollDistance <= 1 && this.isLoading==false) {
                    if (this.$store.state.searchPageNum < 11) {
                        this.isLoading = true
                        setTimeout(() => {
                            this.$store.commit('updateSearchPageNum', ++this.$store.state.searchPageNum)
                            this.isLoading = false
                        }, 3000)
                    } else {
                        this.isEnd = true
                    }
                }
            });
        }
    },
    watch: {
        '$store.state.searchSongs'(val) {
            console.log(val);
        }
    },
    data() {
        return {
            likeflag: { ...false },
            playList: [],
            searchType: 1,//type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
            selectedList: [],
            isLoading: false,
            isEnd: false
        }
    },
    methods: {
        handleCurrentChange(row) {
            this.$store.state.audioSrc.unshift(row)
            // this.playList.unshift(row)
            // this.$store.commit('updateAudioSrc', this.playList)
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'background-color:#3a3a3a;color:#fff;'
        },
        formatSecond(row) {
            return realFormatSecond(row.dt)
        },
        select(selection) {
            this.selectedList = selection
            console.log('this.selectedList====', this.selectedList);
        },
        add(type) {
            switch (type) {
                case 1:
                    if(this.selectedList&&this.selectedList.length>0){
                        this.$store.state.audioSrc.unshift(...this.selectedList)
                    }else{
                        this.$message.error('你还没有选中歌曲')
                    }
                    
                    break;
                case 2:
                    this.$store.state.auditionList.unshift(...this.selectedList)
                    break;
            }
        },
    },
    filters: {
        formatSecond(second) {
            return realFormatSecond(second)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-alert{
    bottom: 35px;
    z-index: 99999;
}
.edit {
    display: flex;
    align-content: center;
    text-align: left;
    .searchTitle {
        font-size: 40px;
    }
    .round {
        text-align: right;
        .el-button {
            font-size: 15px;
            margin: 10px 15px;
        }
        padding-left: 25px;
    }
}
.cell {
    i {
        font-size: 35px;
    }
}
::v-deep .el-table th.gutter {
    display: table-cell !important;
    background: #3a3a3a;
}
</style>