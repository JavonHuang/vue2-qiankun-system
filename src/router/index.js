import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const getRouter = (mainRouterPath, _errorRouter) => {
  const errorRouter = _errorRouter || '404'
  const basePath = ''
  const routes = [
    {
      path: `${mainRouterPath}${basePath}/HelloWorld`,
      name: 'HelloWorld',
      component: resolve => require(['./../components/HelloWorld'], resolve)
    },
    {
      path: `${mainRouterPath}${basePath}/Home`,
      name: 'home',
      component: resolve => require(['./../components/Home'], resolve)
    },
    {
      path: `${mainRouterPath}${basePath}/404`,
      name: '404',
      component: resolve => require(['./../components/404'], resolve)
    },
    {
      path: `${mainRouterPath}${basePath}/*`,
      redirect: `${errorRouter}`
    }
  ]
  return new VueRouter({
    base: '/',
    routes
  })
}

export default getRouter
