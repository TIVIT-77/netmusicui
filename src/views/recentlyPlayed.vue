<template>
  <div>
    <h1>this is recentlyPlayed最近播放</h1>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="歌曲名"></el-table-column>
      <el-table-column prop="singsString" label="歌手"> </el-table-column>
      <el-table-column prop="dt" label="时长" :formatter="formatSecond"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    }
  },
}
</script>

<style lang="scss" scoped></style>
