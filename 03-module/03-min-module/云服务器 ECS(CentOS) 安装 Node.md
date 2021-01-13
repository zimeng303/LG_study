@[TOC](云服务器 ECS(CentOS) 安装 Node)

* 首先，登录服务器，打开命令行窗口（XShell ......），输入以下命令：

```powershell
ssh root@云服务器公网IP
```

回车，提示：`root@123.57.28.48's password`（输入密码），连接成功，如下图所示：

![image-20210113093224821](F:\LaGou\03-module\03-min-module\assets\image-20210113093224821.png)

* 进入想要存放软件安装包的目录下，此处选择 `/usr/local` 目录

```powershell
cd /usr/local/
```

> 安装目录，可参考 【[Linux目录详解，软件应该安装到哪个目录](https://blog.csdn.net/zimeng303/article/details/112555401)】

* 使用 `wget` 命令，下载 `node` 资源包

```powershell
wget https://npm.taobao.org/mirrors/node/v版本号/node-v版本号-linux-x64.tar.xz
```

![image-20210113101647090](F:\LaGou\03-module\03-min-module\assets\image-20210113101647090.png)

* 解压 `node` 资源包：

```powershell
tar -xvf node-v14.15.4-linux-x64.tar.xz
```

* 查看解压后的文件中，是否包含  `node`、`npm`、`npx ` 二进制可执行文件

```powershell
cd node-v14.15.4-linux-x64/bin/
ls
```

解压出来的 `bin` 目录里存在 `node`、`npm`、`npx ` 二进制可执行文件，如图所示：

![image-20210113102147837](F:\LaGou\03-module\03-min-module\assets\image-20210113102147837.png)

* 但是，此时还不能全局使用 `node` 命令，需要建立软连接，使其变为全局，类似于 `windows` 系统配置环境变量。

软连接，其实就是一个快捷方式，把 `/usr/local/node-v10.13.0-linux-x64/bin/` 下的 `npm` 、`node`、`npx` 二进制可执行文件的快捷方式放到 `/usr/local/bin/` 里，具体实现如下：

```powershell
ln -s /usr/local/node-v14.15.4-linux-x64/bin/node /usr/local/bin
ln -s /usr/local/node-v14.15.4-linux-x64/bin/npm /usr/local/bin
ln -s /usr/local/node-v14.15.4-linux-x64/bin/npx /usr/local/bin
```

* 查看是否配置成功

  ```powershell
  node -v
  npm -v
  npx -v
  ```

  运行效果，如图所示：

  ![image-20210113103204956](F:\LaGou\03-module\03-min-module\assets\image-20210113103204956.png)