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

### 2 shallowReactive ()
```
定义浅层响应式数据。详情在shallowReactive.vue
```
