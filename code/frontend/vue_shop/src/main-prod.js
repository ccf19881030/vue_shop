import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标css文件
import './assets/fonts/iconfont.css'
// 引入axios库，用于通信
import axios from 'axios'

// 引入vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles 导入富文本编辑器的样式文件
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 当如nprogress 包对应的js和css 用于加载进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 给请求头添加Authorization
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 每一个this组件都可以通过this.$http来发起请求
Vue.prototype.$http = axios
Vue.component('tree-table', ZkTable)
// 注册富文本编辑器
Vue.use(VueQuillEditor)
/**
 * 阻止启动生产消息
 * 开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。
 * 而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。
 * 此外，有些警告检查还有一些小的运行时开销，这在生产环境模式下
 * 是可以避免的。(摘于官网说明) 大概意思应该就是，消息提示的环境配置，
 * 设置为开发环境或者生产环境
 */
Vue.config.productionTip = false

// 时间格式过滤器
Vue.filter('dateFormat', function (originVal) {
  // 获取时间对象
  const dt = new Date(originVal)

  // 年
  const y = dt.getFullYear()
  // 月 getMonth返回的是从0 开始的，所以需要加1；如果不是两位，在前面补0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 日
  const d = (dt.getDate() + '').padStart(2, '0')
  // 时
  const hh = (dt.getHours() + '').padStart(2, '0')
  // 分
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  // 时
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 'yyyy-mm-dd hh:mm:ss'
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
