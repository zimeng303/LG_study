@[TOC](在 Chrome 浏览器上安装 Vue Devtools 工具)

Vue.js devtools是基于Google Chrome浏览器的一款调试vue.js应用的开发者浏览器扩展，可以在浏览器开发者工具下调试代码。

# 下载 Devtools

* 一，直接去 github 官网，下载 **`devtools` 源码**，地址：https://github.com/vuejs/vue-devtools

  ![image-20201229162248051](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229162248051.png)

* 二、使用 `git clone` 命令，将源码克隆到本地

  ```powershell
  git clone https://github.com/vuejs/vue-devtools
  ```

  下载后，源码如下：

  ![image-20201229162957932](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229162957932.png)

# 安装 Devtools

* 下载完成后，进入 `vue-devtools-master` 目录 执行 yarn install`, 下载依赖

  ```powershell
  cd vue-devtools-master
  npm install 
  # cnpm install
  # yarn install 
  ```

  依赖安装完成，效果如图：

  ![image-20201229200534186](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229200534186.png)

* 然后执行 `npm run build`，编译源程序

  ```powershell
  npm run build
  # yarn build
  ```

  编译完成，效果如图：

  ![image-20201229164626576](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229164626576.png)

* 编译完成，目录结构如下：

  ![image-20201229165017481](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229165017481.png)

# 修改 mainifest.json 

* 修改 `packages/shell-chrome` 目录下的 `mainifest.json` 中的 `persistant` 为 `true`：

  ![image-20201229165710013](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229165710013.png)

* 把 **"persistent": false** 改成 **"presistnet": true**

  ![image-20201229170034516](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229170034516.png)

# Chrome 扩展插件

* 打开谷歌浏览器，点击右上角的扩展符号，点击 `更多工具`，选择 `扩展程序`

  

  ![](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\微信图片_20201229170930.png)

  

* 选择 `开发者模式`，并点击 <kbd>`加载已解压程序扩展程序` </kbd>按钮,

  ![image-20201229171656033](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229171656033.png)

  

* 选择 `vue-devtools-master --> packages --> shell-chrome` 放入，安装成功并启用，效果如图：

  ![image-20201229172124387](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229172124387.png)

**注意**

* vue必须引入开发版，使用min压缩版是不能使用devtools进行调试的；
* 安装后，需要重启浏览器，才可以使用。

# Vue Devtools 使用

启动 `vue` 项目, 打开 `F12` 开发者模式, 选择 `Vue` 就可以使用了.

![image-20201229172604074](C:\Users\li_sh\Desktop\WebStudy\LaGou\03-module\03-min-module\assets\image-20201229172604074.png)

 vue是数据驱动的, 这样就能看到对应数据了, 方便我们进行调试。

