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
    return fetch.get('v/user/getUserInfo', params);
  },
  updateUserInfo(params) { // 修改个人信息
    return fetch.post('v/user/updateUserInfo', params);
  },
  updateUserGender(params) { // 修改个人性别
    return fetch.get('v/user/updateUserGender', params);
  },
  updateBgOpa(params) { // 修改聊天透明度
    return fetch.get('v/user/updateBgOpa', params);
  },
  getUserDetail() { // 获取个人设置用户信息
    return fetch.post('v/user/getUserDetail');
  },
  getSystemInfo() { // 获取系统信息
    return fetch.get('v/user/getSystemInfo');
  },
  addConversitionList(params) { // 添加会话
    return fetch.post('v/user/addConversitionList', params);
  },
  removeConversitionList(params) { // 移除会话
    return fetch.post('v/user/removeConversitionList', params);
  },
  searchFriend(params) { // 添加好友
    return fetch.post('v/user/searchFriend', params);
  }
}

