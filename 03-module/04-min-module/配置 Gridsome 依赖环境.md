@[TOC](配置 Gridsome 依赖环境)

# 配置 node-gyp 编译环境

- Github 网址：[https://github.com/nodejs/node-gyp](https://github.com/nodejs/node-gyp)

## 安装过程

* 安装 `node-gyp`

  ```powershell
  npm install -g node-gyp
  ```

  安装成功，如图所示：

  ![image-20210120155900253](F:\LaGou\03-module\04-min-module\assets\image-20210120155900253.png)

* `node-gyp` 依赖 C++ 环境，需要根据不同的操作系统，安装 `Python`，此处以 `windows` 为例

  * python 官网：[https://www.python.org/](https://www.python.org/)
  * 具体安装，请百度

* 安装 `windows-build-tools` 工具

  ```powershell
  npm install -g windows-build-tools
  ```

- 配置环境变量：`npm_config_sharp_libvips_binary_host` 为 `https://npm.taobao.org/mirrors/sharp-libvips/`
  - https://github.com/lovell/sharp-libvips
  - https://developer.aliyun.com/mirror/NPM
  - https://npm.taobao.org/mirrors
  - https://sharp.pixelplumbing.com/install
    - `npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"`
    - `npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"`
- 配置 hosts：`199.232.68.133  raw.githubusercontent.com`
  - https://www.ipaddress.com/