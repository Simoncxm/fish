<template>
  <div class="echat-Detail">
    <v-apheader back="-1" bgColor="transparent" class="echat-Detail-header">
<!--      <v-icon name="erweima" color="#f5f5f5" cursor="pointer" @clickIcon="showFriendQr = true"></v-icon>-->
    </v-apheader>
<!--    <el-carousel trigger="click" height="200px" arrow="never"-->
<!--                 :indicator-position="friendInfo.cover.length > 1 ? '' : 'none'" :autoplay="false">-->
<!--      <el-carousel-item v-for="item in friendInfo.cover" :key="item">-->
<!--        <a class="DetailImage-a" :style="{backgroundImage: 'url('+ IMG_URL + item +')'}">-->
<!--        </a>-->
<!--      </el-carousel-item>-->
    <el-carousel trigger="click" height="200px" arrow="never"
                 :indicator-position="cover.length > 1 ? '' : 'none'" :autoplay="true">
      <el-carousel-item v-for="item in cover" :key="item">
        <a class="DetailImage-a" :style="{backgroundImage: 'url('+ IMG_URL + item +')'}">
        </a>
      </el-carousel-item>
      <div class="DetailImage-bg">
        <p class="title">
          {{friendInfo.nickname}}
        </p>
        <p>{{friendInfo.signature ? '个性签名：' + friendInfo.signature :
          '这个人很懒，暂时没有签名哦！'}}</p>
      </div>
    </el-carousel>
    <div class="echat-Detail-container friend-detail-container">
      <a class="detail-avatar">
        <img :src="IMG_URL + friendInfo.avatar" alt="">
      </a>
      <div class="firend-info">
<!--        <p>-->
<!--          Echat：{{friendInfo.id}}-->
<!--        </p>-->
        <p>
          性别：{{friendInfo.gender === 1 ? '男' : friendInfo.gender === 2 ? '女' : '保密'}}
        </p>
<!--        <p>-->
<!--          所在地：{{friendInfo.province.name + (friendInfo.city.name === '市辖区' ? '' : ' - ' + friendInfo.city.name) + ' - '-->
<!--          + friendInfo.town.name}}-->
<!--        </p>-->
      </div>
<!--      <div class="detail-item" v-if="friendInfo.id === user.id" @click="toPhoto">-->
<!--        <span>照片墙</span>-->
<!--        <p>-->
<!--          <v-icon name="enter" color="#d5d5d5"></v-icon>-->
<!--        </p>-->
<!--      </div>-->
      <div class="detail-button" v-if="friendInfo.id !== user.id">
        <button @click="apply" class="echat-full-button minor" v-if="!myFriendFlag">加为好友</button>
        <div v-else>
          <button @click="send" class="echat-full-button minor">发消息</button>
          <button @click="remove" class="echat-full-button error">删除好友</button>

        </div>

      </div>
    </div>
<!--    <div class="Qr-dialog" :class="{active: showFriendQr}">-->
<!--      <v-icon class="el-icon-circle-close-outline QrClose" @clickIcon="showFriendQr = false" color="#f5f5f5" :size="28"-->
<!--              cursor="pointer"></v-icon>-->
<!--    </div>-->
  </div>
</template>

<script>
  import vApheader from '@/views/components/header/vApheader';
  import api from '@/api';
  import utils from '@/utils/utils';
  import {mapState} from 'vuex';
  import Msg from '@/views/components/msg.js'
  export default {
    data() {
      return {
        IMG_URL: process.env.IMG_URL,
        friendInfo: {}, // user详情
        cover:['/display/20200603000000_cover.jpg','/display/20200603000000_cover1.jpg'],
        // showFriendQr: false, // 二维码开关
        myFriendFlag: false // 是否为我的好友
      }
    },
    components: {
      vApheader
    },
    computed: {
      ...mapState(['user','conversationsList','friendList'])
    },
    methods: {
      apply() {
        localStorage.friend = JSON.stringify({
          userYname: this.friendInfo.nickname,
          userYloginName: this.friendInfo.name,
          userYphoto: this.friendInfo.avatar
        });
        this.$router.push({name: 'applyFriend', params: {id: this.$route.params.id}, query: {}});
      },
      remove() {
        let index = -1;
        for (let i = 0; i < this.conversationsList.length; i++) {
          if (this.conversationsList[i].itemId === this.$route.params.id && this.conversationsList[i].type === 'friend'){
            index = i;
            break;
          }
        }
        this.$store.commit('removeConversationsList', index);
        let val={
          myId:this.user.id,
          userId:this.$route.params.id
        };
        this.$socket.emit('deleteMyFriend', val);
        this.$store.commit('removeFriend', this.$route.params.id);
        this.$router.push('/main/personalMain/friendly/own');
        // this.$router.go(-1);
      },
      send(){
        // console.log('send');
        let flag=false;
        this.conversationsList.forEach(v => {
          if(v.itemId === this.$route.params.id && v.type === 'friend'){
            this.$store.commit('setCurrSation', v);
            flag=true;
          }

        });
        if(!flag){
          let params = {
            type:'friend',
            itemId: this.$route.params.id
          };
          api.addConversation(params).then(r => {
            if (r.code === 0) {
              this.$store.commit('addConversationsList', r.data);
              this.$store.commit('setCurrSation', this.conversationsList[0]);
            }
          })
        }
      },
      getUserInfo() {
        if(this.$route.params.id === this.user.id){
          this.friendInfo = this.user
        }
        else{
          let params = {
            id: this.$route.params.id
          };
          api.getOtherUserInfo(params).then(r => {
            if (r.code === 0) {
              this.friendInfo = r.data;
            }
          })
        }
      },
      toPhoto() {
        this.$router.push({name: 'photoWall', params: this.$route.params});
      },
      checkMyfriend() {
        if (this.friendList.filter(v => v.id === this.$route.params.id).length){
          this.myFriendFlag = true;
        }
        // let params = {
        //   userid: this.$route.params.id
        // };
        // api.checkMyfriend(params).then(r => {
        //   if (r.isMyfriend===true) {
        //     this.myFriendFlag = true;
        //   }
        // })
      }
    },
    created() {
      this.getUserInfo();
      this.checkMyfriend();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../echatDetail";
</style>
