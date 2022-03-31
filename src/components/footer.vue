<template>
  <div class="footer">
    <div class="content">
      <div class="control">
        <el-badge :value="this.$store.state.audioSrc.length" type="primary">
          <el-popover width="400" trigger="click">
            <el-table
              ref="table"
              :data="$store.state.audioSrc"
              height="500"
              highlight-current-row
              @current-change="handleCurrentChange"
              :row-style="{ 'cursor': 'pointer' }"
              empty-text="播放列表还没有歌曲哦 T-T"
            >
              <el-table-column type="index"></el-table-column>
              <!-- <el-table-column :label="'播放列表 '+$store.state.audioSrc[0].playlistName" show-overflow-tooltip> 动态表头会导致el-table底部空白，el-table__body-wrapper is-scrolling-left元素高度计算错误，使用table表格时，表头信息需要一次性加载完整，如果是后期往表头数据中加载新的表头，就极易出现高度不稳定的问题。 -->
              <el-table-column label="播放列表" show-overflow-tooltip>
                <template slot="header" slot-scope>
                  <el-button type="text" disabled style="cursor: auto;">播放列表</el-button>
                  <el-button
                    type="text"
                    @click="$store.commit('updateAudioSrc', [])"
                    style="float:right"
                  >清空</el-button>
                </template>
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>&emsp;
                  <span>{{ scope.row.singsString }}</span>
                </template>
              </el-table-column>
            </el-table>
            <i class="el-icon-tickets" slot="reference"></i>
          </el-popover>
        </el-badge>

        <i class="el-icon-arrow-left" @click="prev"></i>
        <i v-if="audio.playing" class="el-icon-video-pause" @click="pause"></i>
        <i v-else class="el-icon-video-play" @click="play"></i>
        <i class="el-icon-arrow-right" @click="next"></i>
        <el-popover trigger="click">
          <el-card>
            <div slot="header">
              <i v-if="audio.vol == 0" class="el-icon-turn-off-microphone" @click="audio.vol = 50"></i>
              <i v-else class="el-icon-microphone" @click="audio.vol = 0"></i>
            </div>
            <div class="cardContent">
              <el-slider v-model="audio.vol" vertical height="200px" class="vol"></el-slider>
            </div>
          </el-card>
          <i
            :class="audio.vol ? 'el-icon-microphone' : 'el-icon-turn-off-microphone'"
            slot="reference"
          ></i>
        </el-popover>
      </div>
      <div class="audio">
        <div class="songDetail">
          <img :src="audio.alSrc" @click="openLyric" />
          <span>{{ audio.currentTime | formatSecond }}</span>
        </div>
        <div class="nameSlider">
          <h5 class="songName">
            <span>{{ audio.songName }}</span>
            <span>{{ audio.singName }}</span>
          </h5>
          <el-slider
            v-model="audio.currentTime"
            :format-tooltip="realFormatSecond"
            :max="audio.maxTime"
            @change="changeCurrentTime"
            @mousedown.native="audio.sliderFlag = false"
            @mouseup.native="audio.sliderFlag = true"
          ></el-slider>
        </div>
        <span>{{ audio.maxTime | formatSecond }}</span>
      </div>
      <div class="control">
        <i v-if="likeStarFlag" class="el-icon-star-on" @click="likeStar"></i>
        <i v-else class="el-icon-star-off" @click="likeStar"></i>
      </div>
    </div>
    <audio
      :v-show="false"
      ref="audio"
      @pause="audio.playing = false"
      @play="audio.playing = true"
      @loadedmetadata="getMaxTime"
      @timeupdate="getCurrentTime"
      height="60px"
      :src="audio.audioSrc"
      @ended="audioEended"
      autoplay
    ></audio>
    <el-dialog
      :title="this.audio.songName"
      :visible.sync="audio.lyricDialogVisible"
      fullscreen
      append-to-body
      center
    >
      <template slot="title">
        <h1>{{ this.audio.songName }}</h1>
        <h2>{{ this.audio.singName }}</h2>
      </template>
      <div class="lyricBox">
        <el-table
          height="700px"
          ref="lyricTable"
          :data="audio.lyricTableData"
          highlight-current-row
          @current-change="lyricCurrentChange"
          empty-text="暂无歌词 T-T"
          @row-click="lyricClick"
        >
          <el-table-column property="lyric" align="center">
            <template slot-scope="scope">
              <h3>{{ scope.row.lyric }}</h3>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>import axios from "axios"

