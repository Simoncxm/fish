import fetch from './fetch';

export default {
  createGroup(params) { //新建群
    return fetch.post('group/createGroup', params);
  },
  getMyGroup() { //查找我的群
    return fetch.get('group/getMyGroup');
  },
  getGroupUser(params) {
    return fetch.get('group/getGroupUser', params);
  },
  searchGroup(params) {
    return fetch.post('group/searchGroup', params);
  },
  getGroupInfo(params) {
    return fetch.post('group/getGroupInfo', params);
  }
}

