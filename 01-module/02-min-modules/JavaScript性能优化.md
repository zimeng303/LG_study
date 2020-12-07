@[TOC](JavaScript性能优化)

# JavaScript 内存管理

* 内存为什么需要管理

  ```c
  function fn () {
      arrList = []
          arrList[100000] = 'lg is a coder'
  }
  fn() // 内存泄露
  ```

* 内存管理介绍

  内存：由可读写单元组成，表示一片可操作空间

  管理：人为的去操作一片空间的申请、使用和释放

  内存管理：开发者主动申请空间、使用空间、释放空间

  管理流程：申请 -- 使用 -- 释放

* JavaScript中的内存管理

  申请内存空间

  ```c
  let obj = {}
  ```

  

  使用内存空间

  ```c
  obj.name = 'lg'
  ```

  

  释放内存空间

  ```c
  obj = null
  ```

## 垃圾回收与常见 GC 算法

* JavaScript 中的垃圾

  JavaScript中内存管理是自动的

  对象不再被引用时是垃圾

  对象不能从根上访问到时是垃圾

* JavaScript 中的可达对象

  可以访问到的对象就是可达对象（引用、作用域链）

  可达的标准就是从根出发是否能够被找到

  JavaScript 中的根就可以理解为是全局变量对象，也就是我们所说的全局执行上下文

  **总结**

  JavaScript 中的垃圾回收，其实就是找到垃圾，然后让 JavaScript中的执行引擎进行空间的释放和回收

* JavaScript 中的引用和可达

  首先，来看一个简单的例子：

  ```c
  let obj = {name: 'xm'}  // 此时，obj是可达的
  
  let ali = obj  // 发生引用数值变化
  
  obj = null    // 依然是可达对象，因为 ali 还在引用
  
  ```

  看完了上面的例子，我们对引用和可达有了简单的了解。下面，我们再来看一个稍微复杂的引用和可达的例子。

  ```c
  function objGroup (obj1, obj2) {
      obj1.next = obj2
      obj2.prev = obj1
  
      return {
          o1: obj1,
          o2: obj2
      }
  }
  let obj = objGroup({name: 'obj1'}, {name: 'obj2'})
  ```

  我们先来看一个上面代码的可达对象图：

  ![可达对象图示](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201111112456733.png)

  首先，从全局的根开始出发，可以看到一个可达的对象 obj，它是通过函数调用之后，指向了一个内存空间，在这个空间中又包含了o1 和 o2两个成员，而在o1 和 o2的里面又通过相应的属性去指向了一个obj1的空间和一个obj2的空间，然后obj1 和 obj2 又通过next 和 prev 做了一个相互的引用，总之，我们所有的对象都可以从根上进行查找，无论查找之路是多么的曲折，最终都可以找到我们需要的结果。

  下面，我们来看一个假设，我们使用delete语句将obj中o1的引用以及obj2对obj1的引用

  都delete掉，会发生什么样的改变呢？请看下图：

  ![delete引用](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201111141149663.png)

  ​	在上图中，当我们执行上面的delete操作时，将不可以再通过其他的方式找到 obj1这一对象空间，此时，它将会被认为是垃圾，由JavaScript对其进行回收。

  

## GC 算法介绍

 * GC 定义与作用

   GC 就是垃圾回收机制的简写

   GC 可以找到内存中的垃圾、并释放和回收空间

* GC 里的垃圾是什么

  程序中不再需要使用的对象

  ```c
  function func () {
      name = 'lg'
      return `${name} is a coder`
  }
  func()
  ```

  程序中不能再访问到的对象

  ```c
  // 程序运行过程中，变量是否还可以被引用到
  function func () {
      const name = 'lg'       // 函数调用结束，函数外部不能访问
      return `${name} is a coder`
  }
  func()
  ```

* GC 算法是什么

  GC 是一种机制，垃圾回收器完成具体的工作

  工作的内容就是查找垃圾释放空间、回收空间

  算法就是工作时查找和回收所遵循的规则