// 将整数转换成 时：分：秒的格式
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
export default {
  created() {
    this.getLyric()
    console.log('this.audio.currentRow===', this.audio.currentRow);
  },
  watch: {
    '$store.state.audioSrc'(val) {
      if (val.length > 0) {
        this.audio.index = -1
        this.next()
      }
      this.$message.success('播放列表已更新')
    },
    '$store.state.userInfo'(val) {
      this.likeList()
    },
    // 'audio.audioSrc'() {
    //   console.log('audioSrc is changed');
    // },
    'audio.vol'(value) {
      this.$refs.audio.volume = value / 100
      // console.log(this.$refs.audio.volume);
    },

  },
  data() {
    return {
      likeStarFlag: false,
      audio: {
        songName: '烈火战马+空城计+重庆魂 (Live)',//歌名
        singName: 'GAI周延',//演唱者
        playing: false,// 该字段是音频是否处于播放状态的属性
        currentTime: 0, // 音频当前播放时长
        sliderFlag: true,
        maxTime: 0,// 音频最大播放时长
        index: 0,//歌单列表index
        musicId: 1478384763,
        abilityPlay: false,
        audioSrc: `https://music.163.com/song/media/outer/url?id=1478384763.mp3`,
        alSrc: "https://p1.music.126.net/NJf-GE3JeTimrsOvh05Flg==/109951165309368718.jpg",
        vol: 50,
        lyricDialogVisible: false,//歌词界面
        lyricTableData: [],//歌词
        currentLyricIndex: 0,//当前播放歌词
        currentRow: {
          "id": 1478384763,
          "name": "烈火战马+空城计+重庆魂 (Live)",
          "alia": [],
          "al": {
            "id": 95266973,
            "name": "中国新说唱2020 第五期",
            "picUrl": "https://p1.music.126.net/NJf-GE3JeTimrsOvh05Flg==/109951165309368718.jpg",
            "tns": [],
            "pic_str": "109951165309368718",
            "pic": 109951165309368720
          },
          "alPicUrl": "https://p1.music.126.net/NJf-GE3JeTimrsOvh05Flg==/109951165309368718.jpg",
          "ar": [
            {
              "id": 1211046,
              "name": "GAI周延",
              "tns": [],
              "alias": []
            }
          ],
          "songList": [
            {
              "id": 1211046,
              "name": "GAI周延"
            }
          ],
          "singsString": "GAI周延",
          "playlistName": "说唱的美妙旋律 富有节奏和情感",
          "index": 39
        },//当前歌曲
      }
    }
  },
  methods: {
    // 播放音频
    play() {
      this.$refs.audio.play()
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause()
    },
    //滑动进度条
    //element的slider滑块组件BUG,当拖动进度松开，进度会回到原来的位置，而快速拖动和点击进度条则不会出现
    //原因：拖动进度条index值会被数据绑定监听Audio对象值的this.audio.currentTime覆盖
    //解决方案：利用鼠标点击事件改变audio.sliderFlag，实现按下时不绑定
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = index
      console.log('滑动进度条的index', index);
    },
    // 下一首
    next() {
      if (this.audio.index < this.$store.state.audioSrc.length) {
        this.playability(++this.audio.index)
      } else {
        this.$store.state.audioSrc.length == 0 ? this.$notify({
          title: ('还没有选择歌单哦 OvO'),
          iconClass: 'el-icon-star-off'
        }) : this.$notify.error('歌单已经到底啦 =A=')
      }
    },
    // 上一首
    prev() {
      if (this.audio.index > 0) {
        this.playability(--this.audio.index)
      } else {
        this.$store.state.audioSrc.length == 0 ? this.$notify({
          title: ('还没有选择歌单哦 OvO'),
          iconClass: 'el-icon-star-off'
        }) : this.$notify.error('歌单已经到头啦 =A=')
      }
    },
    //校验是否能播放
    playability(index) {
      this.checkSong(index).then(() => {
        if (this.audio.abilityPlay) {
          let loadingInstance = this.$loading({
            text: '正在切换歌曲哦', // 显示在加载图标下方的加载文案
            target: document.querySelector("footer"),
            background: 'rgba(255, 255, 255,0.5)', // 遮罩层颜色
          });
          this.$refs.table.setCurrentRow(this.$store.state.audioSrc[index])
          loadingInstance.close();
        } else {
          this.next()
        }
      })
    },
    // 检查音乐是否可用
    async checkSong(i) {
      await axios(`/api/check/music?id=${this.$store.state.audioSrc[i].id}`).then(res => {
        console.log('歌曲ID======', this.$store.state.audioSrc[i].id, res.data);
        this.audio.abilityPlay = res.data.success
        this.$notify.success({
          title: res.data.message,
          message: `为您播放 《${this.$store.state.audioSrc[i].name}》 ${this.$store.state.audioSrc[i].singsString}`
        })
        this.audio.abilityPlay = true
      }).catch(err => {
        console.log('err================', err);
        console.log('err.response=======', err.response);
        this.audio.abilityPlay = false
        this.$notify.error({
          title: `Sorry`,
          message: `歌曲： ${this.$store.state.audioSrc[i].name},${err.response.data.message.slice(-4)}`
        })
        this.audio.abilityPlay = false
      })
      return this.audio.abilityPlay
    },
    getMaxTime(val) {
      this.audio.maxTime = val.target.duration
    },
    //监听Audio对象数据改变
    getCurrentTime(res) {
      if (this.audio.sliderFlag) {
        this.audio.currentTime = res.target.currentTime
        // console.log('this.$refs.audio.currentTime====', this.$refs.audio.currentTime,this.$refs.audio.currentTime===res.target.currentTime);
        if (this.audio.lyricTableData.length > 0) {
          this.audio.lyricTableData.map((item, index) => {
            if (realFormatSecond(this.audio.currentTime).slice(3) == item.time) {
              this.audio.currentLyricIndex = index
              if (this.audio.lyricDialogVisible) {
                this.$refs.lyricTable.setCurrentRow(this.audio.lyricTableData[index])
              }

            }
          })
        }
      }
    },
    realFormatSecond(val) {
      return realFormatSecond(val)
    },
    handleCurrentChange(currentRow) {
      if (currentRow) {
        this.audio.songName = currentRow.name
        this.audio.singName = currentRow.singsString
        this.audio.alSrc = currentRow.alPicUrl
        this.audio.musicId = currentRow.id
        this.audio.audioSrc = `https://music.163.com/song/media/outer/url?id=${currentRow.id}`
        this.audio.index = currentRow.index
        this.audio.playing = false
        this.audio.currentRow = currentRow
        this.likeList()
        console.log('this.audio.currentRow===', this.audio.currentRow);
      }
    },
    audioEended() {
      this.audio.playing = false
      this.audio.sliderFlag = true
      if (this.$store.state.audioSrc.length != 0) {
        this.next()
      }
    },
    //获取喜欢歌曲ID列表
    likeList() {
      axios.get(`/api/likelist`, {
        params: {
          uid: this.$store.state.userInfo.account.id
        }
      }).then(res => [
        this.$store.commit('updateLikeIdsList', res.data.ids),
        this.likeStarFlag = this.$store.state.likeIdslist.includes(this.audio.musicId),
        console.log(this.$store.state.likeIdslist, this.audio.musicId, this.$store.state.likeIdslist.includes(this.audio.musicId)),
      ])
    },
    likeStar() {
      if (this.$store.state.userCookie) {
        // if (this.$store.state.audioSrc.length > 0) {
        this.likeStarFlag = !this.likeStarFlag,
          //真服了经典网易云不能使用post请求，会导致接口延迟
          axios.get('/api/like', {
            params: {
              id: this.audio.currentRow.id,
              like: this.likeStarFlag
            }
          }).then(res => {
            this.$notify.success(this.likeStarFlag ? '收藏音乐' : '取消收藏')
          })
        // } else {
        //   this.$message.error('只能收藏播放列表里的歌')
        // }
      } else {
        this.$notify.error('请先登录')
      }
    },
    openLyric() {
      this.getLyric().then(() => {
        this.audio.lyricDialogVisible = true
        this.$nextTick(() => {
          //因为歌词数据每次在dialog打开都会调用接口重新加载，就算数据一样，堆地址也已经改变了
          //所以会导致歌曲暂停时没有调用Audio对象的timeUpdate方法设置歌词当前行的方法，因为数据变了之前设置的当前行也没有了
          //需要存储上次设置的当前行this.audio.currentLyricIndex,在打开dialog，用来设置
          this.$refs.lyricTable.setCurrentRow(this.audio.lyricTableData[this.audio.currentLyricIndex])
        })
      })

    },
    async getLyric() {
      await axios.get(`/api/lyric`, {
        params: {
          id: this.audio.musicId
        }
      }).then(res => {
        this.audio.lyricTableData = res.data.lrc.lyric.split('\n').map((item, index) => {
          let tempObj = {}
          tempObj[item.slice(0, 11)] = item.slice(11)
          tempObj.time = item.slice(1, 6)
          tempObj.Timestamp = tempObj.time.split(':')
          tempObj.Timestamp = Number(tempObj.Timestamp[0]) * 60 + Number(tempObj.Timestamp[1])
          tempObj.lyric = item.slice(11)
          tempObj.index = index
          return tempObj
        }).slice(0, -1)
        console.log('this.audio.lyricTableData===', this.audio.lyricTableData);
      })
    },
    lyricCurrentChange(row) {
      // console.log('lyricCurrentRow==', row, row.index);
      this.$nextTick(() => {
        let currentRow = document.querySelector(".current-row")
        currentRow ? currentRow.scrollIntoView({ block: "center" }) : ''
      })
    },
    lyricClick(row) {
      this.$refs.audio.currentTime = row.Timestamp
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
.footer {
  .content {
    height: 80px;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .control {
      font-size: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 15px;
      i {
        margin: 0 5px;
        cursor: pointer;
      }
    }
    .audio {
      display: flex;
      align-items: center;
      .songDetail {
        display: flex;
        align-items: center;
        img {
          height: 50px;
          margin-right: 15px;
          cursor: pointer;
        }
      }
      .nameSlider {
        line-height: 0;
        .songName {
          width: 1000px;
          height: 15px;
          line-height: 15px;
          font-size: 15px;
          margin: 0 20px;
          span {
            margin: 0 10px;
          }
        }
        .el-slider {
          margin: 0 20px;
          display: block;
          width: 1000px;
        }
      }
    }
  }
}
::v-deep ::-webkit-scrollbar {
  width: 0px;
}
</style>