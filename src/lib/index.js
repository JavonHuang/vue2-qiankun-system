import my from './my.vue'
  
 if (typeof window !== 'undefined' && window.Vue) {
     window.Vue.component('my', my)
 }
 //为组件添加 install 方法
 my.install = function(Vue){
     Vue.component(my.name, my)
 }
 export default my