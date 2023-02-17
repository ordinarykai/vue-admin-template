import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const dynamicRoutes = [
  {
    path: '/content',
    component: Layout,
    redirect: '/content',
    name: '媒资管理',
    meta: { title: '媒资管理', icon: 'meizi' },
    children: [
      {
        path: 'work-order',
        name: '工单管理',
        component: () => import('@/views/content/work-order/index'),
        meta: { title: '工单管理', icon: 'gondan' }
      },
      {
        path: 'channel',
        name: '频道管理',
        component: () => import('@/views/content/channel/index'),
        meta: { title: '频道管理', icon: 'pindao' }
      },
      {
        path: 'schedule',
        name: '节目单管理',
        component: () => import('@/views/content/schedule/index'),
        meta: { title: '节目单管理', icon: 'jiemudan' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'xitong' },
    children: [
      {
        path: 'admin',
        name: '用户管理',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'yonghu' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'juese' }
      },
      {
        path: 'permission',
        name: '菜单管理',
        component: () => import('@/views/system/permission/index'),
        meta: { title: '菜单管理', icon: 'caidan' }
      },
      {
        path: 'log',
        name: '日志管理',
        component: () => import('@/views/system/log/index'),
        meta: { title: '日志管理', icon: 'rizhi' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
