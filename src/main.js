/* eslint-disable no-undef */
/* eslint-disable camelcase */
import Vue from 'vue'
import App from './App.vue'
import getRouter from './router/index'

Vue.config.productionTip = false

let router = null
let instance = null

function render (props = {}) {
  const { container } = props
  const router = getRouter(props.mainRouterPath ? props.mainRouterPath : '')
  router.beforeEach((to, from, next) => {
    console.log(to, from, next)
    next()
  })
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// webpack打包公共文件路径
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

// 生命周期
export async function bootstrap () {
  console.log('[vue] vue app bootstraped')
}
export async function mount (props) {
  // props.onGlobalStateChange((state, prev) => {
  //   // state: 变更后的状态; prev 变更前的状态
  //   console.log('vue子应用监听父应用', state, prev)
  // })
  // props.getGlobalState((e) => {
  //   console.log('vue子应用初始化获取', e)
  // })
  // setTimeout(() => {
  //   props.setMainVuex('portalModule/cm_fullscreen', true)
  //   console.log('重置')
  // }, 2000)
  render(props)
}
export async function unmount () {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
