@[TOC](Composition API)

# 基本介绍

## 学习网址

* RFC(Request For Comments)
  * [https://github.com/vuejs/rfcs](https://github.com/vuejs/rfcs)
* Composttion API RFC
  * [https://composition-api.vuejs.org](https://composition-api.vuejs.org)

## 设计动机

* Options API

  * 包含一个描述组件选项(data、methods、props等)的对象

  * Options API 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项

  * `Options API Demo`

    ![image-20210204155651286](F:\LaGou\03-module\05-min-module\assets\image-3.png)

* Composition API

  * Vue.js 3.0 新增的一组 API

  * 一组基于函数的 API

  * 可以更灵活的组织组件的逻辑

  * `Composition API Demo`

    ![image-20210204155900914](F:\LaGou\03-module\05-min-module\assets\image-4.png)

  * 官方比较，如图所示：

    ![image-20210204160053492](F:\LaGou\03-module\05-min-module\assets\image-5.png)

# Basic API

## createApp

* 返回提供应用程序上下文的应用程序实例。应用程序实例挂载的整个组件树共享相同的上下文。

  ```js
  const app = Vue.createApp({})
  ```

  可以在 `createApp` 之后链接其他方法，它们可以在 [Application API](https://v3.vuejs.org/api/application-api.html) 中找到

**Arguments（参数）**

* 该函数接收 **根组件** 选项对象作为第一个参数：

  ```js
  const app = Vue.createApp({
      data() {
          return {
              ...
          }
  	},
  	methods: {...},
  	computed: {...}
  	...
  })
  ```

* 使用第二个参数，我们可以将 `root props` 传递给应用程序：

  ```js
  const app = Vue.createApp(
    {
      props: ['username']
    },
    { username: 'Evan' }
  )
  ```

  ```html
  <div id="app">
      <!-- Will display 'Evan' -->
      {{ username }}
  </div>
  ```

**Typing**

* createApp 源码，示例如下：

  ```tsx
  interface Data {
      [key: string]: unknown
  }
  
  export type CreateAppFunction<HostElement> = (
      rootComponent: PublicAPIComponent,
      rootProps?: Data | null
  ) => App<HostElement>
  ```

## setup

**Arguments（参数）**

使用该 `setup` 函数时，它将带有两个参数：

* 1，`props`
* 2，`context`

**Props**

* 函数  `setup`  中的第一个参数是`props`参数。函数 `setup` 内部 `props` 是响应式的，并在传入新的 `props` 时进行更新。

  ```js
  export default {
      props: {
          title: String
      },
      setup(props) {
          console.log(props.title)
      }
  }
  ```

> 警告：
>
> 但是，由于`props`是响应式的，您 **不能使用ES6解构，**因为它会删除 `props` 的响应式。

**context**

* 函数 `setup` 的第二个参数是 `context`。`context` 是一个标准的 JavaScript 对象，它向外导出了三个组件属性：

  ```js
  export default {
      setup(props, context) {
          // Attributes (Non-reactive object)
          console.log(context.attrs)
  
          // Slots (Non-reactive object)
          console.log(context.slots)
  
          // Emit Events (Method)
          console.log(context.emit)
      }
  }
  ```

* 该`context`对象是普通的 JavaScript 对象，即，它不是响应式的，可以安全地使用 ES6 解构 `context`。

  ```js
  export default {
      setup(props, { attrs, slots, emit }) {
          ...
      }
  }
  ```

> * `attrs` 和 `slots` 是有状态对象，在组件本身更新时始终会更新。这意味着您应该避免解构它们，并始终将属性引用为 `attrs.x` 或 `slots.x` 。
> * 与 `props` **不**一样的是，`attrs` 和 `slots` **不是** 响应式的。如果您打算基于 `attrs` 或 `slots` 更改应用副作用，则应在生命周期 `onUpdated` 中进行。

**`this` 的用法**

在 `setup()` 函数中，`this` **不会是对当前活动实例的引用**，因为 `setup()` 是在解析其他组件选项之前调用的，因此，`this` 在 `setup()` 中的行为与在其他选项中的行为完全不同。当将 `setup()` 与其他 Options API 一起使用时，可能会引起混淆。

## 生命周期钩子函数

![image-20210205142133042](F:\LaGou\03-module\05-min-module\assets\image-7.png)

## Computed

* 使用 getter 函数，并为 getter 返回的值返回一个不可变的反应性 [ref](https://v3.vuejs.org/api/refs-api.html#ref) 对象。

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)
  console.log(plusOne.value) // 2
  plusOne.value++ // error
  ```

* 或者，它可以使用具有 `get` 和 `set` 函数的对象来创建可写的 ref 对象。

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: val => {
      count.value = val - 1
    }
  })
  plusOne.value = 1
  console.log(count.value) // 0
  ```

## WatchEffect

* 是 `watch` 函数的简化版本，也用来监视数据的变化

* 接收一个函数作为参数，监听函数内响应式数据的变化

* 在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它。

  ```js
  const count = ref(0)
  
  watchEffect(() => console.log(count.value))
  // -> logs 0
  
  setTimeout(() => {
    count.value++
    // -> logs 1
  }, 100)
  ```

## Watch

该 `watch` API 与 Options API [this.$ watch](https://v3.vuejs.org/api/instance-methods.html#watch)（以及相应的 [watch](https://v3.vuejs.org/api/options-data.html#watch) 选项）完全等效。`watch`需要查看特定的数据源，并在单独的回调函数中应用副作用。默认情况下，它也是惰性的，即仅在监视的源已更改时才调用回调。

与 [watchEffect](https://v3.vuejs.org/api/computed-watch-api.html#watcheffect) 相比，`watch`我们可以：

- 懒惰地执行副作用；
- 更具体地说明什么状态应触发观察程序重新运行；
- 访问监视状态的先前值和当前值。

Watch 的三个参数
* 第一个参数：要监听的数据，即 `ref` 或者 `reactive` 返回的对象
* 第二个参数：监听到数据变化后执行的函数，这个函数有两个参数是新值和旧值
* 第三个参数：选项对象，deep 和 immediate

Watch 的返回值

* 取消监听的函数

**监视单个源**

* 观察者数据源可以是返回值的 getter 函数，也可以直接是 [ref](https://v3.vuejs.org/api/refs-api.html#ref) ：

  ```js
  // watching a getter
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  
  // directly watching a ref
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

**监视多个源**

* 观察者还可以使用数组同时监视多个源：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

**`watchEffect` 与 `watch` 的共享行为**

* watch 与 watchEffect 在手动停止、副作用失效（将 onInvalidate 作为第三个参数传递给回调）、刷新计时和调试方面共享行为。

## 自定义指令

**Vue 2.x** 

* 第一种用法

  ```js
  Vue.directive('editingFocus', {
      bind(el, binding, vnode, prevVnode) {},
    inserted() {},
      update() {}, // remove
      componentUpdated() {},
      unbind() {}
  })
  ```

* 第二种用法

  ```js
  Vue.directive('editingFocus', (el, binding) => {
      binding.value && el.focus()
  })
  ```

**Vue 3.0**

* 第一种用法

  ```js
  app.directive('editingFocus', {
      beforeMount(el, binding, vnode, prevVnode) {},
      mounted() {},
      beforeUpdate() {}, // new
      updated() {},
      beforeUnmount() {}, // new
      unmounted() {}
  })
  ```

* 第二种用法

  ```js
  Vue.directive('editingFocus', (el, binding) => {
      binding.value && el.focus()
  })
  ```

# ToDoList

## 项目结构

* 使用 `Vue-CLI` 初始化项目结构

  ![image-20210205162657732](F:\LaGou\03-module\05-min-module\assets\image-20210205162657732.png)

## 功能列表

### 添加待办事项

* `App.vue`

  ```html
  <template>
      <section id="app" class="todoapp">
          <header class="header">
              <h1>todos</h1>
              <input
                     class="new-todo"
                     placeholder="What needs to be done?"
                     autocomplete="off"
                     autofocus
                     v-model="input"
                     @keyup.enter="addTodo"
                     />
          </header>
          <section class="main">
              <input id="toggle-all" class="toggle-all" type="checkbox" />
              <label for="toggle-all">Mark all as complete</label>
              <ul class="todo-list">
                  <li v-for="todo in todos" :key="todo.text">
                      <div class="view">
                          <input class="toggle" type="checkbox" />
                          <label>{{ todo.text }}</label>
                          <button class="destroy"></button>
                      </div>
                      <input class="edit" type="text" />
                  </li>
              </ul>
          </section>
      </section>
  </template>
  
  <script>
      import "./assets/index.css";
      import { ref } from "vue";
  
      // 1. 添加待办事项
      const useAdd = (todos) => {
          const input = ref("");
          const addTodo = () => {
              const text = input.value && input.value.trim();
              if (text.length === 0) return;
              todos.value.unshift({
                  text,
                  completed: false,
              });
              input.value = ''
          };
          return {
              input,
              addTodo,
          };
      };
  
      export default {
          name: "App",
          setup() {
              const todos = ref([]);
              return {
                  ...useAdd(todos),
                  todos
              };
          },
      };
  </script>
  ```

### 删除待办事项

* `App.vue`

  ```html
  <button class="destory" @click="remove(todo)"></button>
  
  <script>
      // 2. 删除待办事项
      const useRemove = (todos) => {
          const remove = (todo) => {
              const index = todos.value.indexOf(todo)
              todos.value.splice(index, 1)
          }
          return {
              remove
          }
      }
  
      export default {
          name: "App",
          setup() {
              const todos = ref([]);
              return {
                  todos,
                  ...useAdd(todos),
                  ...useRemove(todos)
              };
          },
      };
  </script>
  ```

### 编辑待办事项

* `App.vue`

  ```html
  <ul class="todo-list">
      <li 
          v-for="todo in todos" 
          :key="todo"
          :class="{ editing: todo === editingTodo }"
          >
          <div class="view">
              <input class="toggle" type="checkbox" />
              <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
              <button class="destroy" @click="remove(todo)"></button>
          </div>
          <input 
                 class="edit" 
                 type="text" 
                 v-editing-focus="todo === editingTodo"
                 v-model="todo.text" 
                 @keyup.enter="doneEdit(todo)"
                 @blur="doneEdit(todo)"
                 @keyup.esc="cancelEdit(todo)"
                 />
      </li>
  </ul>
  
  <script>
      // 3. 编辑待办事项
      const useEdit = remove => {
          let beforeEditingText = ''
          const editingTodo = ref(null)
  
          // 双击待办项，展示编辑文本框
          const editTodo = todo => {
              beforeEditingText = todo.text
              // 显示编辑文本框的时候获取焦点  
              editingTodo.value = todo
          }
  
          // 按回车或者编辑文本框失去焦点，修改数据
          const doneEdit = todo => {
              if (!editingTodo.value) return
              todo.text = todo.text.trim()
              todo.text || remove(todo)
              // 把编辑文本框清空按回车，删除这一项
              editingTodo.value = null
          }
  
          // 按 ESC 取消编辑
          const cancelEdit = todo => {
              editingTodo.value = null
              todo.text = beforeEditingText
          }
  
          return {
              editingTodo,
              editTodo,
              doneEdit,
              cancelEdit
          }
      }
  
      export default {
          directives: {
              // 编辑文本框获取焦点的自定义指令
              editingFocus: (el, binding) => {
                  binding.value && el.focus()
              }
          }
      };
  </script>
  ```

### 切换待办事项

* 点击 checkbox，改变所有待办项状态

  ```html
  <section class="main">
      <input id="toggle-all" class="toggle-all" v-model="allDone" type="checkbox"/>
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
          <li 
              v-for="todo in todos" 
              :key="todo"
              :class="{ editing: todo === editingTodo, completed: todo.completed }"
              >
              <div class="view">
                  <input class="toggle" type="checkbox" v-model="todo.completed" />
                  <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
                  <button class="destroy" @click="remove(todo)"></button>
              </div>
              <input 
                     class="edit" 
                     type="text" 
                     v-editing-focus="todo === editingTodo"
                     v-model="todo.text" 
                     @keyup.enter="doneEdit(todo)"
                     @blur="doneEdit(todo)"
                     @keyup.esc="cancelEdit(todo)"
                     />
          </li>
      </ul>
  </section>
  
  <script>
      // 4. 切换待办事项完成状态
      const useFilter = todos => {
          const allDone = computed({
              get () {
                  return !todos.value.filter(todo => !todo.completed).length
              },
              set (value) {
                  todos.value.forEach(todo => {
                      todo.completed = value
                  });
              }
          })
  
          return {
              allDone
          }
      }
      export default {
          setup() {
              return {
                  // ......
                  ...useFilter(todos)
          };
      }
      };
  </script>
  ```

* All / Active / Completed

  ```html
  <section class="main">
      <input
             id="toggle-all"
             class="toggle-all"
             v-model="allDone"
             type="checkbox"
             />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
          <li
              v-for="todo in filterTodos"
              :key="todo"
              :class="{ editing: todo === editingTodo, completed: todo.completed }"
              >
              <div class="view">
                  <input class="toggle" type="checkbox" v-model="todo.completed" />
                  <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
                  <button class="destroy" @click="remove(todo)"></button>
              </div>
              <input
                     class="edit"
                     type="text"
                     v-editing-focus="todo === editingTodo"
                     v-model="todo.text"
                     @keyup.enter="doneEdit(todo)"
                     @blur="doneEdit(todo)"
                     @keyup.esc="cancelEdit(todo)"
                     />
          </li>
      </ul>
  </section>
  <footer class="footer">
      <span class="todo-count"> <strong>1</strong> item left </span>
      <ul class="filters">
          <li><a href="#/all">All</a></li>
          <li><a href="#/active">Active</a></li>
          <li><a href="#/completed">Completed</a></li>
      </ul>
      <button class="clear-completed">Clear completed</button>
  </footer>
  
  <script>
      const useFilter = (todos) => {
          // ......
  
          const filter = {
              all: list => list,
              active: list => list.filter(todo => !todo.completed),
              completed: list => list.filter(todo => todo.completed)
          }
  
          const type = ref('all')
          const filterTodos = computed(() => filter[type.value](todos.value))
          const onHashChange = () => {
              const hash = window.location.hash.replace('#/', '')
              if (filter[hash]) {
                  type.value = hash
              } else {
                  type.value = 'all'
                  window.location.hash = ''
              }
          };
  
          // 注册事件
          onMounted(() => {
              window.addEventListener("hashchange", onHashChange);
              onHashChange();
          });
  
          // 移除事件
          onUnmounted(() => {
              window.addEventListener("hashchange", onHashChange);
          });
  
          return {
              allDone,
              filterTodos
          };
      };
  </script>
  ```

* 其它

  * 显示未完成待办项个数

    ```html
    <span class="todo-count"> 
        <strong>{{ remainingCount }}</strong> {{ remainingCount > 1 ? 'items' : 'item'}} left 
    </span>
    <script>
        // 4. 切换待办事项
        const useFilter = (todos) => {
            const remainingCount = computed(() => filter.active(todos.value).length)
    
            return {
                remainingCount
            };
        };
    </script>
    ```

  * 移除所有完成的项目

    ```html
    <button class="clear-completed" @click="removeCompleted">Clear completed</button>
    <script>	
        // 2. 删除待办事项
        const useRemove = todos => {
            const remove = todo => {
                const index = todos.value.indexOf(todo);
                todos.value.splice(index, 1);
            };
    
            const removeCompleted = () => {
                todos.value = todos.value.filter(todo => !todo.completed)
            }
            return {
                remove,
                removeCompleted
            };
        };
    
        export default {
            name: "App",
            setup() {
                const todos = ref([]);
    
                const { remove, removeCompleted } = useRemove(todos);
                return {
                    todos,
                    remove,
                    removeCompleted,
                    ...useAdd(todos),
                    ...useEdit(remove),
                    ...useFilter(todos),
                };
            },
        };
    </script>
    ```

  * 如果没有待办项，隐藏 main 和 footer

    ```html
    <section class="main" v-show="count">
        ......
    </section>
    <footer class="footer" v-show="count">
        ......
        <button class="clear-completed" @click="removeCompleted" v-show="count > remainingCount">
            Clear completed
        </button>
    </footer>
    <script>
        const useFilter = (todos) => {
            const count = computed(() => todos.value.length)
            return {
                count
            };
        };
    </script>
    ```

### 存储待办事项

* 封装 `useLocalStorage` 模块

  ```js
  function parse (str) {
      let value
  
      try {
          value = JSON.parse(str)
      } catch {
          value = null
      }
  
      return value
  }
  
  function stringify (obj) {
      let value
  
      try {
          value = JSON.stringify(obj)
      } catch {
          value = null
      }
      return value
  }
  
  export default function useLocalStorage() {
      function setItem (key, value) {
          value = stringify(value)
          window.localStorage.setItem(key, value)
      }
  
      function getItem(key) {
          let value = window.localStorage.getItem(key)
          if (value) {
              value = parse(value)
          }
          return value
      }
  
      return {
          setItem,
          getItem
      }
  }
  ```

* `App.vue`

  ```js
  import useLocalStorage from './utils/useLocalStorage'
  const storage = useLocalStorage()
  
  // 5. 存储待办事项
  const useStorage = () => {
      const KEY = 'TODOKEYS'
      const todos = ref(storage.getItem(KEY) || [])
      watchEffect(() => {
          storage.setItem(KEY, todos.value)
      })
      return todos
  }
  
  export default {
      setup() {
          const todos = useStorage();
      }
  }
  ```