## 常见 GC 算法

### 引用计数算法

* 实现原理

  1）核心思想：设置引用数，判断当前引用数是否为 0

  2）引用计数器

  3）引用关系改变时，引用计数器修改引用数字

  4）引用数字为 0 时，立即回收

  ```c
  const user1 = { age: 1 }
  const user2 = { age: 2 }
  
  // 此时的user1、user2的引用计数不是0，不会被回收
  const ageList = [user1.age, user2.age]
  
  function fn () {
      const num1 = 1
      const num2 = 2
  }
  
  /**
   * 调用执行结束后，外部将不能访问到 fn函数内的成员，
   * 此时的引用计数变为0，num1和num2所在的内存空间将会被回收掉。
   */ 
  fn()  
  ```

* 优缺点

  **优点**

  可以即时回收垃圾对象；

  当内存将要爆满时，会立即找到引用计数为0的对象空间进行释放，保证当前内存不会存在爆满的时候。说明最大限度减少程序暂停，

  **缺点**

  无法回收循环引用的对象；

  时间开销大，资源消耗较大，即需要时刻监控每个对象的引用数字是否需要修改。

* 问题：对象之间的循环引用

  ```c
  function fn () {
      const obj1 = {}
      const obj2 = {}
  
      obj1.name = obj2  // obj1 和 obj2之间的引用数字不为0
      obj2.name = obj1  // 引用计数算法无法回收，会造成内存浪费
  
      return 'lg is a coder'
  }
  fn()
  ```

### 标记清除算法

* 实现原理

  1）核心思想：分标记和清除二个阶段完成

  2）遍历所有对象找标记活动对象

  3）遍历所有对象清除没有标记对象

  4）回收相应的空间

  图示如下：

  ![标记清除算法图示](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201111153854436.png)

  从全局出发，可以找到 A、B、C三个可达对象，可以发现在 A 和 C的下面有一些值引用，这也正反映了标记清除算法的强大之处，即当对象的下面还有孩子，孩子的下面还有孩子的时候，这种时候将会使用递归的方式去寻找那些可达的对象。因此，在上面的D和E也会被进行可达的标记。但是右侧的a1和b1形成了单独的作用域，在左侧的链条中不会被找到，因此便不会被标记，会被JavaScript引擎回收。

* 优缺点

  **优点**

  相对于引用计数来说，可以解决对象之间的循环引用不能回收的问题

  **缺点**

  不会立即回收垃圾对象，因为它相对于之前的垃圾回收来说，会产生空间碎片化的问题，不能让我们的空间得到最大化的使用。

### 标记整理算法

* 实现原理

  1）标记整理可以看做是标记清除的增强

  2）标记阶段的操作和标记清除一致

  3）清除阶段会先执行整理，移动对象位置

  图示如下：

  ![回收前](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112103435480.png)

  在垃圾回收之前，整个空间分为被标记的活动对象、未被标记的非活动对象以及空闲空间。

  ![整理后](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112103546064.png)

  经过一系列的整理操作，会将别标记的活动对象整理在一处，方便JavaScript引擎进行回收。

  ![回收后](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112103643466.png)

  被标记的活动对象全部被整理放置在了空间的右边，然后JavaScript引擎会将右侧的标记区域进行回收，上图就显示了回收之后的效果。

* 优缺点

  **优点**

  相对于标记清除来说，减少碎片化空间

  **缺点**

  因为它需要先整理被标记的活动对象，所以不会立即回收垃圾对象。

V8 引擎的垃圾回收

* 认识 V8

  V8是一款主流的 JavaScript 执行引擎

  V8 速度快，采用即时编译

  V8 内存设限(针对浏览器，以及内存回收机制所决定) ，64位操作系统不超过1.5G，32位操作系统不超过800M

* V8 垃圾回收策略

  采用分代回收的思想

  内存分为新生代、老生代

  针对不同对象采用不同算法

  图示如下：

  ![V8 垃圾回收策略](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112105819948.png)

  

