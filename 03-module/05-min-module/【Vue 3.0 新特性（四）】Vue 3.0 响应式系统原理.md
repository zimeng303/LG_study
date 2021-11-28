# Vue 3.0 响应式系统原理

## 基础回顾

### Vue.js 响应式回顾

* Proxy 对象实现属性监听
* 多层属性嵌套，在访问属性过程中处理下一级属性
* 默认监听动态添加的属性
* 默认监听属性的删除操作
* 默认监听数组索引和 length 属性
* 可以作为单独的模块使用

###  Proxy 对象回顾

```js
'use strict'
// 问题1： set 和 deleteProperty 中需要返回布尔类型的值
//        在严格模式下，如果返回 false 的话会出现 Type Error 的异常
const target = {
    foo: 'xxx',
    bar: 'yyy'
}
// Reflect.getPrototypeOf()
// Object.getPrototypeOf()
/**
     * @param { Object } target 目标对象
     * @param { Object } {} 处理器 / 监听器，处理函数
    */
const proxy = new Proxy(target, {
    get (target, key, receiver) {
        // return target[key]
        return Reflect.get(target, key, receiver)
    },
    set (target, key, value, receiver) {
        // target[key] = value
        return Reflect.set(target, key, value, receiver)
    },
    deleteProperty (target, key) {
        // delete target[key]
        return Reflect.deleteProperty(target, key)
    }
})

proxy.foo = 'zzz'
// delete proxy.foo
```

```js

// 问题2：Proxy 和 Reflect 中使用的 receiver

// Proxy 中 receiver：Proxy 或者继承 Proxy 的对象
// Reflect 中 receiver：如果 target 对象中设置了 getter，getter 中的 this 指向 receiver

const obj = {
    get foo() {
        console.log(this)
        return this.bar
    }
}

const proxy = new Proxy(obj, {
    get (target, key, receiver) {
        if (key === 'bar') { 
            return 'value - bar' 
        }
        return Reflect.get(target, key, receiver)
    }
})
console.log(proxy.foo)
```

## reactive 

* reactive 返回的对象，重新赋值丢失响应式
* reactive 返回的对象不可以解构

**基础实现**

* 接收一个参数，判断参数是否是对象

* 创建拦截器对象 `handler`，设置 `get / set / deleteProperty`

* 返回 `Proxy` 对象

  ```js
  // 判断 target 是否是对象
  const isObject = val => val !== null && typeof val === 'object'
  // 当返回的数据还是对象时，需要递归调用，收集依赖
  const convert = target => isObject(target) ? reactive(target) : target
  
  // 判断某个对象本身是否有指定的属性
  const hasOwnProperty = Object.prototype.hasOwnProperty
  const hasOwn = (target, key) = hasOwnProperty(target, key)
  
  export function  reactive (target) {
      if (!isObject(target)) return target
  
      const handler = {
          get (target, key, receiver) {
              // 收集依赖
              track(target, key)
              const result = Reflect.get(target, key, receiver)
              return convert(result)
          },
          set (target, key, value, receiver) {
              const oldValue = Reflect.get(target, key, receiver)
              let result = true
              if (oldValue !== value) {
                  result = Reflect.set(target, key, value, receiver)
                  // 触发更新
                  trigger(target, key)
              }
              return result
          },
          deleteProperty (target, key) {
              const hasKey = hasOwn(target, key)
              const result = Reflect.defineProperty(target, key)
              if (hasKey && result) {
                  // 触发更新
                  trigger(target, key)
              }
              return result
          }
      }
  
      return new Proxy(target, handler)
  }
  ```

**收集依赖**

* 功能结构，如图所示：

  ![image-20210207160449758](F:\LaGou\03-module\05-min-module\assets\收集依赖.png)

* 代码实现，如下所示：

  ```js
  // 收集依赖
  let activeEffect = null
  export function effect (callback) {
      activeEffect = callback
      callback() // 访问响应式对象属性，去收集依赖
      activeEffect = null
  }
  
  let targetMap = new WeakMap()
  export function track (target, key) {
      if (!activeEffect) return
      let depsMap = targetMap.get(target)
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()))
      }
      let dep = depsMap.get(key)
      if (!dep) {
          depsMap.set(key, (dep = new Set()))
      }
      dep.add(activeEffect)
  }   
  ```

**触发更新**

* 具体代码实现，如下所示：

  ```js
  // 触发更新
  export function trigger (target, key) {
      const depsMap = targetMap.get(target)
      if (!depsMap) return
      const dep = depsMap.get(key)
      if (dep) {
          dep.forEach(effect => {
              effect()
          })
      }
  }
  ```

## ref

* ref 可以把基本数据类型数据，转成响应式对象

* ref 返回的对象，重新赋值成对象也是响应式的

  ```js
  export function ref(raw) {
      // 判断 raw 是否是 ref 创建的对象，如果是的话，直接返回
      if (isObject(raw) && raw.__v_isRef) return
      let value = convert(raw)
      const r = {
          __v_isRef: true,
          get value() {
              track(r, 'value')
              return value
          },
          set value(newValue) {
              if (newValue !== value) {
                  raw = newValue
                  value = convert(raw)
                  trigger(r, 'value')
              }
          }
      }
      return r
  }
  ```

## toRefs 

* 接收一个 reactive 返回的响应式对象，即一个 Proxy 对象

* 把传入对象的属性转化为类似于 ref 返回的对象

* 把转换后的属性，挂载到一个新的对象上，进行返回

  ```js
  // 接收一个 reactive 返回的响应式对象，即一个 Proxy 对象
  export function toRefs (proxy) {
      const ret = proxy instanceof Array ? new Array(proxy.length) : {}
  	// 把转换后的属性，挂载到一个新的对象上，进行返回
      for (const key in proxy) {
          ret[key] = toProxyRef(proxy, key)
      }
      return ret
  }
  // 把传入对象的属性转化为类似于 ref 返回的对象
  function toProxyRef (proxy, key) {
      const r = {
          __v_isRef: true,
          get value () {
              return proxy[key]
          },
          set value (newValue) {
              proxy[key] = newValue
          }
      }
      return r
  }
  ```

## computed

* 监听内部响应式数据的变化

  ```js
  export function computed(getter) {
      const result = ref()
  
      effect(() => {
          result.value = getter()
      })
      return result
  }
  ```

