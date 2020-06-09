<template>
  <div class="echat-Detail">
    <v-apheader back="-1" bgColor="transparent" class="echat-Detail-header">
<!--      <v-icon name="erweima" color="#f5f5f5" cursor="pointer" @clickIcon="showGroupQr = true"></v-icon>-->
    </v-apheader>
    <el-carousel trigger="click" height="200px" arrow="never" indicator-position="none">
      <el-carousel-item v-for="item in 1" :key="item">
        <a class="DetailImage-a" :style="{backgroundImage: 'url('+ IMG_URL + groupInfo.groupAvatar +')'}">
        </a>
      </el-carousel-item>
      <div class="DetailImage-bg">
        <p class="title">
          {{groupInfo.groupName}}
        </p>
        <p>
          {{groupInfo.groupDesc}}
        </p>
      </div>
    </el-carousel>
    <div class="echat-Detail-container">
      <div class="group-users" v-if="applyFlag">
<!--        <h3 class="group-users-title detail-item">-->
<!--          <span>群聊成员</span>-->
<!--          <p class="many">-->
<!--            <span>共{{groupUsers.length}}人</span>-->
<!--            <v-icon name="enter" color="#d5d5d5"></v-icon>-->
<!--          </p>-->
<!--        </h3>-->
        <ul class="group-users-liitte-list">
          <li v-for="(v, i) in groupUsers" :key="v.id" v-if="i < 9">
            <a class="echat-photo">
              <img :src="IMG_URL + v.userId.avatar" alt="">
            </a>
            <span class="echat-line1">{{v.userId.nickname}}</span>
          </li>
        </ul>
      </div>
<!--      <div class="group-card detail-item" v-if="applyFlag">-->
<!--        <span>我的群名片</span>-->
<!--        <p class="many">-->
<!--          <span>别跟我比可爱</span>-->
<!--          <v-icon name="enter" color="#d5d5d5"></v-icon>-->
<!--        </p>-->
<!--      </div>-->
      <div class="group-tag detail-item" v-if="groupInfo.holderName === user.name">
        <span>群标签</span>
        <p>
          <el-tag v-for="(v, i) in groupTag" :key="i" v-if="i < 3">{{v}}</el-tag>
          <v-icon name="enter" color="#d5d5d5"></v-icon>
        </p>
      </div>
<!--      <div class="group-managers detail-item" v-if="!applyFlag">-->
<!--        <div>-->
<!--          <span>群主</span>-->
<!--          <a v-for="(v, i) in managers" :key="v['id']" class="echat-photo" v-if="i < 3">-->
<!--            <img :src="IMG_URL + v.userId.avatar" alt="">-->
<!--          </a>-->
<!--        </div>-->
<!--        <p class="many">-->
<!--          <span>共{{managers.length}}人</span>-->
<!--          <v-icon name="enter" color="#d5d5d5"></v-icon>-->
<!--        </p>-->
<!--      </div>-->

      <div class="detail-button">
        <button @click="apply" class="echat-full-button minor" v-if="!applyFlag">申请加群</button>
        <div v-else>
          <button @click="send" class="echat-full-button minor">发消息</button>
          <button @click="quit" class="echat-full-button error" >退出群聊</button>

        </div>

      </div>
    </div>
    <div class="Qr-dialog" :class="{active: showGroupQr}">
      <v-icon class="el-icon-circle-close-outline QrClose" @clickIcon="showGroupQr = false" color="#f5f5f5" :size="28"
              cursor="pointer"></v-icon>
    </div>
  </div>
</template>

<script>
  import vApheader from '@/views/components/header/vApheader';
  import api from '@/api';
  import {mapState} from 'vuex';
  import Msg from '@/views/components/msg.js'
  export default {
    data() {
      return {
        groupInfo: {},
        groupUsers: [],
        IMG_URL: process.env.IMG_URL,
        showGroupQr: false, // 二维码开关
        // managers: [],
        groupTag: [], // 群标签
        applyFlag: false, // 是否已加群
        holder:{},
      };
    },
    components: {
      vApheader
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      getGroupInfo() {
        let params = {
          groupId: this.$route.params.id
        };
        api.getGroupInfo(params).then(r => {
          if (r.code === 0) {
            this.groupInfo = r.data;
            this.groupInfo.id = this.$route.params.id;
            // this.groupUsers = r.users;
            // this.applyFlag = this.groupUsers.filter(v => v.userName === this.user.name).length;
            // // this.managers = this.groupUsers.filter(v => v.holder === 1 );
            // this.holder = this.groupUsers.filter(v => v.holder === this.groupInfo.holder)[0];
          }
        });
        // params = {
        //   id: this.$route.params.id
        // };
        // api.getGroupUser(params).then(r => {
        //   if (r.code === 0) {
        //     this.groupUsers = r.data;
        //     this.applyFlag = this.groupUsers.filter(v => v.id === this.user.id).length;
        //     // this.managers = this.groupUsers.filter(v => v.holder === 1 );
        //     this.holder = this.groupUsers.filter(v => v.holder === this.groupInfo.holder)[0];
        //   }
        // });
      },
      apply() {
        localStorage.group = JSON.stringify({
          groupName: this.groupInfo.title,
          groupId: this.$route.params.id,
          groupPhoto: this.groupInfo.img
        });
        this.$router.push({name: 'applyGroup', params: {id: this.holder.id}});
      },
      send(){
        // console.log('send');
        Msg.$emit("val", this.groupInfo.title);
      },
      quit() {
      },
      checkMygroup() {
        let params = {
          groupId: this.$route.params.id
        };
        api.checkIfInGroup(params).then(r => {
          if (r.isMygroup===true) {
            this.applyFlag = true;
          }
        })
      }
    },
    mounted() {
      this.checkMygroup();
      this.getGroupInfo();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../echatDetail";
</style>
