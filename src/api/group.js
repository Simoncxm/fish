import fetch from './fetch';

export default {
  createGroup(params) { //新建群
    return fetch.post('v/group/createGroup', params);
  },
  getMyGroup() { //查找我的群
    return fetch.get('v/group/getMyGroup');
  },
  getGroupUser(params) {
    return fetch.get('v/group/getGroupUser', params);
  },
  searchGroup(params) {
    return fetch.post('v/group/searchGroup', params);
  },
  getGroupInfo(params) {
    return fetch.post('v/group/getGroupInfo', params);
  }
}

