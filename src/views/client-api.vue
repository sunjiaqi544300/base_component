<template>
  <div class="home">
    <div class="aside">
      <div class="title">hwl.oa.commonsdk说明</div>
      <div class="menu">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>sdk对应功能api</span>
            </template>
            <template v-for="item in menuList">
              <el-menu-item
                @click="goRegister(item.classname)"
                :key="item.classname"
              >
                {{ item.name }}
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="main">
      <div class="CustomizeTable">
        <h2>#自定义列表</h2>
        <h3>##使用方式</h3>
        <h4>第一步：</h4>
        <div class="language-javascript">
          npm install hwl.oa.commonsdk -save
        </div>
        <h4>第二步：</h4>
        <div class="language-javascript">
          import sdk from "hwl.oa.commonsdk/lib/common-SDK"
        </div>
        <h4>第三步：</h4>
        <div class="language-javascript">
          sdk.CustomizeTable.init(data)
          <br />
          参数data:Object
        </div>
        <div class="language-javascript">
          <pre>
    ## 例如：
    sdk.CustomizeTable.init({
        url: "http://test.oan.zhiyinlou.com/components",
        code: "bpm",
        // title: "自定义多选",
        //组件类 型选人1；选部门2，选主题3，自定义组件4
        functionType: 4,
        // 单选false，多选true，默认true
        // multiple: false,
        //最大数 
        // multiple为false时 非必填 
        // multiple为true时 必填
        maxLength: 1000,
        //参数
        data: ["1","2","3"],
        //请求参数
        props: {
          dataSource:100,
          params:[]
        },
        //成功回调
        onSuccess: function(result) {
          console.log(result);
        },
        //取消回调
        onError: function(err) {
          console.log(err);
        }
      });
          </pre>
        </div>

        <el-table
          tooltip-effect="dark"
          :header-cell-style="{
            background: '#F5F6F7',
            fontWeight: 500,
            color: '#222',
          }"
          header-row-class-name="table-header"
          height="660px"
          :border="true"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="prams" label="参数" width="180">
          </el-table-column>
          <el-table-column prop="title" label="说明" width="180">
          </el-table-column>
          <el-table-column prop="type" label="类型"> </el-table-column>
          <el-table-column prop="must" label="是否必传"> </el-table-column>
          <el-table-column prop="value" label="可选值"> </el-table-column>
        </el-table>
      </div>
      <div class="A2">
        <h4>选人员</h4>
        <el-table
          tooltip-effect="dark"
          :header-cell-style="{
            background: '#F5F6F7',
            fontWeight: 500,
            color: '#222',
          }"
          header-row-class-name="table-header"
          :border="true"
          :data="peopleData"
          style="width: 100%"
        >
          <el-table-column prop="prams" label="参数" width="180">
          </el-table-column>
          <el-table-column prop="title" label="说明" width="180">
          </el-table-column>
          <el-table-column prop="type" label="类型"> </el-table-column>
          <el-table-column prop="must" label="是否必传"> </el-table-column>
          <el-table-column prop="defaultValue" label="默认值"> </el-table-column>
          <el-table-column prop="value" label="可选值"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        { name: '自定义列表', classname: 'CustomizeTable' },
        { name: '选人员', classname: 'A2' },
        { name: '选主体', classname: 'a3' },
        { name: '选部门', classname: 'A4' },
      ],
      tableData: [
        {
          prams: 'url',
          title:
            '组件服务的地址例如：http://test.oan.zhiyinlou.com/bpmcommoncomponents',
          must: 'true',
          type: 'string',
          value: 'http://test.oan.zhiyinlou.com/bpmcommoncomponents',
        },
        {
          prams: 'code',
          title: '项目标识,',
          must: 'true',
          type: 'string',
          value: 'bpm',
        },
        {
          prams: 'title',
          title: '标题',
          must: 'false',
          type: 'string',
          value: '例如：自定义列表多选',
        },
        {
          prams: 'functionType',
          title: '组件类 型选人1；选部门2，选主题3，自定义组件4',
          must: 'true',
          type: 'number',
          value: '例如，1',
        },
        {
          prams: 'multiple',
          title: '组件单选false，多选true，默认true',
          must: 'false',
          type: 'boolean',
          value: '例如，true',
        },
        {
          prams: 'maxLength',
          title: '最大数  非必填',
          must: 'false',
          type: 'number',
          value: '例如，1000',
        },
        {
          prams: 'data',
          title: '回显的参数',
          must: 'true',
          type: 'Array',
          value: '例如[{t1__code: \'v_zhangqinglei\',t1__id: \'1\'}]',
        },
        {
          prams: 'props',
          title: '请求参数',
          must: 'true',
          type: 'object',
          value: '例如{dataSource:100,params:[]}',
        },
        {
          prams: 'onSuccess',
          title: '成功回调',
          must: 'true',
          type: 'Function',
          value: '例如:function(result){console.log(result)}',
        },
        {
          prams: 'onError',
          title: '取消回调  参数校验与异常',
          must: 'true',
          type: 'Function',
          value: '例如:function(err){console.log(err)}',
        },
      ],
      peopleData: [
        {
          prams: 'code',
          title: '项目标识,',
          must: 'true',
          type: 'string',
          value: 'bpm',
          defaultValue: 'bpm'
        },
        {
          prams: 'title',
          title: '标题',
          must: 'false',
          type: 'string',
          value: '例如：自定义列表多选',
          defaultValue: 'functionType为1: 选择人员 2: 选择部门 3:选择主体'
        },
        {
          prams: 'functionType',
          title: '组件类 型选人1；选部门2，选主题3，自定义组件4',
          must: 'true',
          type: 'number',
          value: '例如，1',
          defaultValue: '1'
        },
        {
          prams: 'multiple',
          title: '组件单选false，多选true，默认true',
          must: 'false',
          type: 'boolean',
          value: '例如，true',
          defaultValue: 'true'
        },
        {
          prams: 'maxLength',
          title: '最大数  非必填',
          must: 'false',
          type: 'number',
          value: '例如，1000',
          defaultValue: 100,
        },
        {
          prams: 'defaultData',
          title: '回显的参数',
          must: 'true',
          type: 'Array',
          value: '例如:人员[{name: \'v_zhangqinglei\',id: \'1\'}]',
          defaultValue: '[]'
        },
        {
          prams: 'defaultDepartment',
          title: '用于获取当前用户的所在部门',
          must: 'true',
          type: 'Array',
          value: '例如:人员[{name: \'v_zhangqinglei\',id: \'1\'}]',
          defaultValue: '[]'
        },
        {
          prams: 'justLastCheck',
          title: '是否仅末级可选',
          must: 'false',
          type: 'Boolean',
          value: 'true/false',
          defaultValue: 'true'
        },
        {
          prams: 'onSuccess',
          title: '成功回调',
          must: 'true',
          type: 'Function',
          value: '例如:function(result){console.log(result)}',
          defaultValue: ''
        },
        {
          prams: 'onError',
          title: '取消回调  参数校验与异常',
          must: 'true',
          type: 'Function',
          value: '例如:function(err){console.log(err)}',
          defaultValue: ''
        }
      ],
    };
  },
  created() {

  },
  mounted() {},
  methods: {
    goRegister(classname) {
      this.$nextTick(() => {
        this.$el.querySelector('.' + classname).scrollIntoView();
      });
    },
  },
};
</script>

<style scoped lang="less">
a {
  text-decoration: none;
  color: #333;
}
.home {
  display: flex;
  width: 100%;
  min-height: 100%;
  height: 100%;
  font-size: 14px;
  .aside {
    flex: 0 0 200px;
    height: 100%;
    text-align: center;
    .title {
      width: 200px;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      font-size: 16px;
      font-weight: bold;
      border-right: 1px solid #efefef;
    }
    .menu {
      background-color: #fff;
      border-right: 1px solid #efefef;
      width: 200px;
      position: absolute;
      top: 40px;
      bottom: 0px;
      left: 0px;
    }
  }
  .main {
    flex: 1;
    height: 100%;
    background: #fff;
    color: #000;
    padding: 15px;
    h1,
    h2,
    h3,
    h4,
    h5 {
      font-weight: 600;
      line-height: 2;
    }
    .language-javascript {
      padding: 20px;
      background-color: #282c34;
      border-radius: 6px;
      font-size: 14px;
      color: #fff;
      margin-bottom: 15px;
    }
  }
}
</style>