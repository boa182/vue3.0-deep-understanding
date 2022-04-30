```
yarn install
yarn serve
yarn build
```

### 1.effect() 和 reactive()
```
effect()定义副作用，参数是副作用函数
reactive()定义响应式数据，参数是对象，并且返回一个代理对象
副作用函数内的响应式数据会与副作用函数之间建立联系，即所谓的依赖收集。响应式数据发生变化，副作用函数重新执行。
```

### 2 shallowReactive()
```
定义浅层响应式数据。
 obj.foo.bar = 2 // 无效
 obj.foo = {bar: 2} // 有效
```

### 3 readonly() 和 shallwoReadonly()
```
readonly 定义数据为只读
shallwoReadonly定义数据浅层次为只读，深层次的可以被修改
obj2.foo = {bar: 3} // warn
obj2.foo.bar = 1 // ok
```

### 4 isReactive()判断数据对象是否是响应式reactive

### 5 isReadonly()判断数据数据是否是readonly

### 6 isProxy() 判断对象是否是代理对象 （reactive或readonly)
```
const shallowReactiveProxy = shallowReactive({ foo: {} })
console.log(isProxy(shallowReactiveProxy))  // true
console.log(isProxy(shallowReactiveProxy.foo))  // false

const shallowReadonlyProxy = shallowReadonly({ foo: {} })
console.log(isProxy(shallowReadonlyProxy))  // true
console.log(isProxy(shallowReadonlyProxy.foo))  // false
```

### 7.markRaw() 用于让函数不可被代理
```
原理：就是让vue3的vNode对象带有__v_skip：true标识，从而跳过代理（非VNode也带有）。
markRaw(obj) // { foo: 1, __v_skip: true }
```

### 8.toRaw() 接受代理对象为参数，获取原始对象
```
const obj = {}
const reactiveProxv = reactive(obj)
console.log(toRaw(reactiveProxy) === obj) // true

// 如果参数是非代理对象，则直接返回该值
onsole.log(toRaw(1) === 1) // true
```

### 9 ReactiveFlags是一个枚举值
```
export const enum ReactiveFlags {
  skip = '__v_skip', // 定义不可被代理
  isReactive = '__v_isReactive', // 判断代理对象是reactive还是
  isReadonly = '__v_isReadonly',
  raw = '__v_raw',  // 引用原始对象
  reactive = '__v_reactive', // 引用代理对象
  readonly = '__v_readonly' // 引用代理对象
}
```

### 10 调度执行effect-scheduler
- 10-1 是什么？
用来指定如何运行副作用函数
- 10-2 为什么要用？
```
const obj = reactive({ count: 1 })
effect(() => {
  console.log(obj.count)
})

obj.count++
obj.count++
obj.count++
// 副作用一共会执行4次，但我们想最终的状态才应用到副作用中，提升性能。

// 为effect传递第二个参数作为选项
const obj = reactive({ count: 1 })
effect(() => {
  console.log(obj.count)
}, {
  // 指定调度器为 queueJob
  scheduler: queueJob
})

// 调度器实现
const queue: Function[] = [] // 先定义一个数组存放执行的方法
let isFlushing = false
function queueJob(job: () => void) {
  if (!queue.includes(job)) queue.push(job) // 将数组中重复的方法去重
  if (!isFlushing) { // 判断是否正在清空任务队列
    isFlushing = true
    Promise.resolve().then(() => { // 使用promist.resolve.then将其循环执行
      let fn
      while(fn = queue.shift()) { // 每次执行完一个宏任务就会执行微任务直至全部完成才会进行下一个宏任务
        fn()
      }
    })
  }
}

obj.count++
obj.count++
obj.count++
```

### 11 watchEffect() 效果与10是一样的
```
watchEffect() 函数并不在 @vue/reactivity 中提供，而是在 @vue/runtime-core 中提供，与 watch() 函数一起对外暴露。
```

### 12 异步副作用和invalidate(废止)
- 12-1
异步副作用是很常见的，例如请求 API 接口，当 obj.foo 变化后，意味着将会再次发送请求，那么之前的请求怎么办呢？
```
// 副作用函数接收一个函数作为参数
watchEffect(async (onInvalidate) => {
    const data = await fetch(obj.foo)
})
// 可以调用它来注册一个回调函数，这个回调函数会在副作用无效时执行
// 不抛弃无效的副作用，那么就会产生竟态问题
```
- 12-1 什么时候需要invalidate
```
在组件中定义的 effect，需要在组件卸载时将其 invalidate
在数据变化导致 effect 重新执行时，需要 invalidate 掉上一次的 effect 执行
用户手动 stop 一个 effect 时
```
学习资料：[https://zhuanlan.zhihu.com/p/146097763]