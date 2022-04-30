<script>
import {isProxy, reactive, readonly, shallowReactive,shallowReadonly} from '@vue/reactivity';
console.log(isProxy(reactive({})))
console.log(isProxy(readonly({})))
console.log(isProxy(shallowReactive({})))
console.log(isProxy(shallowReadonly({})))

const shallowReactiveProxy = shallowReactive({ foo: {} })
console.log(isProxy(shallowReactiveProxy))  // true
console.log(isProxy(shallowReactiveProxy.foo))  // false

const shallowReadonlyProxy = shallowReadonly({ foo: {} })
console.log(isProxy(shallowReadonlyProxy))  // true
console.log(isProxy(shallowReadonlyProxy.foo))  // false
export default {
    
}
</script>