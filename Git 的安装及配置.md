@[TOC](Git 的安装及配置)

# Git 的下载

* 官网下载：[https://git-scm.com/download/

  ![image-20210106151207619](F:\LaGou\assets\image-20210106151207619.png)

> <font color="#f00">注意：</font>
>
> ​	根据不同的操作系统，选择不同的 Git 版本，本机选择 windows

* windows 操作系统，需要选择 `32 bit` 或者 `64 bit`，本机选择 64 bit

  ![image-20210106151416665](F:\LaGou\assets\image-20210106151416665.png)

# Git 的安装

![image-20210106152216768](F:\LaGou\assets\image-20210106152216768.png)



![image-20210106152445467](F:\LaGou\assets\image-20210106152445467.png)

![image-20210106152557910](F:\LaGou\assets\image-20210106152557910.png)

![image-20210106153257851](F:\LaGou\assets\image-20210106153257851.png)

![image-20210106153416236](F:\LaGou\assets\image-20210106153416236.png)

![image-20210106153512784](F:\LaGou\assets\image-20210106153512784.png)

![image-20210106153127137](F:\LaGou\assets\image-20210106153127137.png)

![image-20210106153620998](F:\LaGou\assets\image-20210106153620998.png)

![image-20210106154039136](F:\LaGou\assets\image-20210106154039136.png)

![image-20210106154101036](F:\LaGou\assets\image-20210106154101036.png)

![image-20210106154114978](F:\LaGou\assets\image-20210106154114978.png)

![image-20210106154126657](F:\LaGou\assets\image-20210106154126657.png)

![image-20210106154142857](F:\LaGou\assets\image-20210106154142857.png)

![image-20210106154240253](F:\LaGou\assets\image-20210106154240253.png)

![image-20210106154334483](F:\LaGou\assets\image-20210106154334483.png)

![image-20210106154450556](F:\LaGou\assets\image-20210106154450556.png)

* 设置用户名：

  ```git 
  git config -- global user.name 'gitee上注册的用户名';
  ```

* 设置用户邮箱：

  ```git
  git config -- global user.email 'gitee上注册的邮箱';
  ```

  ![image-20210106155405993](F:\LaGou\assets\image-20210106155405993.png)

# 配置 Git  的密钥

* 命令

  ```powershell
  ssh-keygen -t rsa -C "gitee上注册的邮箱"
  ```

  ![image-20210106160207170](F:\LaGou\assets\image-20210106160207170.png)

* 密钥生成位置 `C:\Users\86135\.ssh\id_rsa.pub`

  ![image-20210106160518284](F:\LaGou\assets\image-20210106160518284.png)

* gitee 配置 ssh 公钥

  ![image-20210106161053104](F:\LaGou\assets\image-20210106161053104.png)

  ![image-20210106161317097](F:\LaGou\assets\image-20210106161317097.png)

* github，配置 ssh 公钥

  ![image-20210106162303999](F:\LaGou\assets\image-20210106162303999.png)

