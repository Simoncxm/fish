<template>
  <div class="echat-messageLog"
       v-loading="chatLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="messageLog-container">
      <message-item type="other" @lookPhoto="lookPhoto" :v="v" v-for="(v, i) in messageLog" :key="i" class="other"
                    v-if="v.type !== 'org'"></message-item>
    </div>
    <div class="page" v-if="total>0">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="offset"
        @current-change="getMessageLog"
        :total="total"
        :background="true"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import messageItem from './messageItem.vue';
  import api from '@/api';
  import {mapState} from 'vuex';

  export default {
    name: 'messageLog',
    props: ['currNav'],
    data() {
      return {
        messageLog: [],
        offset: 1,
        limit: 100,
        total: 0,
        chatLoading: false
      }
    },
    computed: {
      ...mapState(['currSation'])
    },
    watch: {
      currSation: { // 当前会话
        handler(v) {
          if (!v.id) {
            this.messageLog = [];
          }
          if (this.currNav === 2 && (v.type === 'group' || v.type === 'friend')) {
            this.getMessageLog();
          }
        },
        deep: true,
        immediate: true
      },
      currNav(i) {
        if (i === 2 && this.currSation.id) {
          this.total = 0;
          this.getMessageLog();
        }
      }
    },
    methods: {
      lookPhoto(url) {
        this.$emit('lookPhoto', url);
      },
      getMessageLog() {
        this.chatLoading = true;
        this.messageLog = [];
        let params = {conversationId: this.currSation.id, offset: this.offset, limit: this.limit};
        api.getMoreMessage(params).then(r => {
          if (r.code === 0) {
            this.messageLog = r.data;
            this.total = r.count;
          }
          this.chatLoading = false;
        })
      }
    },
    components: {
      messageItem
    }
  }
</script>

<style lang="scss" scoped>
  .echat-messageLog {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 15px;
    box-sizing: border-box;

    .messageLog-container {
      min-height: calc(100% - 32px);
    }
  }
</style>
