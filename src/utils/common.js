/*
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2020-10-21 11:49:34
 * @FilePath: /bm-oa-components/src/utils/common.js
 */
//基础方法
  
export default {
  /**
     * 替换json中的点（.）
   * arr: 数据源
   * ag  被替换 
   * sg 替换
   */
  changeString(str,ag,sg){
    return str.replace(ag,sg);
  },
  changeKey(arr,ag,sg){
    let newArr = [];
    arr.forEach((item) => {
      let newObj = {};
      let keysList = Object.keys(item);
      for (var i = 0; i < keysList.length; i++) {
        newObj[keysList[i].replace(ag, sg)] = item[Object.keys(item)[i]];
      }
      newArr.push(newObj);
    });
    return newArr;
  },
  changeValue(arr,ag,sg){
    let newArr = [];
    arr.forEach((item) => {
      let newObj = {};
      let keysList = Object.keys(item);
      for (var i = 0; i < keysList.length; i++) {
        // [item.keysList[i]] = item[Object.keys(item)[i]]
        newObj[keysList[i]]= item[keysList[i]].replace(ag, sg);
      }
      newArr.push(newObj);
    });
    return newArr;
  }
};
