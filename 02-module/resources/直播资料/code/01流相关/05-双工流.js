// 可读就是生产数据， 可写就是消费数据， 双工就是既可读又可写  

let {Duplex} = require('stream')

class MyDuplex extends Duplex{
  constructor(source) {
    super()
    this.source = source
  }

  _read() {
    let data = this.source.shift() || null
    this.push(data)
  }
  _write(chunk, en, cb) {
    // 可写流的操作就是在内部想办法把将来传进来数据 chunk 给消费掉
    // 此时我选择的就是将传递进来的 chunk 写到标准输出当中 
    process.stdout.write(chunk.toString().toUpperCase())
    // 当前的回调函数必须在 chunk 处理完成之后执行
    // 这个执行一定要发生在chunk处理完之后
    process.nextTick(cb)
  }
}

let source = ['a', 'b', 'c']

let ds = new MyDuplex(source)

/* ds.on('data', (chunk) => {
  console.log(chunk.toString())
}) */

// 只要是一个可写流，那就一定可以调用 write 方法
ds.write('aaaaaa', 'utf-8', () => {
  console.log('再坚持一会，zce来接我')
})

/**
 * 流操作是必须的，如果想往后端走，必须要理解
 * 可读流就是生产数据
 * 可写流就是消费数据
 * 双工流可流可写 
 * 转换流
 *  转换流本质上也是一个双工流，与 Duplex 不同的是它不仅仅可以实现读写操作
 *  还可以在中间做自定义的数据转换，同时它的底层 读写操作是打通的，这点 Duplex 是不具备的。
 * src()
 *  .pipe(rename()) 
 *  .pipe(min-css())
 *  ....
 *  .dest('dist')
 * 
 *  gulp 里的插件都是用 Node写的，核心就是导出一个具备一定功能的 转换流
 *  
 */














