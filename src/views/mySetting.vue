<template>
  <div class="echat-mySetting">
    <vHeader :isMainHeader="false"></vHeader>
    <div class="echat-mySetting-container echat-flexBetween">
      <ul class="echat-setingList">
        <li v-for="(v, i) in setingList" :key="i" :class="{active: $route.path === v.link}">
          <router-link :to="v.link">
            <i class="iconfont" :class="[v.class ? v.class : '']"></i>
            <span>{{v.name}}</span>
          </router-link>
        </li>
      </ul>
      <div class="echat-seting-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api';
  import vHeader from '@/views/components/header/vHeader';

  export default {
    name: 'mySetting',
    data() {
      return {
        setingList: [
          {
            name: '个人资料',
            link: '/mySetting/means',
            class: 'icon-gerenziliao3'
          },
          // {
          //   name: '主题设置',
          //   link: '/mySetting/theme',
          //   class: 'icon-zhuti'
          // }
        ]
      }
    },
    components: {
      vHeader
    }
  }
</script>
<style lang="scss" scoped>
  .echat-mySetting {
    width: 100%;
  }

  .echat-mySetting-container {
    width: 1200px;
    margin: 0 auto;
    padding: 30px 0;

    .echat-setingList {
      width: 320px;
      padding: 0 30px;
      box-sizing: border-box;

      li {
        width: 100%;
        cursor: pointer;
        border-radius: 2px;
        text-align: left;

        a {
          display: block;
          color: #323232;
          padding: 12px 0;
          box-sizing: border-box;
          padding-left: 20px;
        }

        i {
          font-size: 28px;
          margin-right: 6px;
          vertical-align: middle;
        }
      }

      li:hover {
        background-color: #f0f0f0;
      }

      li.active {
        background-color: #3aa1ca;
      }

      li.active a {
        color: #fff;
      }
    }

    .echat-seting-container {
      width: 880px;
      background-color: #f5f5f5;
      border-radius: 2px;
    }
  }
</style>
