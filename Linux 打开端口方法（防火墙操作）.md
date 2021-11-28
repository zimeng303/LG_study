# [Linux 打开端口方法（防火墙操作）](https://www.cnblogs.com/rh-fernando/p/11340057.html)

 

# [Linux防火墙操作](https://www.cnblogs.com/rh-fernando/p/11805007.html)（经测试部分命令无效）

关闭防火墙:service iptables stop

开启防火墙:service iptables start

防火墙状态:service iptables status

永久关闭:chkconfig iptables off

永久开启:chkconfig iptables on

方法一(命令):

  \1. 开放端口命令： /sbin/iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

  2.保存：/etc/rc.d/init.d/iptables save

  3.重启服务：/etc/init.d/iptables restart

  4.查看端口是否开放：/sbin/iptables -L -n

方法二(修改文本):

  1.修改文件: vi /etc/sysconfig/iptables

  2.在文本中加入一行:-A INPUT -p tcp -m tcp --dport 8080 -j ACCEPT

  

 3.重启服务:service iptables restart

 4.查看端口命令:service iptables status

关闭端口(命令):

  /sbin/iptables -I INPUT -p tcp --dport 8080 -j ACCEPT 

sudo iptables -A OUTPUT -p tcp --dport $PORT -j DROP"  

  其他命令同方法一(命令)

关闭端口(删除文本):

  vi /etc/sysconfig/iptables

  其他命令同方法二(修改文件)

@[TOC](云服务器 ECS (CentOS)防火墙操作)

* 1， 查看防火墙状态：

  ```powershell
  firewall-cmd --state
  # 或
  systemctl status firewalld.service
  ```

  执行结果，如图所示：

  ![image-20210113120448383](F:\LaGou\assets\image-20210113120448383.png)

* 2， 开启防火墙：

  ```powershell
  systemctl start firewalld.service
  ```

* 3，设置开机自启：

  ```powershell
  systemctl enable firewalld.service
  ```

* 4， 重启防火墙：

  ```powershell
  firewall-cmd --reload
  # 或
  systemctl restart firewalld.service
  ```

  执行结果，如图所示：

  ![image-20210113135624745](F:\LaGou\assets\image-20210113135624745.png)

* 5， 查看防火墙设置开机自启是否成功：

  ```powershell
  systemctl is-enabled firewalld.service;echo $?
  ```

* 6，关闭防火墙：

  ```powershell
  systemctl stop firewalld.service
  ```

* 7，开端口命令：
  * 打开单个端口，`3306` 为端口号：

  ```powershell
  firewall-cmd --zone=public --add-port=3306/tcp --permanent
  ```
  * 打开多个端口，`20000-29999` 端口号范围内的都生效：

  ```powershell
  firewall-cmd --zone=public --add-port=20000-29999/tcp --permanent
  ```
  * <font color="#f00">注意：</font>`=` 前后不要加空格，否则命令报错，如图所示：

  ![image-20210113140149308](F:\LaGou\assets\image-20210113140149308.png)

  > `--permanent` 为永久生效，不加为单次有效（重启失效）

* 8，查看开启端口：

  ```powershell
  netstat -ntlp 
  # 或
  firewall-cmd --list-ports
  ```

* 9，关闭端口命令：

  ```powershell
  firewall-cmd --zone=public --remove-port=3306/tcp --permanent
  ```

* 10、查看端口是否打开

  ```powershell
  firewall-cmd --zone=public --query-port=3306/tcp
  ```