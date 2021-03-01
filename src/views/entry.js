/*
* @Descripttion: 
* @Author: Duanlinpeng
* @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2021-01-20 14:45:02
 * @FilePath: /bm-oa-components/src/views/entry.js
*/
// 导出本地iconfont
//import "../static/icons-old/iconfont";
import '../../static/icons/iconfont';
import '../../static/icons/iconfont.css';
import store from '../store';
const functionTypeArr = [1, 2, 3];
export const parseUrl = (_this) => {
  let dataURl = {};
  var url = window.location.href;
  // var url = window.location.href.replace("#/",'');
  console.log(functionTypeArr, 'functionTypeArr');
  console.log(url,'functionTypeArr');
  if (url.indexOf('?') != -1) {
    url
      .split('?')[1]
      .split('&')
      .forEach((element) => {
        let arr = element.split('=');
        dataURl[arr[0]] = arr[1].replace(/\'/g, '').replace(/\"/g, '');
      });
    // console.log(dataURl.isDivideAuth,'dataURl.isDivideAuth');
    dataURl.isDivideAuth = JSON.parse(dataURl.isDivideAuth || 'false');
    dataURl.justLastCheck = JSON.parse(dataURl.justLastCheck || 'false');
    dataURl.multiple = JSON.parse(dataURl.multiple || 'false');
    dataURl.functionType = JSON.parse(dataURl.functionType);
    dataURl.maxLength = JSON.parse(dataURl.maxLength || '1000');
    store.dispatch('setQueryConfig', dataURl);
    if (functionTypeArr.includes(+dataURl.functionType)) {
      _this.$router.replace('./peopleMultiple');
    } else if (dataURl.functionType == 4) {
      (!dataURl.multiple
        ? _this.$router.replace({
          path: '/tableRadio',
          query: { code: dataURl.code },
        })
        : _this.$router.replace({
          path: '/tableMultiple',
          query: { code: dataURl.code },
        }));
    }
  } else {
    _this.$router.push('./client-api');
  }
};
