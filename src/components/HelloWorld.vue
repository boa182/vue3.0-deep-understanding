<template>
  <div class="hello">
    
  </div>
</template>

<script>
import {effect,reactive} from '@vue/reactivity'
// 使用reactive 定义响应数据，接受对象作为参数，并返回一个代理对象
const obj = reactive({text: 'hello'})

// 使用effect 定义副作用，参数是副作用函数。
// 副作用函数内的响应式数据会与副作用函数之间建立联系，即所谓的依赖收集。响应式数据发生变化，副作用函数重新执行。
effect(() => {
  document.body.innerText = obj.text
})

// 一秒后修改响应式数据，触发副作用函数重新执行
setTimeout(() => {
  obj.text += 'world'
}, 1000)

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