* V8 中常用 GC 算法

  分代回收  -- 内存设限

  空间复制

  标记清除

  标记整理

  标记增量

* V8 内存分配

  图示如下：

  ![V8 内存分配](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112110239188.png)

  文字说明：

  1）V8 内存空间一分为二

  2）小空间用于存储新生代对象（32M | 16M）

  3）新生代指的是存活时间较短的对象

* V8 如何回收新生代对象

  **回收实现**

  1）回收过程采用复制算法 + 标记整理

  2）新生代内存区分为二个等大小空间

  3）使用空间为From，空闲空间为 To

  4）活动对象存储于 From 空间

  5）标记整理后将活动对象拷贝至 To

  6）From 与 To 交换空间完成释放

  **回收细节说明**

  拷贝过程中可能出现晋升

  晋升就是将新生代对象移动至老年代

  一轮 GC 还存活的新生代需要晋升

  To 空间的使用率超过25%，进行限制

* V8 如何回收老生代对象

  **老生代对象说明**

  老生代对象存放在右侧老生代区域

  64位操作系统1.4G，32位操作系统700M

  老生代对象就是指存活时间较长的对象，如在全局中定义的变量，闭包中的变量数据等

  **回收实现**

  1）主要采用标记清除、标记整理、增量标记算法

  2）首先使用标记清除完成垃圾空间的回收

  3）采用标记整理进行空间优化

  4）采用增量标记进行效率优化

* 新生代对象回收和老生代对象回收，细节对比

  1）新生代区域垃圾回收使用空间换时间

  2）老生代区域垃圾回收不适合复制算法

* 标记增量如何优化垃圾回收

  图示如下：

  ![标记增量运行机制](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112112149614.png)

  在上面的图示中，我们可以看到，垃圾回收和程序的运行是交替着实现的，这样不会导致很长时间的停顿，可以带来更好的用户体验。

  标记增量就是像上面展示的那样，将当前一整段的垃圾回收操作拆分成多个小段，组合着去完成当前的整个回收，从而去替代原来的一口气做完的垃圾回收操作。

# Performance 工具

* 为什么使用 Performance

  1）GC 的目的是为了实现内存空间的良性循环

  2）良性循环的基石是合理使用

  3）时刻关注才能确定是否合理

  4）Performance 提供多种监控方式，可以时刻监控内存

* 使用步骤

  1）打开浏览器输入目标地址 -- Chrome为例

  ![Chrome](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112140311288.png)

  2）进入开发人员工具面板，选择性能

  ![Performance](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112140451592.png)

  3）开启录制功能，访问具体界面；

  ![开始录制](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112140925782.png)

  4）执行用户行为，一段时间后停止录制

  5）分析界面中记录的内存信息![录制后](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112141318517.png)

* 内存问题的体现

  1）当网络正常时，页面出现延迟加载或经常性暂停 （频繁的垃圾回收）

  2）当网络正常时，页面持续性出现糟糕的性能 （内存膨胀）

  3）页面的性能随时间延长越来越差（内存泄漏）

* 界定内存问题的标准

  内存泄漏：内存使用持续升高

  内存膨胀：在多数设备上都存在性能问题

  频繁垃圾回收：通过内存变化图进行分析

