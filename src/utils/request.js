
import axios from 'axios';
// import { showLoading, hideLoading } from '../common/loading';
import  baseUrl from '../plugins/global';
import { Message } from 'element-ui';

const service = axios.create({
  baseURL: baseUrl.baseUrl,
  // timeout: 3 * 1000,
  // headers: {
  //   referer:'test.zhiyinlou.com'
  // },
  // 是否允许后端设置cookie跨域，一般无需改动
  //withCredentials: false,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
});

service.defaults.headers.common['Content-Type'] = 'application/json';
service.interceptors.request.use(
  config => {
    
    // showLoading();
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if(response.data.code===-1){
      return response.data;
    }
    // hideLoading();
    if (response.data.code == 302) {
      window.top.location.href =
      response.data.data.url +
        'url=' +
        encodeURIComponent(
          window.top.location.origin +
            window.top.location.pathname +
            window.top.location.search +
            window.top.location.hash
        );
    }
    if(response.status){
      return response.data.data;
    }
    return response;
  },
  (error) => {
    // hideLoading();
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
      case 400:
        error.message = '错误请求';
        break;
      case 401:
        error.message = '未授权，请重新登录';
        break;
      case 403:
        error.message = '拒绝访问';
        break;
      case 404:
        error.message = '请求错误,未找到该资源';
        break;
      case 405:
        error.message = '请求方法未允许';
        break;
      case 408:
        error.message = '请求超时';
        break;
      case 500:
        error.message = '服务器端出错';
        break;
      case 501:
        error.message = '网络未实现';
        break;
      case 502:
        error.message = '网络错误';
        break;
      case 503:
        error.message = '服务不可用';
        break;
      case 504:
        error.message = '网络超时';
        break;
      case 505:
        error.message = 'http版本不支持该请求';
        break;
      default:
        error.message = `连接错误${error.response.status}`;
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes('timeout')) {
        Message.error('服务器响应超时，请刷新当前页');
      }
      error.message('连接服务器失败');
    }

    Message.error(error.message);

    return Promise.reject(error.response);
  }
);

export default service;
