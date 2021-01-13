@[TOC](NuxtJs 发布部署)

# Nuxt.js 发布部署

## 打包

Nuxt.js 提供了一系列常用的命令, 用于开发或发布部署。

| 命令          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| nuxt          | 启动一个热加载的 Web 服务器（开发模式）localhost:3000        |
| nuxt build    | 利用 webpack 编译应用，压缩 JS 和 CSS 资源（发布用）。       |
| nuxt start    | 以生产模式启动一个 Web 服务器 (需要先执行 `nuxt build`)。    |
| nuxt generate | 编译应用，并依据路由配置生成对应的HTML文件 (用于静态站点的部署)。 |

如果使用了 Koa/Express 等 Node.js Web 开发框架，并使用了 Nuxt 作为中间件，可以自定义 Web 服 务器的启动入口： 

| 命令                                         | 描述                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| NODE_ENV=development nodemon server/index.js | 启动一个热加载的自定义 Web 服务器（开发模 式）。             |
| NODE_ENV=production node server/index.js     | 以生产模式启动一个自定义 Web 服务器 (需要先执行 nuxt build)。 |

**参数** 

* 可以使用 <kbd><font color="#f00">--help</font></kbd> 命令来获取详细用法。

* 常见的命令有： 

  * <kbd><font color="#f00">--config-file</font></kbd> 或 <kbd><font color="#f00">-c:</font></kbd> 指定 <kbd><font color="#f00">nuxt.config.js</font></kbd> 的文件路径。
  * <kbd><font color="#f00">--spa</font></kbd> 或 <kbd><font color="#f00">-s: </font></kbd> 禁用服务器端渲染，使用SPA模式 
  * <kbd><font color="#f00">--unix-socket</font></kbd> 或 <kbd><font color="#f00">-n: </font></kbd> 指定UNIX Socket的路径。 

* 可以将这些命令添加至 `package.json`：

  ```json
  "scripts": { 
      "dev": "nuxt", 
      "build": "nuxt build", 
      "start": "nuxt start", 
      "generate": "nuxt generate" 
  } 
  ```

  这样可以通过 `npm run <command>` 来执行相应的命令。如: `npm run dev`。 

> **提示:**  
>
> ​	要将参数传递给npm命令，您需要一个额外的 --  脚本名称(例如： npm run dev --参数    --spa) 

**开发模式** 

* 可通过以下命令以开发模式启动带热加载特性的 Nuxt 服务： 

  ```powershell
  nuxt 
  # 或 
  npm run dev 
  ```

## 部署方式

* 配置 Host + Port

  * `nuxt.config.js`

  ```js
  module.exports = {
      server: {
          // 设置成 0.0.0.0 监听所有的网卡地址
          host: '0.0.0.0', // 访问地址 default localhost
          port: 3000       // 端口号 port
      },
  }
  ```

* 压缩发布包

  把下面图中标识的文件，进行压缩

  ![image-20210113090651729](F:\LaGou\03-module\03-min-module\assets\image-20210113090651729.png)

  > 说明：
  >
  > * `.nuxt`：NuxtJs 自动生成的资源文件
  > * `static`：存放静态资源
  > * `nuxt.config.js`：NuxtJs 的配置文件，为 Nuxt 服务提供支持
  > * `package.json` 和 `package-lock.json`：在服务端也需要安装第三方依赖包

* 把发布包传到服务端

  * 查看服务器地址：（阿里云服务器为例）

    ![image-20210113093829203](F:\LaGou\03-module\03-min-module\assets\image-20210113093829203.png)

  * 连接服务器(cmd 命令行、XShell ......)

    ```powershell
    ssh root@公网IP
    ```

    提示：`root@123.57.28.48's password`（输入密码），如图所示：

    ![image-20210113093224821](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113093224821.png)

    若忘记密码，则可以重置实例密码，如图所示：

    ![image-20210113094044154](F:\LaGou\03-module\03-min-module\assets\image-20210113094044154.png)

    ![image-20210113094114707](F:\LaGou\03-module\03-min-module\assets\image-20210113094114707.png)

  * 在服务器中创建文件夹，并进入该文件夹

    ```powershell
  mkdir realworld-nuxtjs
    cd realworld-nuxtjs/
    ```
  
  * 查看当前的目录路径

    ```powershell
  pwd
    ```
  
    输出结果 `/root/realworld-nuxtjs`，如图所示：

    ![image-20210113094941020](F:\LaGou\03-module\03-min-module\assets\image-20210113094941020.png)

  * 执行 `exit` 命令退出服务器，或者新开一个 cmd 窗口，将压缩包上传到服务器

    ```powershell
  scp .\realworld-nuxtjs.zip root@公网IP://root/realworld-nuxtjs
    ```
  
    ![image-20210113095420169](F:\LaGou\03-module\03-min-module\assets\image-20210113095420169.png)

    > `.\realworld-nuxtjs.zip` ：上传的文件路径
  >
    > `root@公网IP://root/realworld-nuxtjs`：上传至服务器的存放位置
  
* 解压

  * 重新连接服务器，并进入压缩包存放的目录，进行解压

  ```powershell
  unzip 压缩包名称
  ```

  运行效果，如图所示：

  ![image-20210113100122005](F:\LaGou\03-module\03-min-module\assets\image-20210113100122005.png)

  * 查看解压后的文件，`-a` 表示查看全部（包括隐藏目录）

    ```powershell
    ls -a
    ```

    可以看到全部的上传文件，如图所示：

    ![image-20210113100308270](F:\LaGou\03-module\03-min-module\assets\image-20210113100308270.png)

