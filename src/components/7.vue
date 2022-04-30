<script>
import {markRaw} from '@vue/reactivity'
const obj = {foo: 1}
markRaw(obj)
console.log(obj)
export default {
    
}
</script>