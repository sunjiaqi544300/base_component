<template>
  <div class="table-radio">
    <Header :title="title" @OnClose="onClose"></Header>
    <div class="search">
      <el-input class="p-c-input" placeholder="搜索" size="small" style="width: 350px;" v-model="query.queryContent" @keyup.enter.native="getList(true)"><i slot="suffix" class="el-icon-search"></i></el-input>
    </div>
    <div class="p-c-conter">
      <!-- 选中 -->
      <div class="selected">
        <el-tag
          v-for="tag in multipleSelection"
          style="margin: 0 10px 10px 0"
          :key="tag.name"
          closable
          type="info"
          @close="handleClose(tag)"
        >
        <span v-for="(item,index) in tableTitle" :key="index">
            {{tableTitle.length-1 === index?tag[item.name]:tag[item.name]+'/'}}
          </span>
        </el-tag>
      </div>
      <!-- 搜索结果 -->
      <div class="selectable" v-show="tableData.length>0">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          :header-cell-style="{background:'#F5F6F7',fontWeight: 500,color: '#222'}"
          header-row-class-name="table-header"
          :row-key="getRowKeys"
          :border="true"
          @select="handleSelection"
          @select-all="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true" align="center"></el-table-column>
          <el-table-column
            v-for="(item,index) in tableTitle"
            :key="index"
            :prop="item.name"
            :label="item.desc"
          ></el-table-column>
        </el-table>
      </div>
      <div class="selectable undata" v-show="isTable">
        <img src="../assets/img/zwsj.png">
        <p>{{errTitle}}</p>
      </div>
    </div>
    <div class="p-c-button" v-show="tableData.length>0">
      <el-pagination
        :current-page="query.page"
        :page-sizes="[10,20,50,100, 200, 300]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChang"
        :total="total"
      ></el-pagination>
      <el-button class="act" size="small"  @click="handleMessageToParent(false)">取消</el-button>
      <el-button
        class="act"
        size="small"
        type="primary"
        @click="handleMessageToParent(true)"
      >确认({{multipleSelection.length}}/{{maxLength}})</el-button>
    </div>
  </div>
