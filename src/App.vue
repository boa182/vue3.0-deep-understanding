<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <effectReactive/>
  <shallowReactive/>
  <readonly/>
  <isProxy/>
</template>

<script>
import effectReactive from './components/effect-reactive.vue'
import shallowReactive from './components/shallowReactive.vue'
import readonly from './components/3.vue'
import isProxy from './components/6.vue'
export default {
  name: 'App',
  components: {
    effectReactive, shallowReactive, readonly,isProxy
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
