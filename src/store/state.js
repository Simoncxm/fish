/**
 * Created by wyw on 2018/8/4.
 */
export default {
  user: {}, // 用户基础信息
  transitionName: '', // 页面过渡动画
  conversationsList: [], // 会话列表
  conversationsChat: {},
  currSation: {},
  groupUserALL: {},
  OnlineUser: {}, // 在线人数
  unRead: [], // 未读消息
  Echat: {}, // 官方账号信息
  token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
}
