<template>
  <div class="hello">
   子应用首页HelloWorld
    <el-button v-on:click="gotoSubReact">默认按钮</el-button>
    <div id="test"></div>
  </div>
</template>

<script>
export default {
  // computed: {
  //   // 通过global获取user的信息
  //   ...mapState('global', {
  //     user: state => state.user
  //   })
  // },
  mounted () {
    setTimeout(() => {
      window.UE.getEditor('test', {
        autoHeight: false
      })
    }, 500)
  },
  methods: {
    gotoSubReact () {
      window.rootRouter.push({ path: '/portal/personal/home', query: { name: '黄玉超', age: '290' } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello{
  width: 100%;
  padding: 10px;
}
img{
  width: 100%;
  // height: 1000px;
}
</style>
