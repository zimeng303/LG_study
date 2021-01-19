@[TOC](使用 mwget 解决 wget下载速度太慢的问题)

* **测试 wget 的下载速度**

  ```powershell
  timeout 30s wget url
  ```

> 超出规定的时间，下载结束，即下载失败

* **下载 mwget 资源文件**

  ```powershell
  wget http://jaist.dl.sourceforge.net/project/kmphpfm/mwget/0.1/mwget_0.1.0.orig.tar.bz2
  ```

  下载成功，如图所示：

  ![image-20210113223132358](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113223132358.png)

* **解压 mwget 资源包**

  ```powershell
  tar -xjvf mwget_0.1.0.orig.tar.bz2
  ```

  解压后的文件列表，如图所示：

  ![image-20210113223515263](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113223515263.png)

* **编译安装**

  ```powershell
  cd mwget_0.1.0.orig/
  ./configure --prefix=/opt/mwget
  ```

  * 如果提示: `configure: error: Your intltool is too old.  You need intltool 0.35.0 or later` ，如图所示：

    ![image-20210113223938450](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113223938450.png)

    * 安装 intltool，版本为 `0.35.0 or later`

    ```powershell
    yum install intltool
    # wget http://ftp.gnome.org/pub/gnome/sources/intltool/0.40/intltool-0.40.6.tar.gz
    # tar zxvf intltool-0.40.6.tar.gz
    # cd intltool-0.40.6
    ```

    ![image-20210113224309097](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113224309097.png)

  * 如果提示：`error: C++ compiler cannot create executables `，说明没有安装c++编译器，安装 `c++` 编译器

    ```powershell
    yum install gcc-c++ 
    ```

  再次进行配置

  ```powershell
  ./configure
  ```

  运行结果，如图所示：

  ![image-20210113224750626](C:\Users\86135\AppData\Roaming\Typora\typora-user-images\image-20210113224750626.png)

  执行如下命令：

  ```powershell
  make 
  make install
  ```

* **配置软连接**

  ```powershell
  ln -s /usr/bin/mwget /usr/local/bin
  ```

  