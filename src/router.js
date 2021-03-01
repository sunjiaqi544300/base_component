/*
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2021-01-08 11:27:57
 * @FilePath: /bm-oa-components/src/router.js
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let router = new Router({
  // base:  process.env.NODE_ENV === "development"? '/bpmcommoncomponents': "/bpmcommoncomponents",
  base: "/bpmcommoncomponents",
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'client-api',
      }
    },
    {
      path: '/client-api',
      name: 'client-api',
      meta: {
        title: 'client-api',
      },
      component: () => import("./views/client-api")
        
    },
    {
      path: '/peopleMultiple',
      name: 'peopleMultiple',
      meta: {
        title: '多选选人',
      },
      component: () =>
        import(/* webpackChunkName: "peopleMultiple" */ './views/peopleMultiple.vue'),
    },
    {
      path: '/tableRadio',
      name: 'tableRadio',
      meta: {
        title: '单选自定义',
      },
      component: () =>
        import(/* webpackChunkName: "tableRadio" */ './views/tableRadio.vue'),
    },
    {
      path: '/tableMultiple',
      name: 'tableMultiple',
      meta: {
        title: '多选自定义',
      },
      component: () =>
        import(/* webpackChunkName: "tableMultiple" */ './views/tableMultiple.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || 'title'
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
