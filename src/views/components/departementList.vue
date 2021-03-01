<!--
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-19 18:39:11
 * @LastEditTime: 2021-01-12 14:36:35
 * @FilePath: /bm-oa-components/src/views/components/departementList.vue
-->
<template>
  <div>
    <div class="tree-first-class">
      <div>
        <span class="iconfont iconbumenxiaji tree-icon"></span>
        <span class="tree-second-title" @click="searchObjectTree"
          >按照组织架构选择</span
        >
      </div>
      <div class="default-object" v-if="defaultDepartment.name" @click="handleToDepartment()">
        <span class="iconfont iconxiaji7"></span>
        <div class="default-title-box">
          <p class="default-title">
            <span class="title-esplise" >
              {{ defaultDepartment.name }}
            </span>
          </p>
        </div>
        <el-link
          v-if="defaultDepartment.name.length > 40"
          class="default-title-more"
          type="primary"
          @click="handleMore($event)"
          >展开</el-link
        >
      </div>
    </div>
    <!-- <div class="tree-first-class">
      <span class="iconfont iconjiaose tree-icon"></span>
      <span class="tree-second-title" @click="searchObjectTree"
        >按照角色选择</span
      >
    </div>
    <div class="tree-first-class">
      <span class="iconfont iconleixing1 tree-icon"></span>
      <span class="tree-second-title" @click="searchObjectTree"
        >按照员工类型选择</span
      >
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  computed:{
    ...mapState(['actList','config', 'defaultDepartment'])
  },
  methods: {
    searchObjectTree() {
      this.$emit('searchObjectTree');
    },
    // 当前所在部门文案过多-点击展开后样式切换
    handleMore(event) {
      let defaultTitle = event.path[2].childNodes[1].childNodes[0];
      event.target.style = 'display:none;';
      defaultTitle.style =
        'color: #919191;font-size: 14px;max-width: 280px;display: inline-block;';
    },
    handleToDepartment(){
      if(+this.config.functionType === 1){
        this.$emit('handleToDepartment');
      }
      
    }
  },
};
</script>

<style lang="scss" scoped>
.tree-first-class {
  margin-top: 30px;
  vertical-align: middle;
  .tree-second-title {
    cursor: pointer;
    font-size: 14px;
    color: #222222;
    margin-left: 8px;
    vertical-align: middle;
  }
  .tree-icon {
    vertical-align: middle;
    font-size: 14px;
    color: rgb(42, 142, 255);
  }
  .iconjiaose {
    color: #67c23a;
    font-size: 14px;
    vertical-align: middle;
  }
  .iconleixing1 {
    color: red;
    font-size: 14px;
    vertical-align: middle;
  }
  .default-object {
    cursor: pointer;
    margin-left: 22px;
    margin-top: 10px;
    .iconxiaji7 {
      font-size: 12px;
    }
    .default-title-box {
      display: inline-block;
      vertical-align: text-top;
    }
    .default-title {
      color: #919191;
      font-size: 14px;
      max-width: 280px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .default-title-more {
      vertical-align: bottom;
      font-size: 14px;
    }
  }
}
</style>