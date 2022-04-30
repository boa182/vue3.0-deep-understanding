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


