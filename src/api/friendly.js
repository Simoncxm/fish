/**
 * Created by wyw on 2018/11/1.
 */
import fetch from './fetch';

export default {
  getMyfriend() { //获取我的好友
    return fetch.get('v/friend/getMyfriend');
  },
  checkMyfriend(params) { //验证是否为我的好友
    return fetch.get('v/friend/checkMyfriend', params);
  },
  deleteMyFriend(params){//删除好友
    return fetch.delete('v/friend/deleteMyFriend',params);
  }
}

