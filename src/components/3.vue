<script>
import {readonly, shallowReadonly} from '@vue/reactivity'
const obj = readonly({text: 'hello'})
obj.text += 'world'

const obj2 = shallowReadonly({foo:{bar: 2}})
obj2.foo = {bar: 3} // warn
obj2.foo.bar = 1 // ok
export default {
    
}
</script>