</template>
<script>
import API from '../api/api';
import Common from '../utils/common';
import Header from '../components/header';
// import preventBack from 'vue-prevent-browser-back';//组件内单独引入
export default {
  // mixins: [preventBack],//注入
  name: 'index',
  data() {
    return {
      rowKey: null,
      title: '自定义-多选',
      errTitle: '',
      maxLength: null,
      query:{
        queryContent:'',
        page:1,
        pageSize:10,
      },
      total:0,
      code: '',    //项目标示
      tableTitle: [], //表头
      tableData: [],  //表数据
      tableId: '',     //id
      multipleSelection: [],  //表选中
      multipleSelectionData: [],  //表选中
      select_orderId:[], ///表格select复选框选中的id
      iframeData:[],   
      myWindow: null,  //指向上级window
      multipleValue:[],//id集合
      multipleLable:[],//显示结合
      propsData:{},     //参数
      actionType: null,  //监听：用于区分表格发生change事件时，来源状态
      isDBLink: false,
      isTable:false
    };
  },
  created() {
    this.code = this.$route.query.code;
  },
  mounted(){
    this.$nextTick(() => {
      // 定义window方法
      window.addEventListener('message', this.handleMessageFromParent,false); 
      window.parent.postMessage(
        {
          cmd: 'on'+this.code,
          params: {},
        },
        this.myWindow
      );
    });
  },
  watch: {
  },
  methods: {
    getRowKeys(row) {//记录每行的key值
      return row[this.tableId];//id 自己查看 row 里的数据 
    },  
    async init(){
      if(this.iframeData.length>0){
        let _data;
        if(this.isDBLink){
          _data = Object.assign({},this.propsData,{valList:this.iframeData},{page:1,pageSize:this.iframeData.length});
        }else{
          _data = Object.assign({},this.propsData,{valList:this.iframeData.join(',')},{page:1,pageSize:this.iframeData.length});
        }
        //回显数据请求
        let res = await API.PageAPI(_data,this.isDBLink);
        if(res.code===-1){
          this.errTitle=res.message;
        }else{
          this.multipleSelectionData=Common.changeKey(res.results.data,'.','__');
        }
      }
      //获取单选数据 
      API.PageAPI(Object.assign({},this.propsData,this.query),this.isDBLink).then(res=>{
        if(res.code===-1){
          this.errTitle=res.message;
          this.isTable = true;
          this.tableData=[];
        }else{
          this.total= res.total;
          this.maxLength = this.maxLength===null?res.total:this.maxLength;
          this.tableData = (Common.changeKey(res.results.data,'.','__') || []);
          this.isTable = this.tableData.length>0?false:true;
          this.errTitle='暂无数据';
          this.tableTitle = Common.changeValue(res.results.tableTitle,'.','__') || [];
          this.tableId = Common.changeString(res.valueField,'.','__');
          this.$nextTick(()=>{
            this.echoReturn();
          },25);
          
        }
      });
    },
    //返回值回显字段
    echoReturn(){
      console.log(this.multipleSelectionData);
      for(let i=0;i<this.multipleSelectionData.length;i++){
        for(let j=0;j<this.tableData.length;j++){
          if(this.multipleSelectionData[i][this.tableId]===this.tableData[j][this.tableId]){
            this.$refs.multipleTable.toggleRowSelection(this.tableData[j],true);
          }
        }
      }
      this.multipleSelection = this.multipleSelectionData;
    },
    //搜索时，始终从第一页开始
    getList(v){
      let _data=Object.assign({},this.propsData,this.query);
      v?_data.page=1:'';
      API.PageAPI(_data,this.isDBLink).then(res=>{
        if(res.code===-1){return;}
        this.total= res.total;
        this.tableData = (Common.changeKey(res.results.data,'.','__') || []);
        this.isTable = this.tableData.length>0?false:true;
        this.errTitle='暂无数据';
        this.$nextTick(()=>{
          this.echoReturn();
        },25);
      });
    },
    handleMessageFromParent(event) {
      // 子接收父参数
      var _data = event.data;
      this.myWindow = event.source;
      // console.log('接收参数this', _data, event);
      switch (_data.cmd) {
      case this.code:
        // 处理业务逻辑
        this.iframeData = _data.params.data;
        this.propsData = _data.params.props;
        this.isDBLink = _data.params.props.isDBLink || false;
        this.title = _data.params.title || '自定义-多选';
        this.maxLength = _data.params.maxLength || null;
        this.init();
        break;
      }
      window.removeEventListener('message', this.handleMessageFromParent,false); 
    },
    //确认 取消 回传  e===true/false
    handleMessageToParent(e) {
      if(e){
        this.manageData();
      }
      // 子向父传参
      window.parent.postMessage(
        {
          cmd: this.code,
          params: {
            data: e?this.multipleSelection:[],
            value: e?this.multipleValue:[],
            lable: e?this.multipleLable:[],
            flag: e
          },
        },
        this.myWindow
      );
    },
    //处理返回数据
    manageData(){
      let _titleStr=[];
      this.tableTitle.forEach(itemChild=>{
        _titleStr.push(itemChild.name);
      });
      //当前项以选项合并
      this.multipleSelection.forEach(item=>{
        this.multipleValue.push(item[this.tableId]);
        let _lable = '';
        _titleStr.forEach((i,index,arr)=>{
          _lable += arr.length-1!=index?item[i]+'/':item[i];
        });
        this.multipleLable.push(_lable);
      });
      //去重
      this.multipleValue = Array.from(new Set(this.multipleValue));
      this.multipleLable = Array.from(new Set(this.multipleLable));
      const lable= [];
      this.multipleLable.forEach(item=>{
        lable.push(Common.changeString(item,'/undefined',''));
      });
      this.multipleLable=lable;

    },
    handleSelection(item,row){
      if(item.filter(i=>i===row).length>0){
        let newobj = {};
        this.multipleSelectionData.push(row);
        //不解 全选后取消全选，然后选择单个项，导致会有重复
        this.multipleSelectionData = this.multipleSelectionData.reduce((preVal, curVal) => {
          newobj[curVal[this.tableId]] ? '' : newobj[curVal[this.tableId]] = preVal.push(curVal); 
          return preVal; 
        }, []);
      }else{
        this.multipleSelectionData=item;
      }
      this.$nextTick(()=>{
        this.echoReturn();
      },25);
    },
    handleSelectionChange(rows) {
      this.multipleSelectionData = rows;
      this.$nextTick(()=>{
        this.echoReturn();
      },25);
    },
    //关闭
    onClose() {
      this.handleMessageToParent(false);
    },
    handleSizeChange(val) {
      this.query.pageSize=val;
      this.getList();
    },
    //分页
    handleCurrentChang (currentPage) {
      this.query.page=currentPage;
      this.getList();
    },
    handleClose(tag) {
      this.multipleSelection = this.multipleSelection.filter(item=> tag[this.tableId] !== item[this.tableId]);
      const row = this.tableData.find(item=> tag[this.tableId] === item[this.tableId]);
      if (row) {
        this.$refs.multipleTable.toggleRowSelection(row, false); //同时取消表格中对应行的勾选状态
      }
    },
  },
  components: {
    Header,
  },
};
</script>
<style scoped lang="less">
/deep/.el-table .cell{
  padding-right: 0;
}
.table-radio {
  .search{
    background: #fff;
    padding: 10px 24px 0 24px;
    .p-c-input {
      width: 400px;
      line-height: 32px;
      text-align: left;
      margin-bottom: 10px;
    }
  }
  .p-c-conter {
    font-size: 14px;
    padding: 0 24px 0 24px;
    max-height: 410px;
    overflow: auto;
    .p-c-input {
      width: 400px;
      line-height: 32px;
      text-align: left;
      margin-bottom: 10px;
    }
    .selected{
      span{
        color: #222;
      }
    }
    .selectable{
      margin-bottom: 40px;
    }
    .undata{
      margin-top: 90px;
      color: #606266;
      text-align: center;
      img{
        width: 159px;
        height: 149px;
        margin: 10px 0;
      }
    }
  }
  .p-c-button {
    border-top: 1px solid #F0F0F0;
    text-align: right;
    padding: 8px 20px 0 20px;
    .act {
      margin: 4px 0 0 10px;
    }
  }
}
</style>
