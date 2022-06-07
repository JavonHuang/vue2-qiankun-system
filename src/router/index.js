import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const getRouter = (mainRouterPath) => {
  const basePath = '/portal'
  const routes = [
    // {
    //   path: `${mainRouterPath}${basePath}/Home`,
    //   name: `${mainRouterPath}_center`,
    //   component: resolve => require(['./../components/Home'], resolve)
    // },
    {
      path: `${mainRouterPath}${basePath}/Home`,
      name: 'HelloWorld',
      component: resolve => require(['./../components/HelloWorld'], resolve)
    }
  ]
  return new VueRouter({
    base: '/',
    routes
  })
}

export default getRouter
