<template>
  <div class="echat-personalMain">
    <div class="echat-content-left-view">
      <div class="echat-content-left-box">
        <div class="echat-content-left-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="echat-content-right-view">
      <e-chat></e-chat>
    </div>
  </div>
</template>
<script>
  import eChat from "./components/chat/eChat";

  export default {
    name: '',
    data() {
      return {
      }
    },
    components: {
      eChat
    },
    methods: {},
    mounted() {
    }
  }
</script>
<style scoped lang="scss">
  .echat-personalMain {
    width: calc(100% - 30px);
    height: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .echat-content-left-view {
    width: 320px;
    height: 100%;
    padding: 20px 0 30px;
    box-sizing: border-box;
    margin-left: 20px;
    min-width: 300px;

    .echat-content-left-box {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 0 1px 1px #d5d5d5;
    }

    .echat-content-left-content {
      width: 100%;
      height: calc(100% - 50px);
      box-sizing: border-box;
    }

    .echat-content-left-footer {
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

  .echat-content-right-view {
    width: calc(100% - 340px);
    padding: 20px 0 30px;
    min-width: 820px;
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    margin-left: 30px;
  }
</style>
