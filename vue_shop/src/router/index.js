import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../components/Login.vue'
const login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login.vue')
// import home from '../components/Home.vue'
const home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home.vue')
// import welcome from '../components/Welcome.vue'
const welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome.vue')

// import user from '../components/user/Users.vue'
const user = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/user/Users.vue')
// import rights from '../components/power/Rights.vue'
const rights = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/power/Rights.vue')
// import roles from '../components/power/Roles.vue'
const roles = () => import(/* webpackChunkName: "user-rights-roles" */ '../components/power/Roles.vue')

// import cate from '../components/goods/Cate.vue'
const cate = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Cate.vue')
// import params from '../components/goods/Params.vue'
const params = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Params.vue')

// import goods from '../components/goods/List.vue'
const goods = () => import(/* webpackChunkName: "goods-add" */ '../components/goods/List.vue')
// import add from '../components/goods/Add.vue'
const add = () => import(/* webpackChunkName: "goods-add" */ '../components/goods/Add.vue')

// import order from '../components/order/Order.vue'
const order = () => import(/* webpackChunkName: "order-report" */ '../components/order/Order.vue')
// 导入报表组件
// import report from '../components/report/Report.vue'
const report = () => import(/* webpackChunkName: "order-report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: user },
      { path: '/rights', component: rights },
      { path: '/reports', component: report },
      { path: '/roles', component: roles },
      { path: '/categories', component: cate },
      { path: '/params', component: params },
      { path: '/goods', component: goods },
      { path: '/goods/add', component: add },
      { path: '/orders', component: order }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个页面跳转而来
  // next 是一个函数， 表示方形
  //      next() 放行 next('/') 强制跳转
  // 首页直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // token不为空，放行
  if (!tokenStr) return next('/login')
  next()
})

export default router
