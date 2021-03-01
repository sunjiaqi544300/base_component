<!--
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2021-01-19 19:00:22
 * @FilePath: /bm-oa-components/src/views/peopleMultiple.vue
-->
<template>
  <div class="people-control">
    <Header :title="title" @OnClose="onClose"></Header>
    <div class="p-c-conter" v-clickoutside="handleClose">
      <el-row class="pc-conter-height">
        <el-col :span="14" class="pc-conter-height">
          <div class="p-c-left pc-conter-height">
            <div class="object-tree">
              <p v-if="searchObject && +config.functionType === 1">
                <img class="avatar" size="small" src="../assets/img/hwl.png"/>
                <span class="tree-title">好未来教育科技集团</span>
                <!-- <span class="el-icon-arrow-down" style=""></span> -->
              </p>
              <p v-else>
                <span @click="handleToggleTag()" v-if="!loading" class="el-icon-arrow-left" style="cursor:pointer;"></span>
                <span v-else class="el-icon-loading"></span>
                <span class="tree-title" @click="handleToggleTag()">好未来教育科技集团</span>
              </p>
              <department-list
                v-clickoutside="handleClose"
                v-if="searchObject && +config.functionType === 1"
                @searchObjectTree="searchObjectTree"
                @handleToDepartment="handleToDepartment"
              ></department-list>
              <object-tree-list
              v-clickoutside="handleClose"
              v-show="!searchObject"
              :searchObject="searchObject"
              @titleLoading="titleLoading"
              :notLodaData="notLodaData"
              ref="objectTree"
              ></object-tree-list>
            </div>
          </div>
        </el-col>
        <el-col :span="10" class="pc-conter-height">
          <search-result v-clickoutside="handleClose" ref="selected"></search-result>
        </el-col>
      </el-row>
    </div>
    <div class="pc-footer">
      <div class="button">
        <el-button size="small" @click="clearData">清除</el-button>
        <el-button size="small" type="primary" @click="handleMessageToParent(true)"
          >确认({{ getCheckNumber() }}/{{ maxLength }})</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>

const clickoutside = {
  // 初始化指令
  bind(el, binding) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind(el) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};