* 安装依赖

  * 使用命令，安装依赖

    ```powershell
    npm i
    ```

    安装成功，如图所示：

    ![image-20210113110958750](F:\LaGou\03-module\03-min-module\assets\image-20210113110958750.png)

    > <font color="#f00">注意：</font>
    >
    > * 如果没有安装 `node`，先要在服务器上安装 `node`，否则会报错
    > * node 安装教程：[云服务器 ECS(CentOS) 安装 Node](https://blog.csdn.net/zimeng303/article/details/112555709)

* 启动服务

  * 使用命令，启动 Web 服务
  
    ```powershell
    npm run start
    ```
  
    服务启动成功，如图所示：
  
    ![image-20210113111200373](F:\LaGou\03-module\03-min-module\assets\image-20210113111200373.png)
  
  * 访问 `公网Ip:port` ，如图所示：
  
     ![image-20210113143806152](F:\LaGou\03-module\03-min-module\assets\image-20210113143806152.png)

## pm2 启动 web 服务

`PM2` 是一个带有负载均衡功能的 Node 应用进程管理器。

* GitHub 仓库地址：[https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)

* 官网文档：[https://pm2.keymetrics.io/](https://pm2.keymetrics.io/)

* 安装：

  ```powershell
  npm install --global pm2
  ```

  执行结果，如图所示：

  ![image-20210113145046098](F:\LaGou\03-module\03-min-module\assets\image-20210113145046098.png)

* 配置软连接，类似于 环境变量

  ```powershell
  # ln -s pm2 二进制执行文件所在路径 /usr/local/bin(建立软连接的路径--环境变量)
  ln -s /usr/local/node-v14.15.4-linux-x64/bin/pm2 /usr/local/bin
  ```

* 进入项目文件所在目录，使用命令，启动服务：

  ```powershell
  pm2 start 脚本路径
  # pm2 start npm -- start
  ```

  启动成功，如图所示：

  ![image-20210113145944051](F:\LaGou\03-module\03-min-module\assets\image-20210113145944051.png)

* 关闭 pm2：

  ```powershell
  pm2 stop id
  # 或
  pm2 stop name
  # pm2 stop 0
  ```

  运行结果，如图所示：

  ![image-20210113150946153](F:\LaGou\03-module\03-min-module\assets\image-20210113150946153.png)

* **PM2 常用命令**

  | 命令        | 说明         |
  | ----------- | ------------ |
  | pm2 list    | 查看应用列表 |
  | pm2 start   | 启动应用     |
  | pm2 stop    | 停止应用     |
  | pm2 reload  | 重载应用     |
  | pm2 restart | 重启应用     |
  | pm2 delete  | 删除应用##   |

## 自动化部署

### 基本介绍

**传统的部署方式**

* 更新
  * 本地构建
  * 发布
* 更新
  * 本地构建
  * 发布
* ......

**现代化的部署方式（CI / CD）**

![image-20210113151039661](F:\LaGou\03-module\03-min-module\assets\image-20210113151039661.png)

**CI / CD 服务**

* Jenkins
* Gitlab CI 
* GitHub Actions
* Travis CI
* Circle CI
* ...

### GitGub Actions

#### 环境准备

* Linux 服务器
* 把代码提交到 GitHub 远程仓库

#### 配置 GitHub Access Token

* 生成：[https://github.com/settings/tokens](https://github.com/settings/tokens)

  * 登录 GitHub，点击右上角的 `+` 号，选择 `Settings`，点击 `Developer settings`，如图所示：

    ![image-20210113153017089](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113153017089.png)

  * 然后，选择 `Personal access tokens`，点击<kbd>`Generate new token`</kbd>，生成 Token，如图所示：

    ![image-20210113153215401](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113153215401.png)

  * 填写生成 Token 的相关信息，以及选择相关权限，如图所示：

    ![image-20210113153455261](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113153455261.png)

  * 生成Token，如图所示：

    ![image-20210113152710837](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113152710837.png)

* 配置到项目的 `Secrets` 中：[项目所在的 GitHub 地址](https://github.com/zimeng303/LG_study/tree/master/03-module/03-min-module/NuxtJs/realworld-nuxtjs)

  * 进入仓库，选择 `settings`，点击 `Secrets`，再点击 `New repository secret`，如图所示：

  ![image-20210113154218561](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113154218561.png)

  * 将刚才生成的 `token` 填入，如图所示：

  ![image-20210113154541539](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113154541539.png)

### 配置 GitHub Actions 执行脚本

* 在项目根目录创建 `.github/workflows` 目录

* 下载 `main.yml` 到 `workflows` 目录中

  * [https://github.com/lipengzhou/realworld-nuxtjs/edit/master/.github/workflows/main.yml](https://github.com/lipengzhou/realworld-nuxtjs/edit/master/.github/workflows/main.yml)

* 修改配置

  * 配置中，所用到的下载资源地址，修改为自己项目所在的远程仓库地址

  ![image-20210113161008930](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113161008930.png)

  * 将所需用到的 `HOST` 、`PORT`、`USERNAME`、`PASSWORD` ，配置到 Secrets 中

  ![image-20210113160648925](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113160648925.png)

* 配置 PM2 配置文件

  * 根目录下，新建 `pm2.config.json`

  ```json
  {
      "apps": [
          {
              "name": "RealWorld",
              "script": "npm",
              "args": "start"
          }
      ]
  }
  ```

* 提交更新

* 查看自动部署状态

* 访问网站

* 提交更新......



