* 监控内存的几种方式

  1）浏览器任务管理器

  ​	在浏览器位置，使用快捷键：Shift + Esc，调出任务管理器。

  ​	在任务管理器中点击右键，可以调出你想看到的列。![浏览器任务管理器](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112152019023.png)

  在任务管理器中，存在两种内存。一种是内存占用空间，他指的是DOM节点所占用的内存。如果他的数值不断增大，则说明界面中在不断的创建新DOM。而另一种则是JavaScript使用的内存，他表示的是JavaScript中的堆，我们所要关注的是小括号中的数据，他表示的是界面中所有可达对象正在使用的内存大小。如果他的数值不断增大，可能是当前界面中正在创建新对象，也可能是当前现有对象在不断的增长。

  **总结**

  我们可以通过浏览器任务管理器中的 JavaScript使用的内存的数值变化，来分辨出当前界面的内存是否存在问题。如果JavaScript使用的内存持续增大，则说明存在内存问题。但是浏览器任务管理器只能发现内存问题，而无法定位问题。那么，接下来我们看一下如何定位到具体的内存问题，以及在哪一个时间节点内发生的？

  2）Timeline 时序图记录

  首先，我们先来模拟一个不断创建DOM节点以及特别消耗内存的程序

  ```c
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>时间线记录内存变化</title>
  </head>
  <body>
      <button id="btn">Add</button>
      <script>
          let arrList = []
  
          function test () {
              for (let i = 0; i < 100000; i++) {
                  document.body.appendChild(document.createElement('p'))
              }
              arrList.push(new Array(1000000).join('x'))
          }
  
          document.getElementById('btn').addEventListener('click', test)
      </script>
  </body>
  </html>
  ```

  然后，我们在浏览器中运行程序，打开 Performance工具录制时序图，点击按钮，录制结束，可以看到下方图中所示：

  ![时序图](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112161239515.png)

  在上图中，我们可以看到，在程序执行过程中，JS Heap的趋势图是有增有降的，这也就说明了，在我们程序的运行过程中，是由内存释放的。我们可以通过上方的时间轴来查看每一个时间节点内的内存变化情况，从而确定此时间节点中是否存在内存问题。

  3）堆快照查找分离 DOM

  * 什么是分离 DOM

    界面元素存活在 DOM 树上

    垃圾对象时的 DOM 节点

    分离状态的 DOM 节点，只是从 DOM 树上分离，还会被引用（内存泄漏）

  * 如何查找分离 DOM

    首先，我们先来模拟一个拥有分离 DOM 的程序，代码如下：

    ```c
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>堆快照监控内存</title>
    </head>
    <body>
        <button id="btn">Add</button>
        
        <script>
            // 新建 DOM，但是不把它放在界面中，而是使用一个变量进行引用
            let temEle
    
            function fn () {
                let ul = document.createElement('ul')
    
                for (let i = 0; i < 10; i++) {
                    let li = document.createElement('li')
                    ul.appendChild(li)
                }
                temEle = ul
            }
            document.getElementById('btn').addEventListener('click', fn)
        </script>
    </body>
    </html>
    ```

    然后，使用浏览器打开，并打开开发工具，找到堆快照，堆快照的位置如图：

    ![堆快照](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112163344702.png)

    下面，我们来做两个行为的测试。

    首先，我们使用浏览器打开程序后，什么都不做，先来拍快照，此时，我们会看到如下图所示的内容：

    ![堆快照](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112164617305.png)

    此时我们搜索 “deta”（Detached 缩写），发现是没有结果的。

    ![image-20201112165208124](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112165208124.png)

    接下来，我们点击 Add 按钮，执行DOM的新建。执行刚才的拍快照操作，并搜索“deta”，会出现如下图所示的结果：

    ![分离DOM](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112165720961.png)

    上面查询出来的DOM节点，并没有在界面中展示，也就是说，它们其实就是分离DOM，会造成内存浪费。

  * 总结

    通过堆快照，可以发现具体的分离DOM，从而采用对应的方法去处理，释放内存，节省内存空间。

  4）判断是否存在频繁的垃圾回收

  * 为什么确定频繁垃圾回收

    GC 工作时应用程序是停止的

    频繁且过长的 GC 会导致应用假死

    用户使用中感知应用卡顿

  * 确定频繁的垃圾回收

    Timeline 中频繁的上升下降

    任务管理器中数据频繁的增加减小

## 代码优化介绍

