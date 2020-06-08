/**
 * Created by wyw on 2018/12/6.
 */
import fetch from './fetch';

export default {
  removeMessage(params) { //删除消息
    return fetch.delete('mes/removeMessage', params);
  },
  getMoreMessage(params) { //加载更多消息
    return fetch.get('mes/getMoreMessage', params);
  }
}
