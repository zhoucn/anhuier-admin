import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/setup',
    component: Layout,
    redirect: '/setup/time',
    name: 'Setup',
    meta: { title: '系统管理', icon: 'setup' },
    children: [
      {
        path: 'time',
        name: 'TimeSet',
        component: () => import('@/views/setup/time'),
        meta: { title: '时间配置' }
      },
      {
        path: 'profit',
        name: 'ProfitSet',
        component: () => import('@/views/setup/profit'),
        meta: { title: '收益配置' }
      },
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/setup/banner'),
        meta: { title: '广告位设置' }
      }
    ]
  },
  {
    path: '/profit',
    component: Layout,
    redirect: '/profit/order',
    name: 'Profit',
    meta: { title: '收益进账', icon: 'money' },
    children: [
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/profit/order'),
        meta: { title: '订单查询' }
      },
      {
        path: 'turnover',
        name: 'Turnover',
        component: () => import('@/views/profit/turnover'),
        meta: { title: '营业额查询' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    name: 'Agent',
    meta: { title: '代理管理', icon: 'agent' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/agent/index'),
        meta: { title: '代理管理' }
      },
      {
        path: 'apply',
        name: 'Apply',
        component: () => import('@/views/agent/apply'),
        meta: { title: '代理申请' }
      }
    ]
  },
  {
    path: '/driver',
    component: Layout,
    name: 'Driver',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/driver/index'),
        meta: { title: '司机管理', icon: 'driver' }
      }
    ]
  },
  {
    path: '/cash',
    component: Layout,
    name: 'Cash',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/cash/index'),
        meta: { title: '提现管理', icon: 'cash' }
      }
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    name: 'Equipment',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/equipment/index'),
        meta: { title: '机器管理', icon: 'equipment' }
      }
    ]
  },
  {
    path: '/cancel',
    component: Layout,
    name: 'Cancel',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/cancel/index'),
        meta: { title: '注销管理', icon: 'cancel' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