* 如何精准测试 JavaScript 性能

  1）本质上就是采集大量的执行样本进行数学统计和分析；

  2）使用基于 Benchmark.js 的 [jsben.ch](https://jsben.ch/)、[jsbench.me](https://jsbench.me/?ref=producthunt)、[measurethat.net](https://measurethat.net/)、[jsperf.com](https://jsperf.com/)（四者选其一即可）完成。

### 代码优化的方式

* 慎用全局变量

  **为什么慎用全局变量**

  1）全局变量定义在全局执行上下文，是所有作用域链的顶端

  2）全局执行上下文一直存在于上下文执行栈，直到程序退出

  3）如果某个局部作用域出现了同名变量则会遮蔽或污染全局

  下面，我们使用 [jsbench.me](https://jsbench.me/?ref=producthunt) 来测试一下全局变量和局部变量两者中哪个的性能比较高。

  代码如下（示例）：

  ```c
  // 全局变量
  var i, str = '';
  for (i = 0; i < 1000; i++) {
      str += i;    
  }
  
  // 局部变量
  for (let i = 0; i < 1000; i++) {
      let str = '';
      str += i;  
  }
  ```

   [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示：

  ![性能测试](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112214731303.png)

  通过上图，我们可以很明显的看到，局部变量的性能要远远高于全局变量。这也正反应了我们需要慎用全局变量的原因。

* 缓存全局变量

  **何时缓存变量**

  将使用中无法避免的全局变量缓存到局部

  下面，我们来看一个代码示例，看一下没有缓存和有缓存的性能对比：

  ```c
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>缓存全局变量</title>
  </head>
  <body>
      <input type="button" value="btn" id="btn1">
      <input type="button" value="btn" id="btn2">
      <input type="button" value="btn" id="btn3">
      <input type="button" value="btn" id="btn4">
      <p>1111</p>
      <input type="button" value="btn" id="btn5">
      <input type="button" value="btn" id="btn6">
      <p>222</p>
      <input type="button" value="btn" id="btn7">
      <input type="button" value="btn" id="btn8">
      <p>333</p>
      <input type="button" value="btn" id="btn9">
      <input type="button" value="btn" id="btn10">
  
      <script>
          // 没有缓存
          function getBtn1 () {
              let oBtn1 = document.getElementById('btn1')
              let oBtn3 = document.getElementById('btn3')
              let oBtn5 = document.getElementById('btn5')
              let oBtn7 = document.getElementById('btn7')
              let oBtn9 = document.getElementById('btn9')
          }
          
          function getBtn2 () {
              let obj = document // 通过局部变量，缓存document对象 
              let oBtn1 = obj.getElementById('btn1')
              let oBtn3 = obj.getElementById('btn3')
              let oBtn5 = obj.getElementById('btn5')
              let oBtn7 = obj.getElementById('btn7')
              let oBtn9 = obj.getElementById('btn9')
          }
      </script>
  </body>
  </html>
  ```

   [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，很明显使用局部变量将document对象进行缓存，其性能远远的高于未缓存时的性能。

  ![缓存执行结果](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112220443950.png)

* 通过原型新增方法

  在原型对象上新增实例对象需要的方法。

  直接在构造函数中添加方法，与通过原型对象添加方法，代码对比如下：

  ```c
  var fn1 = function () {
      this.foo = function () {
          console.log(1111);
      }
  }
  let f1 = new fn1()
  
  // 通过原型对象添加方法
  var fn2 = function () {}
  fn2.prototype.foo = function () {
      console.log(1111);
  }
  let f2 = new fn2()
  ```

   [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，通过原型对象添加实例对象需要的方法，可以大大地提高性能。

  ![原型对象添加方法](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112221646584.png)

* 避开闭包陷阱

  **闭包特点**

  外部具有指向内部的引用

  在 “外” 部作用域访问 “内” 部作用域的数据

  代码如下（示例）：

  ```c
  function foo () {
      var name = 'lg'
      function fn () {
          console.log(name)   // 外部具有指向内部的引用
      }
      return fn
  }
  var a = foo()
  a()
  ```

   **关于闭包**

  1）闭包是一种强大的语法

  2）闭包使用不当很容易出现内存泄漏

  3）不要为了闭包而闭包

  避开闭包陷阱的代码示例：

  ```c
  function foo () {
      // el 所在的相当于外部作用域
      var el = document.getElementById("btn")
      el.onclick = function () {
          // 内部作用域，内部作用域使用了外部作用域中的变量
          // 此时 el.id 不会被回收，多个会导致内存泄漏
          console.log(el.id);  
      }
  }
  // 内存层面，避开闭包，防止内存泄漏
  function foo () {
      var el = document.getElementById("btn")
          el.onclick = function () {
          console.log(el.id);  
      }
      el = null // 释放变量
  }
  ```

* 避免属性访问方法使用

  **JavaScript 中的面向对象**

  1）JS 不需要属性的访问方法，所有属性都是外部可见的

  2）使用属性访问方法只会增加一层重定义，没有访问的控制力

  下面我们来看一段代码示例：

  ```c
  function Person () {
      this.name = 'icoder'
      this.age = 18
      this.getAge = function () { // 属性访问方法，使用函数内属性
          return this.age
      }
  }
  const p1 = new Person()
  const a = p1.getAge()
  
  function Person () {
      this.name = 'iconder'
      this.age = 18
  }
  const p2 = new Person()
  const b = p2.age        // 通过实例对象访问属性
  
  
  ```

  [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，在第二段代码中，性能显然比第一段代码中的性能要高，两者不同的就是第二个段代码中没有采用属性访问方法使用属性的方式，这也说明了在实际开发中，应避免属性访问方法使用。

  ![直接访问属性](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112225613929.png)

* For 循环优化

  代码示例如下：

  ```c
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  <p class="btn">add</p>
  
  <script>
      var aBtns = document.getElementsByClassName("btn")
     
      for (var i = 0; i < aBtns.length; i++) {
          console.log(i);
      }
      
      for (var i = 0, len = aBtns.length; i < len; i++) {
          console.log(i);
      }
  </script>
  ```

  [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，在第二段中使用了变量 len 获取了数组的长度，使每次循环时，无需再去计算数组的长度，节省了运行时间和计算步骤，从而可以优化性能。

  ![数组长度](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112231521769.png)

* 选择最优的循环方法

  下面以 forEach、for、forin三种循环进行比较，代码如下：

  ```c
  var arrList = new Array(1, 2, 3, 4, 5)
      
  arrList.forEach(function (item) {
      console.log(item);
  })
  
  for (var i = 0, len = arrList.length; i < len; i++) {
      console.log(arrList[i]);
  }
  
  for (var i in arrList) {
     console.log(i);
  }
  ```

  [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，forEach的执行效率要远远高于其它两种，其次使优化过后的for循环，最后是forin循环。由此我们可以得出，forEach是这三者中最优的循环方法。你也可以将forEach与其它循环进行比较，在这里就不一一赘述了。

  ![最优的循环](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112233016165.png)

* 节点添加优化

  节点的添加操作必然会有回流和重绘。

  下面，我们来模拟创建 DOM 节点的两种方式，代码如下：

  ```c
   for (var i = 0; i < 10; i++) {
       var oP = document.createElement('p')
       oP.innerHTML = i
       document.body.appendChild(oP)
   }
  
  // 文档碎片优化节点添加
  const fragEle = document.createDocumentFragment()
      for (var i = 0; i < 10; i++) {
          var oP = document.createElement('p')
          oP.innerHTML = i
          fragEle.appendChild(oP)
      }
  document.body.appendChild(fragEle)
  ```

  [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，当我们使用了 文档碎片 的形式进行节点的添加时，性能要远远大于直接添加节点时的性能。因此我们可以知道，文档碎片优化节点添加，可以大大提高代码的运行效率，提高性能。

  ![文档碎片](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112234133469.png)

* 克隆优化节点操作

  下面以重新创建DOM节点和克隆DOM节点为例，代码如下：

  ```c
  <p id="box1">old</p>
  
  <script>
      for (var i = 0; i < 3; i++) {
          var oP = document.createElement('p')
              oP.innerHTML = i
              document.body.appendChild(oP)            
      }
  
  	var oldP = document.getElementById("box1")
      for (var i = 0; i < 3; i++) {
          var newP = oldP.cloneNode(false) // 克隆节点
              newP.innerHTML = i
              document.body.appendChild(newP) 
      }
  </script>
  ```

  [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，虽然两种结果的运行效率都很快，但是从运行的显示数值上，还是可以看到克隆节点的执行效率较高，这种会节省掉节点样式等一系列动作的执行。

  ![克隆优化](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201112235404797.png)

* 直接量替换 Object 操作

  代码示例如下：

  ```c
  var a = [1, 2, 3] // 直接量
  
  var a1 = new Array(3) // Object (new 构造函数) 操作
  a1[0] = 1
  a1[1] = 2
  a1[2] = 3
  ```

  [jsbench.me](https://jsbench.me/?ref=producthunt) 测试结果如下图所示，直接量的执行效率要远远高于 Object 操作，因此我们可以使用直接量替换 Object 操作的方式，来进行性能的优化。

  ![直接量优化](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201113000320080.png)

### 堆栈中代码执行流程

![image-20201113163231403](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201113163231403.png)

### 减少判断层级

```c
function doSomething (part, chapter) {
    const parts = ['ES2016', '工程化', 'Vue', 'React', 'Node']
    if (part) {
        if (parts.includes(part)) {
            console.log('属于当前课程');
            if (chapter > 5) {
                console.log('您需要提供 VIP 身份');
            }
        }
    } else {
        console.log('请确认模块信息');
    }
}
doSomething('ES2016', 6)
```

```c
function doSomething (part, chapter) {
    const parts = ['ES2016', '工程化', 'Vue', 'React', 'Node']
    if (!part) {
        console.log('请确认模块信息');
        return
    }

    if (!parts.includes(part)) return
    console.log('属于当前课程');
    if (chapter > 5) {
        console.log('您需要提供 VIP 身份');
    }
}

doSomething('ES2016', 6)
```

![image-20201113170500615](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201113170500615.png)

### 减少作用域链查找层级

```c
var name = 'zce'
function foo () {
    name = 'zce666'  // name 属于全局
    function baz () {
        var age = 38
        console.log(age);
        console.log(name);
    }
    baz()
}
foo()
```

```c

// 执行效率更高
var name = 'zce'
function foo () {
    var name = 'zce666'  
    function baz () {
        var age = 38
        console.log(age);
        console.log(name);
    }
    baz()
}
foo()
```



![image-20201113171711523](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201113171711523.png)

### 减少数据读取次数

```c
<div id="skip" class="skip"></div>  
<script>
    var oBox = document.getElementById('skip')

    function hasEle (ele, cls) {
        return ele.className == cls
    }	

    // 建立在空间消耗的基础上，用空间换时间
    function hasEle (ele, cls) {
        // 此时进行了缓存，减少了数据读取次数
        var clsname = ele.className
            return clsname == cls
    }
    console.log(hasEle(oBox, 'skip'))
</script>  
```



![](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201114131558548.png)

### 字面量与构造式

引用数据类型

```c
// new + 构造函数式
var test = () => {
    // 涉及到函数的调用，执行其他操作
    let obj = new Object() // 扩容时，建议构造式
    obj.name = 'zce'
    obj.age = 38
    obj.slogan = '我为前端而活'
    return obj
}

// 字面量
var test = () => {
    // 直接在内存中开辟空间
    let obj = {
        name: 'zce',
        age: 38,
        slogan: '我为前端而活'
    }
    return obj
}

console.log(test())
```

![image-20201114132634525](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201114132634525.png)

基本数据类型

```c
// 结果是一个单纯的字符串
var str = 'zce我为前端而活' 
 
// 结果是一个对象，可以沿着原型链去调用一些方法
var str = new String('zce我为前端而活')

console.log(str)
```

![image-20201114133126298](C:\Users\li_sh\Desktop\WebStudy\LaGou\Test\Part 01\Module 02\imgs\image-20201114133126298.png)

### 减少循环体活动

```c
var test = () => {
    var arr = ['zce', 38, '我为前端而活']
    var i
    for (i = 0; i < arr.length; i++) {
        console.log(arr[i])   
    }

}

```

```c
// 将循环体中不变数据的获取，拿到外面进行
var test = () => {
    var arr = ['zce', 38, '我为前端而活']
    var i, len = arr.length // 提前缓存arr的长度，使其在循环时，减少获取数据的活动
    for (i = 0; i < len; i++) {
        console.log(arr[i])   
    }

}
```



![image-20201114133945585](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201114133945585.png)

```c
var test = () => {
    var arr = ['zce', 38, '我为前端而活']
    var len = arr.length 
    while(len--) { // 当arr中有值时，会一直进行循环，减少循环体的活动次数
        // 会少做条件判断，但是要根据具体的问题来选择不同的循环语句
        console.log(arr[len]);
    }

}
```



![image-20201114134611223](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201114134611223.png)

### 减少声明及语句数

语句数：即表达式的多少

```c
<div id="box" style="width: 100px; height: 100px;"></div>
<script>
    var oBox = document.getElementById('box')

    var test = (ele) => {
    	// 在此需要对w、h、ele做词法、语法的分析、语法树的转化以及代码的生成，消耗时间
    	// 定义变量，也会增加内存的消耗
        let w = ele.offsetWidth // 代码的数量要多于下面那种，表达式增多
        let h = ele.offsetHeight
        return w * h
    }

    var test = (ele) => {
        // 在这里只需要对ele做词法、语法的分析、语法树的转化以及代码的生成
        return ele.offsetWidth * ele.offsetHeight
    }
    console.log(test(oBox));
</script>
```



![image-20201114140326899](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201114140326899.png)

声明数量

```c
// 编译阶段，需要拆分，然后进行词法、语法的分析、语法树的转化以及代码的生成
// 执行三次
var test = () => {
    // 从代码结构的清晰程度来看，推荐这种
    var name = 'zce'
    var age = 38
    var slogan = '我为前端而活'
    return name + age + slogan
}


var test = () => {
    // 因为只有一个var关键字，就只会执行一次词法、语法的分析、语法树的转化以及代码的生成
    var name = 'zce',
        age = 38,
        slogan = '我为前端而活'
        return name + age + slogan
}
console.log(test())
```



![image-20201114141508816](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201114141508816.png)

### 惰性函数与性能

```c
 <button id="btn">点击</button>
    <script>
        var oBtn = document.getElementById('btn')

        function foo () {
            console.log(this);
        }

        function addEvent (obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false)
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + type, fn)
            } else {
                obj['on' + type] = fn
            }
        }

        // 惰性函数，减少判断次数
        // 再次调用时，会使用上一次的结果进行判断
        function addEvent (obj, type, fn) {
            if (obj.addEventListener) {
                addEvent = obj.addEventListener(type, fn, false)
            } else if (obj.attachEvent) {
                addEvent = obj.attachEvent('on' + type, fn)
            } else {
                addEvent = obj['on' + type] = fn
            }
            return addEvent
        }
        addEvent(oBtn, 'click', foo)
        addEvent(oBtn, 'click', foo)
        addEvent(oBtn, 'click', foo)        
        addEvent(oBtn, 'click', foo)
        addEvent(oBtn, 'click', foo)
    </script>
```



![image-20201114143359837](C:\Users\li_sh\AppData\Roaming\Typora\typora-user-images\image-20201114143359837.png)

### 采用事件委托

好处：减少内存的占用，减少事件的注册



