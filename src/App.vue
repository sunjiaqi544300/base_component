<!--
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2020-12-23 12:10:28
 * @FilePath: /bm-oa-components/src/App.vue
-->
<template>
  <div id="ifreamApp">
    <router-view />
  </div>
</template>

<script>
import {parseUrl} from './views/entry';
export default {
  data() {
    return {
      dataURl: {}, //解析url参数
    };
  },
  created() {
    // console.log('functionTypeArr','functionTypeArr');
    parseUrl(this);
  },
  mounted() {
  },
  methods: { 
  },
};
</script>

<style lang="less">
#ifreamApp{
  /*font-family: -apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;*/
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing:grayscale;


  font-family: "Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","HeitiSC","WenQuanYi Micro Hei",sans-serif;

}
</style>
