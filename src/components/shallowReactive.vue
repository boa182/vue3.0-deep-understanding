<script>
export default {}
import {effect, shallowReactive} from '@vue/reactivity'
// 使用shallowReactive()定义浅响应式数据
const obj = shallowReactive({foo:{bar: 1}})
 effect(() => {
     console.log(obj.foo.bar)
 })
//  obj.foo.bar = 2 // 无效
 obj.foo = {bar: 2} // 有效
</script>