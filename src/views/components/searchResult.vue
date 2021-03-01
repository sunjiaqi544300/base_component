<template>
  <div class="p-c-right pc-conter-height">
    <div class="conter-ringht-search">
      <el-input
        :placeholder="placeholder"
        class="conter-ringht-search-input"
        size="small"
        v-model="searchValue"
        clearable
        @input="remoteMethod"
        @focus="showSearchList"
        @blur="handleHideResult"
      ></el-input>
      <ul
        class="ringht-search-ul"
        v-infinite-scroll="loadMoreOptions"
        v-show="searchlist"
      >
        <li class="no-data" v-if="loading">
          <span class="el-icon-loading"></span>数据加载中
        </li>
        <li class="no-data" v-if="noData && !loading">暂无数据</li>
        <li
          v-else
          v-for="(item) in searchData"
          :key="item.code"
          @click.stop="handleSelect(item)"
          :class="{'ringht-search-li': true, 'res-disable': item.disabled}"
        >
          <div class="seach-res" v-if="+config.functionType !== 3">
            <div class="seach-res-left" v-if="+config.functionType === 1">
              <el-avatar :size="32" :src="item.avatarUrl" />
            </div>
            <div class="seach-res-right">
              <div class="seach-res-name">
                <p style="padding-left: 10px" v-html="item.nameHtml">
                </p>
              </div>
              <div class="search-res-detial">
                <p class="res-detial-txt">
                  {{ +config.functionType === 1 ? item.descr :  item.fullName}}
                </p>
                <el-tooltip
                  v-if="(item.descr ||item.fullName).length > 16"
                  class="item"
                  effect="dark"
                  :content="item.descr||item.fullName"
                  placement="bottom"
                >
                  <p
                    class="res-detial-txt-tip"
                    @click.stop="changeIsDepartmentShow($event, 'icon')"
                  >
                    <span class="el-icon-arrow-down"></span>
                  </p>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="seach-res" v-else>
            <p class="search-res-p">
              [{{ item.code }}] {{ item.name }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 选中 -->
    <div class="selectable" v-infinite-scroll="selecTableLoad" >
      <el-button
        size="mini"
        class="selected-btn"
        v-for="(item, index) in actList"
        plain
        :key="item.code"
      >
        <span class="selected-text">{{ item.name }}</span>
        <i @click="removeActList(index)" class="el-icon-close"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import peopleData from '../../utils/localData';
import { mapState } from 'vuex';
import API from '../../api/api';
export default {
  data() {
    return {
      searchValue: null,
      searchlist: false,
      noData: false,
      loading: true,
      searchData: [],
      placeholder: '',
      splictArr: [],
      searchResult: [],
      searchCount: 0,
      loadCheckedCount: 0,
      selectedData: [],
      page: 1,
      pages: 0
    };
  },
  computed: mapState(['config', 'actList','totalNumber']),
  created() {
    this.placeholder =
      +this.config.functionType === 1
        ? '搜索姓名、工号'
        : +this.config.functionType === 2
          ? '搜索部门名称、部门编码'
          : '搜索主体名称、主体编码';
  },
  methods: {
    showSearchList(e) {
      console.log(e.target.value,'2222222');
      if(!e.target.value){
        this.searchlist = true;
        this.loading = false;
        this.noData = false;
        this.searchData = [];
      }
    },
    // 搜索框搜索事件
    async remoteMethod() {
      this.searchlist = true;
      let query = this.searchValue;
      let res = peopleData;
      if (query !== '') {
        this.loading = true;
        if(+this.config.functionType === 1) {
          res = await API.searchPeopleData({
            isDivideAuth:this.config.isDivideAuth,
            searchKey: query,
            page: this.page
          });
        } else if (+this.config.functionType === 2) {
          res = await API.searchDepartmentData({
            isDivideAuth:this.config.isDivideAuth,
            searchKey: query,
            page: this.page
          });
        } else {
          res = await API.searchSubjectData({
            searchKey: query,
            page: this.page
          });
        }
        if (res.records.length) {
          this.pages = res.pages; 
          this.loading = false;
          res.records.forEach((val) => {
            val.nameHtml = this.brightenKeyword(val, query);
            let hasSelect = this.actList.some(item => item.code === val.code);
            val.disabled = hasSelect;
          });
          this.searchResult = res.records;
          if(res.current === 1) {
            this.searchData = [];
            this.splictArr = [];
          }
          this.splictArr = this.groupList(this.searchResult, 20);
          this.searchData = this.searchData.length ? this.searchData : this.splictArr[0];
          this.noData = false;
          this.loading = false;
        } else {
          this.searchData = [];
          this.loading = false;
          this.noData = true;
        }
      } else {
        this.searchData = [];
        this.loading = false;
        this.noData = false;
        this.searchList = false;
      }
    },
    groupList(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return this.splictArr.concat(newArray);
    },
    // 选中要选择的人员后 触发的事件
    handleSelect(item) {
      if (item.disabled) return;
      // console.log(item,'item=====?');
      if(this.totalNumber === this.config.maxLength) {
        this.$message.error({
          message: '超出限制，不能选择',
          type: 'error',
          customClass: 'message-error',
          duration: 2000
        });
        return false;
      }
      if(+this.config.functionType !== 3) {
        if (+this.config.functionType === 1){
          item.pIdArr = item.ppcode ? item.ppcode.split('|') : [];
        } else {
          item.pIdArr = item.fullCode ? item.fullCode.split('|') : [];
        }
        item.pIdArr.unshift(item.depCode || item.code);
      }
      this.searchlist = false;
      this.searchValue = null;
      this.$store.dispatch('actActList', item);
      console.log(item.pIdArr,item, 'actList=======');
    },
    // 搜索框 搜索人员部门名称过长 点击展开后 样式切换
    changeIsDepartmentShow(event) {
      if (event.target) {
        let txt = event.path[2].childNodes[0];
        event.target.style = 'display:none';
        txt.style =
          'padding-left:10px;display:inline-block;max-width:183px;word-wrap:break-word;white-space: normal;';
      }
    },
    // 无限滚动
    loadMoreOptions() {
      if(this.searchData.length){
        if(this.searchData.length >= (60*(this.page || 1))) {
          this.page +=1;
          if (this.page <= this.pages) {
            this.remoteMethod();
          }
        }
        this.searchCount += 1;
        if (this.splictArr[this.searchCount]) {
          this.searchData = [...this.searchData, ...this.splictArr[this.searchCount]];
        }
      }
    },
    // 筛选字段高亮显示
    brightenKeyword(item, query) {
      const Reg = new RegExp(query, 'i');
      let resCurrent;
      if (query) {
        // 这里为什么使用$&不使用query，因为这里使用正则表达式不区分大小写，
        // 如果是文本时大写，搜索的关键字是小写也是会被匹配的，这样匹配替换掉的话，
        // 文本内的文字会被替换成搜索的query，也就是改成了小写，这样不太合理
        let replaceName = item.name.replace(
          Reg,
          '<span style="color: #2A8EFF;">$&</span>'
        );
        resCurrent = `<span style="color: #000;">${replaceName}  (${item.code})</span>`;
      } else {
        resCurrent = `<span style="color: #000;">${item.name} (${item.code})</span>`;
      }
      return resCurrent;
    },
    // 删除选中项
    removeActList(actListIndex) {
      this.$store.dispatch('delActList', actListIndex);
    },
    // 选中人员过多时无限滚动下拉
    selecTableLoad() {
      // console.log(this.selectedData.length);
      // if(this.selectedData.length === this.totalNumber) return false;
      this.loadCheckedCount += 1;
      let doubleArr = this.groupList(this.actList, 50);
      let i = 0;
      this.selectedData = [];
      while (i >= 0) {
        if (!doubleArr[i]) return this.loadCheckedCount = i - 1;
        if (i < this.loadCheckedCount){
          this.selectedData = this.selectedData.concat(doubleArr[i]);
        }
        i++;
      }
    },
    hideResultList(){
      this.searchList = false;
      console.log('wwww',this.searchList);
    },
    handleHideResult() {
      this.searchList = false;
      this.loading = false;
      this.noData = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.pc-conter-height {
  height: 100%;
}
.p-c-right {
  border-left: 1px solid #F0F0F0;
  .conter-ringht-search {
    padding-top: 29px;
    margin-left: 10px;
    font-size: 14px;
    width: 83%;
    position: relative;
    .conter-ringht-search-input {
      width: 100%;
    }
    .ringht-search-ul {
      width: 100%;
      position: absolute;
      max-height: 220px;
      overflow: auto;
      background: #ffffff;
      box-shadow: 0px 1px 8px -2px rgba(0, 0, 0, 0.18);
      border-radius: 4px;
      // padding-left: 10px;
      // padding-right: 5px;
      .ringht-search-li {
        width: 100%;
        padding: 5px 0px;
        cursor: pointer;
        .seach-res {
          display: flex;
          .seach-res-left {
            width: 32px;
            margin-left: 10px;
          }
          .seach-res-right {
            flex: 1;
            .seach-res-name {
              line-height: 17px;
            }
            .search-res-detial {
              line-height: 17px;
              color: #919191;
              font-size: 12px;
              .res-detial-txt {
                padding-left: 10px;
                display: inline-block;
                max-width: 183px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .res-detial-txt-tip {
                display: inline-block;
                vertical-align: text-bottom;
              }
            }
          }
        }
      }
      .ringht-search-li:hover {
        background-color: #f6f6f6;
      }
    }
  }
  .selectable {
    min-height: 307px;
    max-height: 301px;
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
    padding: 10px 0;
    .selected-btn {
      max-width: 100%;
      margin-left: 10px;
      margin-top: 10px;
      border-radius:4px;
      border:1px solid rgba(229,229,229,1);
      cursor: Default;
    }
    .selected-btn:hover,
    .selected-btn:focus{
      color: rgba(34,34,34,1);
    }
    .selected-text {
      display: inline-block;
      word-break: break-all;
      white-space: normal;
      text-align: left;
      line-height: 20px;
      font-size: 14px;
      font-weight:400;
      color:rgba(34,34,34,1);
    }
    .el-icon-close {
      cursor: pointer;
      vertical-align: inherit;
      margin-left: 6px;
    }
    .el-icon-close:hover {
      color: #409EFF;
    }
  }
}
.no-data {
  padding: 10px;
  text-align: center;
}
.search-res-p {
  white-space: normal;
  word-break: break-all;
  padding: 5px 10px;
  font-size: 12px;
  margin-right: 18px;
}
/deep/ .el-button--mini {
  padding: 2px 8px;
}
.p-c-right .conter-ringht-search .ringht-search-ul .res-disable{
  cursor: not-allowed;
  background:rgba(246,246,246,1);
  opacity: .5;
  .seach-res-right{
    .seach-res-name{
      span {
        color:rgba(42,142,255,1) !important;
      }
    }
    .search-res-detial{
      color:rgba(145,145,145,1);
    }
  }
}
.p-c-right .conter-ringht-search .ringht-search-ul .res-disable:hover{
  background:rgba(246,246,246,1);
}
.conter-ringht-search{
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
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background   : rgba(0, 0, 0, 0.1);
  }
}
</style>