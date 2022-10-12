<template>
  <div class="hello">
   子应用首页HelloWorld
    <el-button v-on:click="gotoSubReact">默认按钮</el-button>
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
  // mounted () {
  //   console.log('ce', this.user)
  // },
  methods: {
    gotoSubReact () {
      this.$router.push('/portal/system/Home')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello{
  width: 100%;
}
img{
  width: 100%;
  // height: 1000px;
}
</style>
