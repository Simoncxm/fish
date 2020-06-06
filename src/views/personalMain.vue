<template>
  <div class="vchat-personalMain">
    <div class="vchat-content-left-view">
      <div class="vchat-content-left-box">
        <div class="vchat-content-left-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="vchat-content-right-view">
      <v-chat></v-chat>
    </div>
  </div>
</template>
<script>
  import vChat from "./components/chat/vChat";

  export default {
    name: '',
    data() {
      return {
      }
    },
    components: {
      vChat
    },
    methods: {},
    mounted() {
    }
  }
</script>
<style scoped lang="scss">
  .vchat-personalMain {
    width: calc(100% - 30px);
    height: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .vchat-content-left-view {
    width: 320px;
    height: 100%;
    padding: 20px 0 30px;
    box-sizing: border-box;
    margin-left: 20px;
    min-width: 300px;

    .vchat-content-left-box {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 0 1px 1px #d5d5d5;
    }

    .vchat-content-left-content {
      width: 100%;
      height: calc(100% - 50px);
      box-sizing: border-box;
    }

    .vchat-content-left-footer {
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      border-top: 1px solid #ebebeb;

      ul {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        li {
          width: 33.3%;
          font-size: 12px;

          i {
            font-size: 22px;
          }
        }
      }
    }
  }

  .vchat-content-right-view {
    width: calc(100% - 340px);
    padding: 20px 0 30px;
    min-width: 820px;
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    margin-left: 30px;
  }
</style>
