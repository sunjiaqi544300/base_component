<template>
  <div class="table-radio">
    <Header :title="title" @OnClose="onClose"></Header>
    <div class="search">
      <el-input class="p-c-input" placeholder="搜索" size="small" style="width: 350px;" v-model="query.queryContent" @keyup.enter.native="getList"><i slot="suffix" class="el-icon-search"></i></el-input>
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
        <span v-for="(item,index) in tableTitle" :key="'tag'+index">
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
          style="width: 100%"
          :row-key="getRowKeys"
          header-row-class-name="table-header"
          :border="true"
        >
          <el-table-column label="选择" width="55">
            <template scope="scope">
              <span style="padding-left:6px"></span><el-radio :label="true" v-model="scope.row.checkout" @change.native="radioChange((scope.row))">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item,index) in tableTitle"
            :key="index"
            class="{`${item}`}"
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
      <el-button class="act" size="small" @click="handleMessageToParent(false)">取消</el-button>
      <el-button
        class="act"
        size="small"
        type="primary"
        @click="handleMessageToParent(true)"
      >确认({{multipleSelection.length}}/{{1}})</el-button>
    </div>
  </div>
</template>
<script>
import API from '../api/api';
import Common from '../utils/common';
import Header from '../components/header';
import preventBack from 'vue-prevent-browser-back';//组件内单独引入

export default {
  mixins: [preventBack],//注入
  name: 'index',
  data() {
    return {
      iframeData: [],
      title: '',
      query:{
        queryContent:'',
        page:1,
        pageSize:10,
      },
      total:0,
      errTitle:'',
      tableRadio: [],  //已选
      search: '', //搜索名称、工号
      tableTitle: [], //表头
      tableData: [],  //表数据源
      multipleSelection: [], 
      multipleSelectionData: [],  //表选中
      currentPage: 1,
      code: '',
      isDBLink: false,
      myWindow: null,
      tableId:'',  //源id
      multipleValue:[],//id集合
      multipleLable:[],//显示结合
      propsData: {},
      isTable:false
    };
  },
  created() {
    this.code = this.$route.query.code;
  },
  mounted() {
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
  methods: {
    getRowKeys(row) {//记录每行的key值
      return row[this.tableId];//id 自己查看 row 里的数据 
    },  
    async init(){
      if(this.iframeData.length>0){
        let _data;
        if(this.isDBLink){
          _data = Object.assign({},this.propsData,{valList:this.iframeData},{page:1,pageSize:1});
        }else{
          _data = Object.assign({},this.propsData,{valList:this.iframeData.join(',')},{page:1,pageSize:1});

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
          this.tableData = (Common.changeKey(res.results.data,'.','__') || []);
          this.isTable = this.tableData.length>0?false:true;
          this.errTitle='暂无数据';
          this.tableTitle = res.results.tableTitle.length>0?Common.changeValue(res.results.tableTitle,'.','__') : [],
          this.tableId = Common.changeString(res.valueField,'.','__');
          this.$nextTick(()=>{
            this.echoReturn();
          },25);
        }
      });
    },
    //返回值回显字段
    echoReturn(){
      //利用深拷贝触发视图更新
      let tableDataDepClone = JSON.parse(JSON.stringify(this.tableData));
      tableDataDepClone.forEach((item,index)=>{
        tableDataDepClone[index].checkout=false;
      });
      for(let i=0;i<this.multipleSelectionData.length;i++){
        for(let j=0;j<tableDataDepClone.length;j++){
          if(this.multipleSelectionData[i][this.tableId]===tableDataDepClone[j][this.tableId]){
            tableDataDepClone[j].checkout = true;
          }else{
            tableDataDepClone[j].checkout = false;
          }
        }
      }
      this.multipleSelection = this.multipleSelectionData;
      this.tableData = tableDataDepClone;
    },
    getList(){
      API.PageAPI(Object.assign({},this.propsData,this.query), this.isDBLink).then(res=>{
        this.total= res.total;
        this.tableData= (Common.changeKey(res.results.data,'.','__') || []);
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
      // console.log('接收参数', _data);
      switch (_data.cmd) {
      case this.code:
        // 处理业务逻辑
        this.propsData = _data.params.props;
        this.iframeData = _data.params.data;
        this.isDBLink = _data.params.props.isDBLink || false;
        this.title = _data.params.title || '自定义-单选';
        this.maxLength = _data.params.maxLength || 1;

        this.init();
        break;
      }
      window.removeEventListener('message', this.handleMessageFromParent,false); 
    },
    //确认 取消 回传  e===true/false
    handleMessageToParent(e) {
      //回传的数据根据实际情况处理
      this.manageData();
      //data：数据源
      //value: 数据id集合
      //lab待定
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
    filterSearch(){
      if(this.search){
        this.tableData=[];
        this.tableData.filter(value => {
          !this.search || this.tableTitle.find(v=>{
            if(value[v.name]!=undefined){
              if(value[v.name].toLowerCase().includes(this.search.toLowerCase())){
                this.tableData.push(value);
              }
            }
          });
        });
        this.showTableDatas=this.showTableData;
      }else{
        this.tableData= this.tableData;
      }
    },
    manageData(){
      let _titleStr=[];
      this.tableTitle.map(itemChild=>{
        _titleStr.push(itemChild.name);
      });
      this.multipleSelection.map(item=>{
        this.multipleValue.push(item[this.tableId]);
        let _lable = '';
        _titleStr.map((i,index,arr)=>{
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
    //关闭
    onClose() {
      this.handleMessageToParent(false);
    },
    handleSizeChange(val) {
      this.query.pageSize=val;
      this.getList();
      this.$nextTick(()=>{
        this.echoReturn();
      },25);
    },
    //分页
    handleCurrentChang (currentPage) {
      this.query.page=currentPage;
      this.getList();
      console.log('111111');
      this.$nextTick(()=>{
        this.echoReturn();
      },25);
    },
    //切换radio
    radioChange(val) {
      this.multipleSelectionData=[val];
      console.log('233333',val);
      this.$nextTick(()=>{
        this.echoReturn();
      },25);
    },
    handleClose() {
      console.log('333333');
      this.tableRadio=[];
      this.multipleSelectionData=[];
      this.$nextTick(()=>{
        this.echoReturn();
      },25);
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
      margin-bottom: 20px;
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
    padding: 8px 10px 0 10px;
    .act {
      margin: 4px 10px 0 0;
    }
  }
}

</style>
