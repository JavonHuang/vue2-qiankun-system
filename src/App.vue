<template>
  <div id="system">
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'App',
  mounted () {
  }
}
</script>

<style lang="scss">
#system {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
}
[data-theme="gray"] #app{
  background: red;
}
</style>
