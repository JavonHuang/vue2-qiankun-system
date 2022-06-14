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
  const router = getRouter(props.mainRouterPath ? props.mainRouterPath : '', props.errorRouter)
  // router.beforeEach((to, from, next) => {
  //   console.log(to, from, next)
  //   next()
  // })
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

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap () {
  console.log('[vue] vue app bootstraped')
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount (props) {
  const param = { system: true }
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log('system son监听', state, prev)
  })
  render(props)
  // 在子应用更新数据，同步到主应用
  props.setGlobalState(param)
  console.log('system son初始化获取', props.getGlobalState())
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount () {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
