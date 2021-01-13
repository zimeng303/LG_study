@[TOC](jsDelivr 开源公共CDN)

# jsDelivr 基本介绍

CDN，全称是 Content Delivery Network，即内容分发网络。

jsDelivr 是一个免费开源的 CDN 解决方案，用于帮助开发者和站长。包含 JavaScript 库、jQuery 插件、CSS 框架、字体等等 Web 上常用的静态资源。

jsDelivr 可以解决 `npm`、`GitHub`、WordPress` 加载资源缓慢，甚至打不开等的问题，因为它免费提供CDN 加速。

# jsDelivr 基本使用

* 官网地址：[https://www.jsdelivr.com/](https://www.jsdelivr.com/)

## Npm 的使用

### 基本介绍

**加载文件**

* `ionicons/2.0.1/css/ionicons.min.css`

**加载网址**

* https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css

### 查找过程

* 在[官网](https://www.jsdelivr.com/)中搜索想要加载的 `模块名(包名)`，如图所示：

  ![image-20210111111320496](F:\LaGou\03-module\03-min-module\assets\image-20210111111320496.png)

* 点击 搜索到的结果，进入选择其所需要的版本号，如图所示：

  ![image-20210111111655449](F:\LaGou\03-module\03-min-module\assets\image-20210111111655449.png)

* 点击找到的对应版本的文件，得出最终的转换加载网址，如图所示：

  ![image-20210111112059748](F:\LaGou\03-module\03-min-module\assets\image-20210111112059748.png)

* 转换后的网址，如图所示：

  ![image-20210111112136705](F:\LaGou\03-module\03-min-module\assets\image-20210111112136705.png)

**用法总结**

* npm 加载资源网址，如下所示：

  ```http
  https://cdn.jsdelivr.net/npm/包名@版本号/目录
  ```

* 官网示例，如图所示：

  ![image-20210111110116423](F:\LaGou\03-module\03-min-module\assets\image-20210111110116423.png)

  > <font color="#f00">注意：</font>
  >
  > ​	// 打开目录（后面的 `" / "` 是必要的，否则，无法打开）
  >
  > ​	https://cdn.jsdelivr.net/npm/jquery/

## GitHub 的使用

* 打开模块所在目录，如图所示：

  ![image-20210111114112587](F:\LaGou\03-module\03-min-module\assets\image-20210111114112587.png)

* github 加载资源的用法，如下所示：

  ```http
  https://cdn.jsdelivr.net/gh/用户名称/仓库名称@版本号/目录
  ```

* 官网示例，如图所示：

  ![image-20210111113436636](F:\LaGou\03-module\03-min-module\assets\image-20210111113436636.png)

## WordPress 的使用

* 加载任何插件从 `WordPress.org` 插件 `SVN repo`，如下所示：

  ```http
  https://cdn.jsdelivr.net/wp/plugins/project/tags/version/file
  ```

* 加载精确版本，如下所示：

  ```http
  https://cdn.jsdelivr.net/wp/plugins/wp-slimstat/tags/4.6.5/wp-slimstat.js
  ```

* 加载最新版本，如下所示

  ```http
  https://cdn.jsdelivr.net/wp/plugins/wp-slimstat/trunk/wp-slimstat.js
  ```

  > <font color="#f00">注意：</font>
  >
  > ​	生产版本，不推荐使用

* 从 `WordPress.org` 的主题 `SVN repo` 加载任何主题，如下所示：

  ```http
  https://cdn.jsdelivr.net/wp/themes/project/version/file
  ```

* 加载精确版本，如下所示：

  ```http
  https://cdn.jsdelivr.net/wp/themes/twenty-eightteen/1.7/assets/js/html5.js
  ```

* 官网示例，如图所示：

  ![image-20210111115415508](F:\LaGou\03-module\03-min-module\assets\image-20210111115415508.png)