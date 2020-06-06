import axios from 'axios';
import router from '../router';
import store from '../store';
let instance = axios.create({
    baseURL: '/'
});

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // router.push('/xxx')
//   // 在发送请求之前做些什么
//   // 判断是否存在token,如果存在将每个页面header添加token
//   if (store.state.token) {
//     config.headers.common['token'] = store.state.token
//   }
//   return config
// }, function (error) {
//   router.push('/login')
//   return Promise.reject(error)
// })

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
instance.interceptors.response.use(
  response => { // 拦截未登录
    if (response.data.status === 0) {
      router.replace('/');
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          router.replace('/');
      }
    }
    return Promise.reject(error.response.data)
  });

export default {
  get(url, params) {
    let headers={};
    if (store.state.token) {
      headers={
        token:store.state.token
      };
    }
    return new Promise((resolve, reject) => {
      instance.get(url, {params:params,headers:headers}).then(r => {
        resolve(r.data);
      })
    })
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      instance.post(url,params).then(r => {
        resolve(r.data);
      })
    })
  },
  delete(url, params) {
    return new Promise((resolve, reject) => {
      instance.delete(url, params).then(r => {
        resolve(r.data);
      })
    })
  }
}
