<!--
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2020-10-14 17:24:53
 * @FilePath: /bm-oa-components/src/components/header.vue
-->
<template>
  <div>
    <el-row>
      <el-col :span="24"><div class="grid-content header">
        <div class="title">{{title}}</div>
        <div class="close"><i class="iconfont iconguanbi" @click="close"></i></div></div></el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    OnClose: Function,
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit('OnClose');
    },
  },
};
</script>

<style scoped lang="less">
.header {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  display: flex;
  border-bottom: 1px solid #F0F0F0;
  .title {
    width: 80%;
    font-weight: 600;
    text-align: left;
    margin-left: 20px;
    color: #222222;
  }
  .close {
    width: 20%;
    text-align: right;
    margin-right: 20px;
    .iconfont {
      display: inline-block;
      width: 30px;
      height: 30px;
      font-size: 20px;
      color: #bbb;
      cursor: pointer;
    }
  }
}
</style>
