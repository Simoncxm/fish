import fetch from './fetch';

export default {
  getUser(params) { // 获取所有用户
    return fetch.get('v/user/getUser', params);
  },
  login(params) { // 登录
    return fetch.post('v/user/login', params);
  },
  register(params) { // 注册
    return fetch.post('v/user/register', params);
  },
  sendEmail(params) { // 发送邮箱验证
    return fetch.post('v/user/sendEmail', params);
  },
  logout() { // 注册
    return fetch.get('v/user/logout');
  },
  getUserInfo(params) { //获取用户信息
    return fetch.post('v/user/getUserInfo', params);
  },
  upUserInfo(params) { // 设置主题
    return fetch.post('v/user/upUserInfo', params);
  },
  getUserDetail() { // 获取个人设置用户信息
    return fetch.post('v/user/getUserDetail');
  },
  getVchatInfo() { // 获取vchat官方账号信息
    return fetch.post('v/user/getVchatInfo');
  },
  addConversation(params) { // 添加会话
    return fetch.post('user/addConversation', params);
  },
  removeConversation(params) { // 移除会话
    return fetch.delete('user/removeConversation', params);
  },
  huntFriends(params) { // 添加好友
    return fetch.post('v/user/huntFriends', params);
  }
}

