<template>
  <div class="echat-myFriend echat-noUser">
    <v-apheader title="我的好友">
      <el-dropdown trigger="click" @command="handleCommand">
        <v-icon cursor="pointer" name="hanbaobao" color="#fff"></v-icon>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/main/personalMain/friendly/search">添加好友</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </v-apheader>
    <div class="echat-myFriend-container">
      <div class="me-li" @click="goFriendDetail(user.id)">
        <a href="javascript:;">
          <img :src="IMG_URL + user.avatar" alt="">
        </a>
        <div>
          <span class="echat-line1" :title="user.nickname">{{user.nickname}}</span>
          <v-icon name="enter" color="#d5d5d5"></v-icon>
        </div>
      </div>
      <div class="echat-linkman-container" :class="{active: showList.indexOf('mine') > -1}" v-if="friendList.length">
        <h3 @click="setShowList('mine')">
          <p>
            <v-icon name="fanhui" :size="16" color="#b7b6b6" class="list-icon"></v-icon>
            <span>我的好友</span>
          </p>
          <span>{{friendList.length}}</span>
        </h3>
        <ul class="echat-linkman-list">
          <li v-for="v in friendList" :key="v.id" @click="goFriendDetail(v.id)"
              @contextmenu="contextmenuClick($event, v)">
            <a href="javascript:;">
              <img :src="IMG_URL + v.avatar" alt="">
            </a>
            <div>
              <p>
                <span class="echat-line1" :title="v.nickname">{{v.nickname}}</span>
              </p>
              <p>
                <span :title="v.signature" class="echat-line1">{{v.signature}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <v-nodata v-else>
        <p class="echat-no-have">
          还没有添加好友哦，去
          <router-link to="/main/personalMain/friendly/search">添加</router-link>
          。
        </p>
      </v-nodata>
    </div>
<!--    <v-dropdown :command="currFriend" :x="x" :y="y" :visible="visible" @upVisible="upVisible">-->
<!--      <v-dropdown-item slot-scope="{command}" @dropdownClick="handleConversitionList(command)" slot="dropdown">-->
<!--        {{addOrDel ? '从会话列表移除' : '添加到会话列表'}}-->
<!--      </v-dropdown-item>-->
<!--    </v-dropdown>-->
  </div>
</template>

<script>
  import vApheader from '@/views/components/header/vApheader';
  import {mapState} from 'vuex';
  import api from '@/api';

  export default {
    data() {
      return {
        IMG_URL: process.env.IMG_URL,
        showList: ['mine'], // 分组 备用
        visible: false, // dropdown显示
        currFriend: {},
        x: '', // dropdown left
        y: '' // dropdown top
      }
    },
    components: {
      vApheader
    },
    computed: {
      ...mapState(['conversationsList', 'user','friendList']),
      addOrDel() {
        return this.conversationsList.filter(v => v.id === this.currFriend.conversationId).length;
      }
    },
    methods: {
      handleCommand(command) {
        this.$router.push(command);
      },
      goFriendDetail(id) {
        this.$router.push({name: 'friendDetail', params: {id: id}});
      },
      setShowList(v) {
        if (this.showList.indexOf(v) > -1) {
          this.showList.splice(this.showList.indexOf(v), 1);
        } else {
          this.showList.push(v);
        }
      },
      upVisible(f) {
        this.visible = f;
      },
      contextmenuClick(e, v) {
        e.preventDefault();
        e.stopPropagation();
        this.currFriend = v;
        this.visible = true;
        this.x = e.clientX;
        this.y = e.clientY;
      },
      handleConversitionList(v) {
        if (!this.addOrDel) {
          this.addConversitionList(v);
        } else {
          this.removeConversitionList(v);
        }
      },
      addConversitionList(v) { // 加入会话列表
        let params = {
          itemId: v.id,
          type: 'friend'
        };
        api.addConversation(params).then(r => {
          if (r.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.$store.commit('setConversationsList', params);
          } else {
            this.$message({
              type: 'success',
              message: '添加失败'
            });
          }
          this.visible = false;
        });
      },
      removeConversitionList(v) {
        let params = {
          id: v.conversationId
        };
        api.removeConversation(params).then(r => {
          if (r.code === 0) {
            this.$message({
              type: 'success',
              message: '移除成功'
            });
            this.$store.commit('setConversationsList', Object.assign({}, params, {d: true}));
          } else {
            this.$message({
              type: 'success',
              message: '移除失败'
            });
          }
          this.visible = false;
        });
      },
      findMyfriends() {
        if(!this.friendList.length){
          api.getMyfriend().then(r => {
            if (r.code === 0) {
              this.$store.commit('setFriend', r.data);
            }
          })
        }
      }
    },
    mounted() {
      this.findMyfriends();
    }
  }
</script>

<style lang="scss" scoped>
  .echat-myFriend {
    width: 100%;
    height: 100%;

    .echat-myFriend-container {
      width: 100%;
      padding-top: 10px;
      height: calc(100% - 40px);
      overflow-y: auto;
      box-sizing: border-box;
    }

    .me-li {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 5px 15px 6px;
      box-sizing: border-box;
      margin-bottom: 5px;
      cursor: pointer;

      > a {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        border: 1px solid #d5d5d5;
        box-sizing: border-box;

        img {
          width: 38px;
        }
      }

      > div {
        width: calc(100% - 52px);
        font-size: 14px;
        color: #a3a3a3;
        text-align: left;
        display: flex;
        justify-content: space-between;

        span {
          max-width: 160px;
        }
      }
    }

    .me-li:hover {
      background-color: #f5f5f5;
    }
  }
</style>
