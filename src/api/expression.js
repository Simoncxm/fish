import fetch from './fetch';

export default {
  getExpression(params) { //获取表情库
    return fetch.get('expre/getExpression', params);
  }
}

