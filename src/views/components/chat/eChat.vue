<template>
  <div class="echat-chatRoom" v-bgInmage="IMGURL + user.wallpaper.split(',')[0]" v-fontColor="user.chatColor">
    <div class="chatRoom-before" v-opacity="bgOpa"></div>
    <div class="echat-chatRoom-bg">
      <div class="chat-header">
        <a v-fontColor="user.chatColor">{{currSation.name}}</a>
        <div class="chat-handel">
<!--          <v-icon class="el-icon-minus" :color="user.chatColor" cursor="pointer" @clickIcon="close"></v-icon>-->
          <v-icon class="el-icon-setting" :color="user.chatColor" cursor="pointer"
                  @clickIcon="settingFlag.f = true"></v-icon>
        </div>
      </div>
      <div class="chat-container">
        <ul class="chat-conversation-ul">
          <li class="chat-conversation-li" v-for="(v, i) in conversationsList" :key=v.id
              :class="{active: currSation.id === v.id}" @click="setCurrSation(v)">
            <el-badge :value="v.unRead" :max="99" class="mesBadge" :hidden="v.unRead === 0">
              <a class="echat-photo">
                <img :src="IMGURL + v.avatar" alt="">
              </a>
            </el-badge>
            <div class="chat-conversation-li-center">
              <template v-if="v.type === 'echat'">
                <p class="echat-line1">{{v.nickname}}</p>
                <p class="echat-line1">{{v.signature}}</p>
              </template>
              <template v-else>
                <p class="echat-line1">{{v.name}}</p>
                <p class="echat-line1">{{v.newMes}}</p>
              </template>
            </div>
            <div class="chat-conversation-li-right">
              <p>{{$utils.formatTimeH(v.newMesTime)}}</p>
            </div>
            <p class="delete" >
              <el-tooltip class="item" effect="dark" :content="'移除'" placement="top-start" v-if="v.name !== 'Echat'">
                <el-button icon="el-icon-close" circle size="mini" @click.stop="remove(v,i)"></el-button>
              </el-tooltip>
            </p>
          </li>
        </ul>
        <div class="chat-content-box" v-if="update">
          <chat-item @NewMes="getNewMes" v-show="currSation.type !== 'echat'"></chat-item>
          <echat-message @NewMes="getNewMes" v-show="currSation.type === 'echat'"></echat-message>
        </div>
      </div>
      <div class="chat-setting" :class="{active: settingFlag.f}" v-watchMouse="settingFlag">
        <chat-setting @clickIcon="settingFlag.f = false"></chat-setting>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import chatItem from './chat-item.vue';
  import echatMessage from './echatSystemMessage.vue';
  import chatSetting from './chatSetting.vue';
  import {mapState} from 'vuex';
  import api from '@/api';
  import Msg from '@/views/components/msg.js'
  import conversation from "../../personalModel/conversation";
  export default {
    name: 'eChat',
    inject:['reload'],
    data() {
      return {
        update:true,//没能实现，bug还存在
        initEchatFlag: true,
        IMGURL: process.env.IMG_URL,
        settingFlag: { // 设置面板
          f: false
        },
        removeSation: {}
      }
    },

    sockets: {},
    components: {
      chatItem,
      echatMessage,
      chatSetting
    },

    watch: {
      conversationsList: {
        handler(list,old) {
          // console.log(list[3]);
          // this.conversationsList = JSON.parse(JSON.stringify(list));
          // alert(JSON.stringify(list));
          // list.forEach(v => {
          //   // if(v.init)return;
          //   // v.init=true;
          //   v.newMes=this.conversationsChat[v.id][this.conversationsChat[v.id].length - 1].mes;
          //   v.newMesTime=this.conversationsChat[v.id][this.conversationsChat[v.id].length - 1].time;
          //   console.log(v)
          //   // {newMes: m.mes, newMesTime: m.time}
          // });
          // console.log(list);
          if (!this.currSation.id && list.length) {
            this.$store.commit('setCurrSation', this.conversationsList[0]);
            // alert("ok")
          }
          if (!list.length) {
            this.$store.commit('setCurrSation', {});
          }
          // if (!isNaN(this.removeSation.index)) {
          //   if (this.currSation.id === this.removeSation.item.id && this.conversationsList.length !== 0) {
          //     this.currSation = this.conversationsList[this.removeSation.index] || this.conversationsList[this.removeSation.index - 1] || this.conversationsList[this.removeSation.index + 1];
          //   }
          // }
          // this.$forceUpdate();
          // this.currSation = this.conversationsList[0];
        },
        deep: true,
        immediate: true
      },
      // conversationsList: {
      //   handler(list) {
      //     // if (!list.length) {
      //     //   this.currSation = {};
      //     // }
      //   },
      //   deep: true
      // },
      unRead: {
        handler(list) {
          this.conversationsList.forEach((v, i) => {
            list.forEach(m => {
              if (v.id === m.conversationId) {
                this.$set(this.conversationsList, i, Object.assign({}, v, {unRead: m.count}));
              }
            });
          })
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      ...mapState(['user', 'conversationsList', 'unRead','conversationsChat','currSation']),
      bgOpa() { // 兼容老用户
        return this.user.bgOpa || 0.2;
      }
    },
    methods: {
      close() {
        this.$emit('closeChat');
      },
       setCurrSation(v){
        // alert(JSON.stringify(this.currSation));
        //  console.log(this.currSation.name);
        if (v.id === this.currSation.id) {
          return;
        }
         this.$store.commit('setCurrSation', v);
         // console.log(this.currSation.name);
      },
      getNewMes(m) { // 获取最新一条消息
        // alert(JSON.stringify(this.conversationsList));
        this.conversationsList.forEach((v, i) => {
          if (v.id === m.conversationId) {
            this.$set(this.conversationsList, i, Object.assign({}, v, {newMes: m.mes, newMesTime: m.time}));
          }
        })
      },
      remove(v,i) {
        let conversationId=this.conversationsList[i].id;
        this.$store.commit('removeConversationsList', i);
        let params={
          id:conversationId
        };
        api.removeConversation(params).then(r => {
          if (r.code === 0) {

          }
        });
        // if(i===0)this.$store.commit('setCurrSation', this.conversationsList[0]);
        // alert(JSON.stringify(this.conversationsList))
        // console.log("remove");
        // console.log(v.id);
        // console.log(v.id);
        // var _this = this;
        // if(this.conversationsList[this.conversationsList.length - 1].id === v.id){
        //   //console.log(this.conversationsList[this.conversationsList.length - 1].id===v.id);
        //     this.currSation = this.conversationsList[this.conversationsList.length - 1];
        // }
        // this.conversationsList = this.conversationsList.filter(m => m.id !== v.id);
        //bug
       //  console.log(this.currSation.name);
       // // this.currSation = this.conversationsList[i] || this.conversationsList[i - 1] || this.conversationsList[i + 1];
       //  console.log(this.currSation.name);
        // this.update = this.update ? false:true;
        // this.$nextTick(function(){
        //   this.update = this.update ? false:true;
        //   setCurrSation(this.conversationsList[this.conversationsList.length - 1]);
        // })
        // this.$forceUpdate();
        //this.reload();


        //   console.log(this.currSation.name);
        // setCurrSation(this.conversationsList[this.conversationsList.length - 1]);

        // if (v.type === 'echat') { // 只做显示列表移除
        //   this.conversationsList = this.conversationsList.filter(m => m.id !== v.id);
        //   if (this.currSation.id === v.id && this.conversationsList.length !== 0) {
        //     this.currSation = this.conversationsList[i] || this.conversationsList[i - 1] || this.conversationsList[i + 1];
        //   }
        // }
        //  else {
        //   api.removeConversation(v.id).then(r => {
        //     if (r.code === 0) {
        //       this.$message({
        //         type: 'success',
        //         message: '移除成功'
        //       });
        //       this.$store.commit('setConversationsList', Object.assign({d: true}, v));
        //                    // this.conversationsList = this.conversationsList.filter(m => m.id !== v.id);
        //       this.removeSation = {
        //         item: v,
        //         index: i
        //       };
        //     } else {
        //       this.$message({
        //         type: 'success',
        //         message: '移除失败'
        //       });
        //     }
        //   })
        // }
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  .echat-chatRoom {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    overflow: hidden;
    position: relative;

    .chatRoom-before {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: #000;
    }

    .echat-chatRoom-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .chat-header {
      background-color: rgba(0, 0, 0, 0.4);
      opacity: 0.9;
      width: 100%;
      height: 40px;
      text-align: center;
      position: relative;
      line-height: 40px;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 16px;

      a {
        color: #fff;
        padding: 2px 5px;
        display: inline-block;
      }

      .chat-handel {
        position: absolute;
        right: 0;
        top: 0;
        padding-right: 15px;

        i {
          padding: 8px 4px 3px;
        }

        i:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .chat-container {
      width: 100%;
      height: calc(100% - 40px);
      display: flex;
      justify-content: flex-start;

      .chat-conversation-ul {
        width: 25%;
        min-width: 147.2px;
        padding-bottom: 20px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        overflow-y: auto;
      }

      .chat-conversation-li {
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        text-align: left;
        position: relative;

        a {
          width: 42px;
          min-width: 42px;
          height: 42px;
          margin-right: 10px;
        }

        .delete {
          position: absolute;
          right: 5px;
          top: 32px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          /*transition: transform 0.3s;*/
          transform: scale(0);
          margin-right: 5px;
          i {
            margin: 0;
          }

          i:hover {
            color: #FF3255 !important;
          }
        }
      }

      .chat-conversation-li-center {
        min-width: 100px;
        font-size: 14px;

        p {
          margin-bottom: 5px;
        }

        p:nth-of-type(2) {
          font-size: 12px;
        }
      }

      .chat-conversation-li-right {
        min-width: 36px;
        font-size: 12px;
        text-align: right;
  margin-right: 5px;
        p {
          margin-bottom: 5px;
        }
      }

      .chat-conversation-li:hover, .chat-conversation-li.active {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .chat-conversation-li:hover .delete {
        transform: scale(1);
      }

      .chat-content-box {
        width: 80%;
        min-width: 588.8px;
        box-sizing: border-box;
      }
    }

    /deep/ .chat-setting {
      position: absolute;
      right: 0;
      top: 0;
      width: 250px;
      height: 100%;
      background-color: #f5f5f5;
      transition: transform 0.3s;
      transform: translateX(100%);
      z-index: 2005;
      border-radius: 5px 2px 0 5px;
      box-shadow: -1px 0 5px #bdafaf;
      overflow-y: auto;
      overflow-x: hidden;
      color: #111;

      h3 {
        height: 36px;
        line-height: 36px;
        color: #111;
        background-color: #eef5eb;
      }

      h5 {
        text-align: left;
        margin: 5px 5px 10px 5px;
        border-bottom: 1px solid #d5d5d5;
        padding-bottom: 5px;
      }

      .deClose {
        position: absolute;
        right: 5px;
        top: 5px;
        opacity: 0.7;
      }

      .deClose:hover {
        opacity: 1;
      }

      .bg {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        box-sizing: border-box;

        li.bg-li {
          width: 115px;
          height: 70px;
          background-color: #fff;
          border-radius: 2px;
          box-shadow: 0 0 1px #bdafaf;
          font-size: 14px;
          line-height: 70px;
          color: #fff;
          position: relative;
          margin: 4px;

          p {
            background-color: rgba(0, 0, 0, 0.2);
          }

          i {
            position: absolute;
            right: 0;
            top: 0;
          }
        }

        li.upload-btn {
          color: #28828f;
          position: relative;
          height: 24px;
          margin-left: 5px;
          margin-bottom: 5px;

          input {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            z-index: 2;
          }
        }
      }

      .isColor-container {
        font-size: 12px;
        text-align: left;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        line-height: 24px;
        padding-left: 5px;
        box-sizing: border-box;
        margin-bottom: 10px;

        .isColor {
          width: 150px;
          height: 24px;
          display: inline-block;
          border: 1px solid #d5d5d5;
          margin-left: 10px;
          color: #323232;
          text-align: center;
        }
      }

      .color-container {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding-left: 5px;
        box-sizing: border-box;
      }
    }

    /deep/ .chat-setting.active {
      transform: translateX(0);
    }
  }
</style>
