let fs = require('fs')

// 下面的 alloc 感觉上是你自己在申请一片内存空间，没毛病
// 但是它的回收操作 仍然是 V8 的 GC 在做。
let buf = Buffer.alloc(100)

/* fs.open('test.txt', 'r', (err, fd) => {
  console.log(fd)
  // fd 是什么   读出来的内容我放哪 
  // 内存在哪，我怎么找得到
  // 读就是写：将数据从磁盘文件中读出，然后写到一个中间缓存状态的内存中
  // 这样操作的好处就是，由于一个中间缓存的存的，那么就避免了我们直接将大量的数据丢到“内存”
  fs.read(fd, buf, 1, 11, 1, (err, bytesRead, buffer) => {
    console.log(buffer)
  })
}) */
buf = Buffer.from('zce是个帅哥')
fs.open('test.txt', 'w', (err, fd) => {
  // 此时我们已经准备好了一个文件，然后可以将中间缓存中的数据写入到这个文件中了
  // 所以我们现在需要准备一个装有数据的中间缓存，然后再调用 API 去执行写入操作
  // 写就是读： 将缓冲内存里的数据先读出来，我后再写入到磁盘文件中
  fs.write(fd, buf, 3 ,6, 0, (err, written, buffer) => {
    console.log('写入操作执行成功了')
  })
})