import Header from '../components/header';
import objectTreeList from './components/objectTreeList';
import departmentList from './components/departementList';
import searchResult from './components/searchResult';
import { mapState } from 'vuex';
import API from '../api/api';
export default {
  data() {
    return {
      title: '',
      maxLength: 0, //最大人数
      // 按部门搜索人员 默认页面是否显示
      searchObject: true,
      // 下拉搜索框 是否有数据
      noData: true,
      code: '',
      myWindow: null,
      loading: false,
      notLodaData: false
    };
  },
  computed: mapState(['config', 'actList','defaultDepartment','breadCrumbs']),
  components: {
    objectTreeList,
    Header,
    departmentList,
    searchResult,
  },
  directives:{
    clickoutside
  },
  created() {
    if(+this.config.functionType === 2) {
      this.searchObject = false;
    }
    this.code = this.config.code;
    this.maxLength = this.config.multiple ? this.config.maxLength : 1;
  },
  mounted(){
    this.$nextTick(() => {
      // 定义window方法
      window.addEventListener('message', this.handleMessageFromParent,false); 
      window.parent.postMessage(
        {
          cmd: 'on'+this.config.code,
          params: {},
        },
        this.myWindow
      );
    });
  },
  methods: {
    handleClose() {
      if(this.$refs.selected){
        this.$refs.selected.searchList = false;
        this.$refs.selected.searchData = [];
        this.$refs.selected.searchValue = '';
      }
    },
    handleToggleTag() {
      this.searchObject = !this.searchObject;
      this.$store.commit('sliceBreadCrumbs',{start:1, end: this.breadCrumbs.length});
      this.$refs.objectTree.checkOptions = [];
    },
    async init(data) {
      // console.log(data,'defaultData=======');
      this.config.maxLength = this.maxLength;
      let config = {
        ...this.config,
        defaultData: data.defaultData ,
        disabledData: data.disabledData ,
        defaultDepartment: data.defaultDepartment ,
        justLastCheck: data.justLastCheck,
        isDivideAuth: data.isDivideAuth
      };
      this.$store.dispatch('setQueryConfig', config);
      if(config.defaultData.length) {
        let ids = [];
        config.defaultData.forEach(val => {
          // if(+this.config.functionType === 1) {
          //   ids.push(val.id);
          // } else {
          ids.push(val.id);
          // }
        });
        let idsArr = ids.join(',');
        let res;
        if(+this.config.functionType === 1){
          // res = await API.searchPeopleCodesData({codes: idsArr});
          res = await API.searchPeopleIdsData({ids: idsArr});
        } else if(+this.config.functionType === 2){
          res = await API.searchDepartmentIdsData({ids: idsArr});
        }
        // conso
        let dataArr = [];
        idsArr.split(',').forEach(items => {
          res.forEach(item => {
            // let codeRes = item.code;
            // if(+this.config.functionType === 2) {
            let codeRes = item.id;
            // }
            if (('' +items) === (''+ codeRes)) {
              let pIdArr = item.ppcode ? item.ppcode.split('|') : item.fullCode.split('|');
              let nameArr = item.fullName ? item.fullName.split('-') : [];
              let name = item.name || nameArr[nameArr.length -1] || '';
              pIdArr.unshift(item.depCode || item.code);
              dataArr.push({
                code: item.code,
                orgId: item.deptId || item.id,
                id: item.id,
                name,
                pIdArr
              });
            }
          });
        });
        
        console.log(res,dataArr,'searchPeopleCodesData=====');
        this.$store.dispatch('actActList', dataArr);
      }
    },
    handleMessageFromParent () {
      // 子接收父参数
      var _data = event.data;
      this.myWindow = event.source;
      // console.log('接收参数this', _data, event);
      switch (_data.cmd) {
      case this.code:
        // 处理业务逻辑
        // this.defaultData = _data.params.data;
        this.title = _data.params.title;
        this.maxLength = this.config.multiple ? _data.params.maxLength : 1;
        _data.params.maxLength = this.maxLength;
        this.init(_data.params);
        break;
      }
      window.removeEventListener('message', this.handleMessageFromParent,false); 
    },
    // 按部门搜索人员 - 树状图是否显示
    searchObjectTree() {
      this.searchObject = false;
    },
    //关闭
    onClose() {
      // 子向父传参
      window.parent.postMessage(
        {
          cmd: this.code,
          params: {
            data: this.config.defaultData || [],
            flag: false
          },
        },
        this.myWindow
      );
    },
    async handleMessageToParent(e) {
      let checkedList = [...this.actList];
      if(+this.config.functionType === 1){
        let departmentArr = [];
        this.actList.forEach((item,index) => {
          if(item.hasChild) {
            departmentArr.push(item.code);
            checkedList.splice(index, 1);
          }
        });
        if(departmentArr.length) {
          let JsonData = {codes:departmentArr.join(','),isPage: true,page:1,pageSize:1000};
          let result = await API.departPeopleList(JsonData);
          // console.log(result,'result=============');
          checkedList = [...checkedList, ...result.records];
          if(result.total > 500) {
            let JsonData = {codes:departmentArr.join(','),isPage: true,page:2,pageSize:1000};
            let result = await API.departPeopleList(JsonData);
            checkedList = [...checkedList, ...result.records];
          }
        }
        checkedList.forEach(val => {
          delete val.avatarUrl;
          delete val.checked;
          delete val.hasChild;
          delete val.pIdArr;
          delete val.resourceNum;
          delete val.treeType;
          delete val.orgId;
          delete val.ppcode;
          delete val.nameHtml;
          delete val.disabled;
          delete val.descr;
          delete val.deptId;
          delete val.depCode;
        });
        console.log(checkedList,'checkedList=================');
      } else if(+this.config.functionType === 2) {
        checkedList.forEach(val => {
          delete val.avatarUrl;
          delete val.checked;
          delete val.hasChild;
          delete val.pIdArr;
          delete val.resourceNum;
          delete val.treeType;
          delete val.orgId;
        });
      }
      // 子向父传参
      window.parent.postMessage(
        {
          cmd: this.code,
          params: {
            data: e ? checkedList : [],
            flag: e
          },
        },
        this.myWindow
      );
    },
    // 清除
    clearData() {
      this.$store.commit('clearActList');
      this.$refs.selected.selectedData = [];
    },
    titleLoading(flag){
      this.loading = flag;
    },
    getCheckNumber(){
      let total = 0;
      if (+this.config.functionType === 1 && this.actList.length) {
        // console.log(this.actList,'this.actList=======');
        this.actList.forEach(item => {
          if(item && item.hasChild) {
            total += item.resourceNum;
          } else {
            total +=1;
          }
        });
      } else {
        total = this.actList.length;
      }
      this.$store.commit('setTotalNumber', total);
      return total;
    },
    async handleToDepartment(){
      if(this.defaultDepartment.orgId && +this.config.functionType === 1) {
        this.notLodaData = true;
        this.searchObjectTree();
        let pCode = [...this.defaultDepartment.departCode].reverse();
        let res = await API.searchDepartmentCodesData({codes: pCode.join(',')});
        let dataDepart = [
          {
            name: '好未来教育集团',
            orgId: 0,
            id: 1
          }
        ];
        res.forEach((item, index) => {
          if (index < res.length -1) {
            let nameArr = item.fullName.split('-');
            let name = nameArr[nameArr.length - 1];
            dataDepart.push({
              orgId: item.id,
              name: name,
              id: index + 2,
              code: item.code
            });
          }
        });
        this.$store.commit('setBreadCrumbs',dataDepart);
        // console.log(dataDepart,'dataDepart======');
        this.$nextTick(() => {
          this.notLodaData = false;
          this.$refs.objectTree.levelDown(this.defaultDepartment.orgId,this.defaultDepartment.name,this.defaultDepartment.code,pCode,'objectTree');
        });
      }
    },
  }
};
</script>
<style scoped lang="scss">
.people-control {
  height: 100%;
  .p-c-conter {
    font-size: 14px;
    .pc-conter-height {
      height: 100%;
    }
    .p-c-left {
      .object-tree {
        padding-top: 29px;
        margin-left: 30px;
        .tree-title {
          cursor: pointer;
          color: #222222;
          font-size: 16px;
          vertical-align: middle;
          margin-left: 10px;
          font-weight: 600;
        }
        .avatar{
          width:22px;
          height:22px;
          line-height:22px;
          vertical-align:middle;
          border-radius:50%;
          display:inline-block;
          text-align:center;
        }
        .el-icon-arrow-down {
          margin-left: 10px;
          font-weight: 500;
          font-size: 12px;
          color: #000;
        }
        .el-icon-arrow-left,
        .el-icon-loading{
          font-weight: 600;
          color: #000;
        }
      }
    }
  }
  .pc-footer {
    border-top: 1px solid #F0F0F0;
    // height: 70px;
    .button {
      float: right;
      line-height: 60px;
      margin-right: 24px;
      button {
        margin-left: 10px;
        width: 120px;
      }
    }
  }
}
/deep/ .el-input__inner {
  border: none;
}
/deep/.el-select-dropdown__item {
  height: 100%;
  padding-top: 10px;
}
.selectable /deep/ .el-button--mini {
  margin: 5px 10px 0 0;
}
.object-tree /deep/ .el-avatar--small {
  vertical-align: middle;
}
.object-tree /deep/ .el-icon-arrow-down {
  vertical-align: middle;
}
::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height               : 6px;
    scrollbar-arrow-color: red;

  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius        : 5px;
    box-shadow           : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background           : rgba(0, 0, 0, 0.2);
    scrollbar-arrow-color: red;
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    // background   : rgba(0, 0, 0, 0.1);
  }
</style>
