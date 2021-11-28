@[TOC](cmd 命令)

**查看指定端口的占用情况**

```cmd
netstat -aon|findstr "端口号"
```

查询结果，如图所示：

协议          本地地址                     外部地址                    状态                PID

![image-20210112225259566](F:\LaGou\assets\image-20210112225259566.png)

**直接强制杀死指定端口**

```cmd
taskkill /pid 9632 -t -f
taskkill /pid 8260 -t -f
```

执行结果，如图所示：

![image-20210112225614456](F:\LaGou\assets\image-20210112225614456.png)

![image-20210112225552411](F:\LaGou\assets\image-20210112225552411.png)