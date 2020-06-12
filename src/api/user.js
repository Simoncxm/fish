import fetch from './fetch';

export default {
  getUser(params) { // 获取所有用户
    return fetch.get('user/getUser', params);
  },
  login(params) { // 登录
    return fetch.post('login', params);
  },
  register(params) { // 注册
    return fetch.post('register', params);
  },
  sendEmail(params) { // 发送邮箱验证
    return fetch.get('sendEmail', params);
  },
  logout() { // 登出
    return fetch.get('user/logout');
  },
  getUserInfo(params) { //获取用户信息
    return fetch.get('user/getUserInfo', params);
  },
  getOtherUserInfo(params) { //获取用户信息
    return fetch.get('user/getOtherUserInfo', params);
  },
  updateUserInfo(params) { // 修改个人信息
    return fetch.post('user/updateUserInfo', params);
  },
  updateUserGender(params) { // 修改个人性别
    return fetch.get('user/updateUserGender', params);
  },
  updateBgOpa(params) { // 修改聊天透明度
    return fetch.get('user/updateBgOpa', params);
  },
  getSystemInfo() { // 获取系统信息
    return fetch.get('user/getSystemUserInfo');
  },
  addConversation(params) { // 添加会话
    return fetch.post('user/addConversation', params);
  },
  removeConversation(params) { // 移除会话
    return fetch.post('user/removeConversation', params);
  },
  searchFriend(params) { // 添加好友
    return fetch.post('user/searchFriend', params);
  },
  setConversation(params) { // 添加好友
    return fetch.get('user/setConversation', params);
  }
}

