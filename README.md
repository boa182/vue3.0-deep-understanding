```
yarn install
yarn serve
yarn build
```

### 1.effect() 和 reactive()
```
reactive()定义响应式数据，参数是对象，并且返回一个代理对象。
effect()定义数据发生变化产生的副作用，参数是副作用函数。
```
- vue3响应式数据绑定的原理？

**副作用函数内的响应式数据会与副作用函数之间建立联系，即所谓的依赖收集。响应式数据发生变化，副作用函数重新执行。** 

- effect()源码解析，做了什么？
```
effect(fn)返回一个runner函数，运行runner函数就是运行你传进去的fn。会默认执行一次runner，进行依赖收集。
effect的主要作用，就是在runner运行时，在底层设置全局变量的activeEffect为当前运行的effect。（为什么需要设置为当前运行的effect？因为track收集依赖时候需要获取当前运行的activeEffect才能绑定数据与effect的依赖关系）
```

- reactive()源码解析，做了什么？
```
react(obj)使用es6中的proxy对象代理,在读取对象属性get方法中，执行track()用来跟踪收集effect,在设置对象属性set方法中，执行trigger()来触发相应的effct。
```

- 自己写实现响应式数据在proxy2.html


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
- 11-1 watchEffect()与effect()的区别
```
effect() 函数来自于 @vue/reactivity ，而 watchEffect() 函数来自于 @vue/runtime-core。
effect() 是非常底层的实现，watchEffect() 是基于 effect() 的封装。
watchEffect() 会维护与组件实例以及组件状态(是否被卸载等)的关系，如果一个组件被卸载，那么 watchEffect() 也将被 stop
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

### 13 停止副作用stop()
```
effect() 函数会返回一个值，这个值其实就是 effect 本身，我们通常命名它为 runner。

把这个 runner 传递给 stop() 函数，就可以停止掉这个 effect。后续对数据的变更不会触发副作用函数的重新执行。
```

### 14 track与trigger() 依赖收集的核心
```
// track() 用来跟踪收集依赖(收集 effect)
// trigger() 用来触发响应(执行 effect)
const obj = { foo: 1 }
effect(() => {
  console.log(obj.foo)
  track(obj, TrackOpTypes.GET, 'foo')
})

obj.foo = 2
trigger(obj, TriggerOpTypes.SET, 'foo')
// 三个参数
target:要跟着的目标对象
跟着的操作类型
key:目标对象的key
```

### 15.ref 代理基本类型值

### 16. isRef()判断一个值是否是ref

### 17. toRef用来把一个响应式对象的某个key值转换成ref

### 18 toRefs 把一个响应式对象的所有key都转成ref
```
const obj = reactive({ foo: 1 })
// const obj2 = { foo: toRef(obj, 'foo') }
const obj2 = { ...toRefs(obj) } // 代替上面注释这句代码

effect(() => {
  console.log(obj2.foo.value)  // 由于 obj2.foo 现在是一个 ref，因此要访问 .value
})

obj.foo = 2 // 有效
```

### 19 自动脱ref ？
### 20 shallowRef()
```
它只代理 ref 对象本身，也就是说只有 .value 是被代理的，而 .value 所引用的对象并没有被代理：

const refObj = shallowRef({ foo: 1 })

refObj.value.foo = 3 // 无效
```

### vue3任务调度机制的源码分析
- 为什么需要任务调度机制？实现原理
```
在主线程执行同步任务过程中，可能会产很多render函数，马上执行会导致主线程阻塞。一般我们想的是，执行完
更改数据的同步代码后，再统一执行render。vue3巧妙地运用了微任务的执行机制，把主线程执行过程中产生的副作用，
通过promise.resolve.then()放到另外一个队列，主线程空闲之后再去执行，并且在下一个宏任务开启前执行完毕这个队列。
```
- 关键的三部操作
```
// 入队
function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}
     
function queueFlush() {
  // 开启微任务，尝试以微任务的形式清空任务队列
  if (!isFlushing && !isFlushPending) {
    // isFlushing已经清空完任务队列值为false，isFlushPending正在清空微任务值为false，才能继续创建微任务
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  // 循环执行queue队列里面的函数。
  isFlushPending = false;
  isFlushing = true;
  try {
      queue.forEach((job) => {
          job && job()
      })
  } finally {
    isFlushing = false;
    currentFlushPromise = null;
  }
}
```

学习资料：[https://zhuanlan.zhihu.com/p/146097763]