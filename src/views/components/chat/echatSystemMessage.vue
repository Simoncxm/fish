<template>
  <div class="echat-system-Message"
       v-loading="chatLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       v-fontColor="user.chatColor">
<!--    <v-icon class="el-icon-loading" color="#fff" :size="14" v-if="loadmoreLoading"/>-->
    <ul v-if="currChat.length">
      <template v-for="v in currChat">
        <li v-if="v.type === 'validate'" :key="v['id']">
          <span class="echat-line1 info">{{v.state === 'friend' ? '验证消息：' + v.nickname + '申请加您为好友' : '验证消息：' + v.nickname + '申请加入' + v.groupName}}</span>
          <span class="time">{{$utils.formatTimeH(v.time)}}</span>
          <el-popover
            placement="left"
            width="400"
            v-model="v.visible">
            <div class="Validate-mes">
              <div class="header">
                <a class="echat-photo">
                  <img :src="IMGURL + v.avatar" alt="">
                </a>
                <p>
                  <span>{{v.nickname}}</span>
                  <span class="signature">{{v.signature}}</span>
                </p>
              </div>
              <div class="info">
                附加消息：<span>{{v.mes}}</span>
              </div>
              <div class="footer" v-if="v.status === '0' ">
                <button class="echat-button-mini info" @click="refuse(v)">拒绝</button>
                <button class="echat-button-mini" @click="agree(v)">同意</button>
              </div>
              <div class="footer" v-else>
                <span class="status">{{v.status === '1' ? '已同意' : '已拒绝'}}</span>
              </div>
            </div>
            <span slot="reference" class="look" v-if="v.status === '0' ">查看</span>
            <span slot="reference" v-else>{{v.status === '1' ? '已同意' : '已拒绝'}}</span>
          </el-popover>
          <el-popover
            placement="top"
            width="160"
            v-model="v.delVisible">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="v.delVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="del(v)">确定</el-button>
            </div>
            <span slot="reference" class="del">删除</span>
          </el-popover>
        </li>
        <li v-if="v.type === 'info'" :key="v['id']">
          <p>
            <span class="echat-line1 info">{{v.mes}}</span>
            <span class="time">{{$utils.formatTimeH(v.time)}}</span>
          </p>
          <el-popover
            placement="top"
            width="160"
            v-model="v.delVisible">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="v.delVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="del(v)">确定</el-button>
            </div>
            <span slot="reference" class="del">删除</span>
          </el-popover>
        </li>
      </template>
    </ul>
    <span v-else>暂无系统消息！</span>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import api from '@/api';

  export default {
    name: 'echatSystemMessage',
    data() {
      return {
        IMGURL: process.env.IMG_URL,
        visible: false,
        offset: 1,
        limit: 10,
        currChat: [],
        chatLoading: false,
        // loadmoreLoading: false,
      }
    },
    sockets: {
      ValidateSuccess(r) {
        // alert(JSON.stringify(r));
        // this.$store.dispatch('getUserInfo');
        if(r.state==='friend'){
          this.$store.commit('addfriend', r.friend);
          this.$store.commit('addConversationsList', r.conversation);
          this.$store.commit('setCurrSation', r.conversation);
          this.$message({
            message: '添加好友成功',
            type: 'success'
          });
        }
      }
    },
    watch: {
      currSation: { // 当前会话
        handler(v) {
          if(v.id!==this.Echat.id)return;
          if (v.id) {
            // alert("ok");
            // this.$socket.emit('setReadStatus', {conversationId: v.id, name: this.user.name});
            this.$store.commit('setUnRead', {conversationId: v.id, clear: true});
            // this.$socket.emit('getSystemMessages', {conversationId: v.id, offset: this.offset, limit: this.limit});
            // alert(JSON.stringify(this.conversationsChat));
            if(!this.conversationsChat[v.id]){
              this.chatLoading = true;
              v.chatoffset=1;
              v.chatlimit=10;
              let params = {conversationId: v.id, offset: v.chatoffset, limit: v.chatlimit};
              api.getMoreMessage(params).then(r => {
                if (r.code === 0) {
                  if (r.data.length) {
                    v.newMes=r.data[r.data.length - 1].mes;
                    v.newMesTime=r.data[r.data.length - 1].time;
                  }
                  this.currChat = r.data;
                  // this.conversationsChat[this.currSation.id].forEach(t => {
                  //   t.visible = false;
                  //   t.delVisible = false;
                  // });
                  this.chatLoading = false;
                  this.conversationsChat[v.id]= this.currChat;
                  // alert(JSON.stringify(this.conversationsChat[this.currSation.id]))
                }
              });
            }
            else{
              this.currChat = this.conversationsChat[this.currSation.id];
            }
            api.setConversation({conversationId: v.id});
            // let params = {conversationId: v.id, offset: this.offset, limit: this.limit};
            // api.getMoreMessage(params).then(r => {
            //   if (r.code === 0) {
            //     if (r.data.length) {
            //       this.$emit('NewMes', r.data[r.data.length - 1]);
            //     }
            //     r.data.forEach(v => {
            //       v.visible = false;
            //       v.delVisible = false;
            //     });
            //     this.conversationsChat[this.currSation.id] = r.data;
            //   }
            //   this.chatLoading = false;
            // })
          } else {
            this.currChat = [];
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      ...mapState(['user', 'Echat','conversationsChat','currSation']),
    },
    methods: {
      del(v) {
        api.removeMessage({'id': v['id']}).then(r => {
          if (r.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.currChat = this.currChat.filter(m => m.id !== v.id);
            this.conversationsChat[this.currSation.id] = this.currChat
            // this.conversationsChat[this.currSation.id] = this.conversationsChat[this.currSation.id].filter(m => m.id !== v.id);
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
          }
        })
      },
      agree(v) {
        v.userYavatar = this.user.avatar;
        v.userYname = this.user.nickname;
        // alert(JSON.stringify(v))
        this.$socket.emit('agreeValidate', v);
        this.conversationsChat[this.currSation.id].forEach(m => { // 更新同一申请人的所有相同请求
          if (m.userM === v.userM && m.type === "validate" && (v.state === 'friend' || v.state === 'group')) {
            m.status = '1';
            m.visible = false
          }
        });
      },
      refuse(v) {
        v.userYavatar = this.user.avatar;
        v.userYname = this.user.nickname;
        this.$socket.emit('refuseValidate', v);
        v.visible = !v.visible;
        v.status = '2'; // 拒绝
      }
    }
  }
</script>

<style lang="scss" scoped>
  .echat-system-Message {
    width: 100%;
    height: 100%;
    padding: 15px 30px 10px 15px;
    box-sizing: border-box;
    overflow-y: auto;

    li {
      text-align: left;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 5px 10px;
      line-height: 30px;
      margin-bottom: 5px;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.3);

      span.time {
        font-size: 12px;
        color: #aaaaaa;
        margin-left: 10px;
      }

      span.info {
        max-width: 300px;
      }

      span.look {
        color: #27cac7;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.8;
        min-width: 24px;
        margin-left: 15px;
      }

      span.del {
        color: #ff3514;
        opacity: 0.8;
        cursor: pointer;
        font-weight: bold;
      }

      span.look:hover, span.del:hover {
        opacity: 1;
      }

      span.status {
        font-size: 14px;
        color: #8d8d8d;
      }
    }
  }
</style>
