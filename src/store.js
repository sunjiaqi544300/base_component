/*
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2021-01-08 11:05:35
 * @FilePath: /bm-oa-components/src/store.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import API from './api/api';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {},
    actList: [],
    historyGetList: {},
    checkMoreOption: [],
    defaultDepartment: {
      name: '',
      code: ''
    },
    actDisableData: [],
    totalNumber: 0,
    breadCrumbs: [
      {
        name: '好未来教育集团',
        orgId: 0,
        id: 1
      }
    ]
  },
  mutations: {
    setTotalNumber(state, totalNumber) {
      state.totalNumber = totalNumber;
    },
    setConfig(state, config) {
      state.config = config;
    },
    setActDisableData(state, actDisableData) {
      state.actDisableData = actDisableData;
    },
    setActList(state, actList) {
      if (Array.isArray(actList)) {
        let mapActList = actList.filter(item => {
          return !state.actList.some(items => {
            return item.code === items.code;
          });
        });
        // console.log(mapActList,'mapActList=======');
        state.actList = state.actList.concat(mapActList); 
      } else {
        let flag = state.actList.some(item => {
          return item.id === actList.id;
        });
        if(!flag) {
          state.actList.push(actList);
        }
      }
      // console.log(state.actList, 'state.actList=========');
      let totalNumber = 0;
      // console.log(totalNumber, 'totalNumber');
      let mapArr = state.actList.map(item => {
        return item.resourceNum || 1;
      });
      if (mapArr.length) {
        // mapArr.f((a, b) => {
        //   return (a||0) + (b||0);
        // });
        mapArr.forEach(item => {
          totalNumber +=item;
        });
      }
        
      state.totalNumber = totalNumber;
    },
    pushCheckMoreOption(state, checkMoreOption) {
      if (Array.isArray(checkMoreOption)) {
        state.checkMoreOption = state.checkMoreOption.concat(checkMoreOption); 
      } else {
        state.checkMoreOption.push(checkMoreOption);
      }
    },
    deleActList(state, actListIndex) {
      state.actList.splice(actListIndex, 1);
      let totalNumber = 0;
      let mapArr = state.actList.map(item => {
        return item.resourceNum || 1;
      });
      if (mapArr.length) {
        // totalNumber = mapArr.reduce((a, b) => {
        //   return (a||0) + (b||0);
        // }); 
        mapArr.forEach(item => {
          totalNumber +=item;
        });
      }
      state.totalNumber = totalNumber;
    },
    clearActList(state) {
      state.actList = [];
      state.totalNumber = 0;
    },
    setDefaultDepartment(state,defaultDepartment) {
      state.defaultDepartment = defaultDepartment;
    },
    pushBreadCrumbs(state,breadCrumbs) {
      state.breadCrumbs.push(breadCrumbs);
    },
    setBreadCrumbs(state,breadCrumbs) {
      state.breadCrumbs = breadCrumbs;
    },
    sliceBreadCrumbs(state,breadCrumbs) {
      state.breadCrumbs.splice(breadCrumbs.start, breadCrumbs.end);
    }
  },
  actions: {
    async setQueryConfig({ commit }, config) {
      // console.log(config.defaultDepartment, 'config.defaultDepartment');
      let defaultDepartmentObj = {};
      if (config.defaultDepartment && config.defaultDepartment.code) {
        let res = await API.searchPeopleCodesData({ codes: config.defaultDepartment.code });
        // let res = await API.searchPeopleCodesData({ codes: '034247' });
        if (+config.functionType === 1) {
          let resNum;
          let resourceNum = 0;
          if (config.isDivideAuth) {
            resNum = await API.getPeopleData({ isDivideAuth: true, depIds: res[0].deptId });
            // console.log(resNum, 'resNum=============');
            if (resNum.items[0].children.length) {
              resNum.items[0].children.forEach((item) => {
                resourceNum += item.treeType==='STAFF' ? item.resourceNum || 1 : item.resourceNum;
              });
            } else {
              resourceNum = resNum.items[0].resourceNum;
            }
          }
          let departmentName = res[0].descr.split('-').pop();
          let departCode = res[0].ppcode.split('|');
          departCode.unshift(res[0].depCode);
          let departName = res[0].descr.split('-');
        
          defaultDepartmentObj = {
            name: departmentName,
            code: res[0].depCode,
            orgId: res[0].deptId,
            departName,
            departCode,
            divideArr: res[0].ppcode.split('|'),
            resourceNum: config.isDivideAuth ? resourceNum : null
          };
        } else if (+config.functionType === 2) {
          let depCode = res[0].ppcode.split('|');
          // console
          let result = await API.departList({ isDivideAuth: config.isDivideAuth,code: depCode[0] });
          let departmentName = result[0].name;
          let departCode = result[0].fullCode.split('|');
          departCode.unshift(result[0].code);
          let departName = result[0].fullName.split('-');
          // console.log(result, 'result=============');
          defaultDepartmentObj = {
            name: departmentName,
            code: result[0].code,
            orgId: result[0].id,
            departName,
            departCode,
            divideArr: depCode,
            resourceNum: result[0].deptCount + 1
          };
        }
      }
      commit('setDefaultDepartment', defaultDepartmentObj);

      commit('setConfig', config);
    },
    actActList({ commit }, actList) {
      commit('setActList', actList);
    },
    delActList({ commit }, actListIndex) {
      commit('deleActList', actListIndex);
    },
    setCheckMoreOption({ commit }, checkMoreOption) {
      commit('checkMoreOption', checkMoreOption);
    }
  }
});
