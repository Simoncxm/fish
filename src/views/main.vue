<template>
  <div class="echat-main">
    <v-header></v-header>
    <div class="echat-content">
      <div class="echat-content-nav">

        <ul>
          <li v-for="v in nav" :key="v.id" :class="{active: $route.path.indexOf(v.link) > -1}">
            <router-link :to="{path: v.link}">
              <i class="iconfont" :class="[$route.path.indexOf(v.link) === -1 ? v.class : v.activeClass]"></i>
              <p>{{v.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="echat-content-sub">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<!--关于多房间，socket可以同时加入多个房间但是也同时可以接收到多个房间的消息，需要自己处理数据-->
<!--所有用户都需要加入echat房间 以发送系统消息（申请验证等）-->
<script>
  import utils from '@/utils/utils';
  import {mapState} from 'vuex';
  import vHeader from '@/views/components/header/vHeader';
  import api from '@/api';

  export default {
    data() {
      return {
        nav: [
          {
            name: '好友',
            class: 'icon-people',
            activeClass: 'icon-people_fill',
            id: 2,
            link: '/main/personalMain/friendly'
          },
          {
            name: '群聊',
            class: 'icon-group',
            activeClass: 'icon-group_fill',
            id: 3,
            link: '/main/personalMain/group'
          }
        ]
      };
    },
    watch: {
      conversationsList: {
        handler(list) {
          if (!this.user.name) {
            return;
          }
          list.forEach(v => {
            if(!v.joined){
              // console.log(1);
              v.joined=true;
              let val = {
                name: this.user.name,
                time: utils.formatTime(new Date()),
                avatar: this.user.avatar,
                conversationId: v.id
              };
              // let room = {conversationId: v.id, offset: 1, limit: 200};
              this.$socket.emit('join', val);
              // this.$socket.emit('getHistoryMessages', room);
              if(this.conversationsChat[v.id]){
                this.chatList = this.conversationsChat[v.id];
              }
              else{
                v.chatoffset=1;
                v.chatlimit=10;
                let params = {conversationId: v.id, offset: v.chatoffset, limit: v.chatlimit};
                api.getMoreMessage(params).then(r => {
                  if (r.code === 0) {
                    let data = r.data.filter(v => v.read.indexOf(this.user.name) === -1);
                    if (data.length) {
                      this.$store.commit('setUnRead', {conversationId: data[0].conversationId, count: data.length});
                    }
                    if (r.data.length) {
                      // console.log(v);
                      v.newMes=r.data[r.data.length - 1].mes;
                      v.newMesTime=r.data[r.data.length - 1].time;
                    }
                    if(v.name!=='Echat'){
                      let chatList = r.data.map(v => {
                        if (v.type !== 'org') {
                          if (v.name === this.user.name) {
                            v.type = 'mine';
                          } else {
                            v.type = 'other';
                          }
                        }
                        return v;
                      });
                      this.conversationsChat[v.id]= chatList;
                    }
                    else{
                      this.conversationsChat[v.id]=r.data;
                    }
                  }
                });
              }
            }
          });
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      ...mapState(['user', 'conversationsList', 'Echat','conversationsChat'])
    },
    components: {
      vHeader
    },
    sockets: {
      connect: function (val) {
        console.log(this.$socket.id);
        console.log('连接成功');
      },
      customEmit: function (val) {
        console.log('连接失败');
      },
      joined(OnlineUser) {
        console.log('加入了', OnlineUser);
        this.$store.commit('setOnlineUser', OnlineUser)
      },
      beDeleted(raw){
        let val = raw.body;
        if(val.type==='friend'){
          let index = -1;
          for (let i = 0; i < this.conversationsList.length; i++) {
            if (this.conversationsList[i].itemId === val.itemId && this.conversationsList[i].type === 'friend'){
              index = i;
              break;
            }
          }
          this.$store.commit('removeConversationsList', index);
          this.$store.commit('removeFriend', val.itemId);
          this.$router.go(-1);
        }
      },
      leaved(OnlineUser) {
        this.$store.commit('setOnlineUser', OnlineUser)
      },
      // getHistoryMessages(mesdata) { // 获取未读消息数量
      //   let data = mesdata.data.filter(v => v.read.indexOf(this.user.name) === -1);
      //   if (data.length) {
      //     this.$store.commit('setUnRead', {conversationId: data[0].conversationId, count: data.length});
      //   }
      // },
      // mes(r) { //更改未读消息数量
      //   this.$store.commit('setUnRead', {conversationId: r.conversationId, add: true, count: 1});
      // },
      takeValidate(r) {
        this.$store.commit('setUnRead', {conversationId: r.conversationId, add: true, count: 1});
        if (r.type === 'info') {
          this.$store.dispatch('getUserInfo');
        }
      }
    },
    // methods: {
    // },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  .echat-main {
    width: 100%;
    height: 100%;

    .echat-content {
      width: 100%;
      height: calc(100% - 80px);
      min-height: 600px;
      display: flex;
      justify-content: flex-start;
      background-color: #fff;

      .echat-content-nav {
        width: 120px;
        height: 100%;

        ul {
          width: 100%;

          li {
            padding: 15px 0;
            cursor: pointer;

            a {
              display: block;
              text-decoration: none;

              i {
                font-size: 32px;
                margin-bottom: 5px;
              }

              p {
                font-size: 12px;
              }
            }
          }
        }
      }

      .echat-content-sub {
        width: calc(100% - 120px);
        height: 100%;
        min-width: 1170px;
      }
    }
  }
</style>
