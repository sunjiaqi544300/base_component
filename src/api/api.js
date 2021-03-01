/*
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2021-01-07 15:52:33
 * @FilePath: /bm-oa-components/src/api/api.js
 */
import Http from '../utils/http';

// // 自定义控件
// function CustomizeAPI(data, isDBLink) {
//   // return Http.post(`new/api/oa/sys/public-dict/custom/control`, data);
//   if (isDBLink) {
//     return Http.post('/new/api/oa/sys/public-dict/custom/control', data);
//   }
//   return Http.get('/new/api/oa/sys/dblink/get-data', data);
// }
// // 自定义控件 回显数据
// function PageAPIR(data, isDBLink) {
//   if (isDBLink) {
//     return Http.get('/new/api/oa/sys/public-dict/custom/control/find/labels', data);
//   }
//   return Http.get('/new/api/oa/sys/public-dict/custom/control/find/labels', data);

// }
// 自定义控件  回显数据利用valLis字段控制  isDBLink功能没问题，判断反了
function PageAPI(data, isDBLink) {
  if (isDBLink) {
    return Http.post('/new/api/oa/sys/public-dict/custom/control/page', data);
  }
  return Http.get('/new/api/oa/sys/dblink/get-data-page', data);

}

function getData(params) {
  return Http.get('/new/api/oa/tree/org-auth-resource', params);
}
function getPeopleData(params) {
  return Http.get('/new/api/oa/tree/dep/resource', params);
}
// 人员搜索
function searchPeopleData(params) {
  return Http.get('new/api/oa/hrm/resource/search', params);
}
// 人员  id 多个搜索
function searchPeopleIdsData(params) {
  return Http.get('new/api/oa/hrm/resource/batch/ids', params);
}
// 人员  code 多个搜索
function searchPeopleCodesData(params) {
  return Http.get('new/api/oa/hrm/resource/batch/codes', params);
}
// 部门 id 多个搜索
function searchDepartmentIdsData(params) {
  return Http.get('new/api/oa/dep/batch/search/ids', params);
}
// 部门 code 多个搜索
function searchDepartmentCodesData(params) {
  return Http.get('new/api/oa/dep/batch/search/codes', params);
}
// 部门搜索
function searchDepartmentData(params) {
  return Http.get('new/api/oa/dep/page/search', params);
}
// 主体搜索
function searchSubjectData(params) {
  return Http.get('new/api/oa/hrm/sub/company/search', params);
}
// 部门层级
function departList(params) {
  return Http.get('new/api/oa/dep/lvl', params);
}
// 部门下人员
function departPeopleList(params) {
  return Http.get('new/api/oa/dep/page/resource', params);
}
function departData(params) {
  return Http.get('/new/api/oa/tree/dep', params);
}
function infoData(params) {
  return Http.get('/new/api/oa/tree/org-auth-sub', params);
}
function deptResourceNum(params) {
  return Http.get('/new/api/oa/dep/resource-child/count', params);
}
export default{
  // CustomizeAPI,
  PageAPI,
  // PageAPIR,
  getData,
  getPeopleData,
  searchPeopleData,
  searchSubjectData,
  searchDepartmentData,
  departList,
  departData,
  infoData,
  departPeopleList,
  searchPeopleIdsData,
  searchPeopleCodesData,
  searchDepartmentIdsData,
  searchDepartmentCodesData,
  deptResourceNum
};
