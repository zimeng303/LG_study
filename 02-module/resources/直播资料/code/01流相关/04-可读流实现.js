/**
 * 最开始的时候 ，js 操作字符串
 * node平台下 js 操作二进制（buffer)
 * 在使用 buffer 去执行数据 IO 的时候很不方便，因此就产生了流操作
 * Node.js 里有一个模块叫 stream ，它里面实现了四个类（ Readable Writable Duplex Transform ）
 * 我们在使用的时候分为二种情况：
 *  一种就是 Node.js 内置的核心模块，它们本身就继承了流操作。（fs, net ,http, zlib）
 *  另外一种就是在学习流操作时常做的行为，自定义流 
 */

let {Readable} = require('stream')

/**
 * 如果我们自己想要去模拟一个可读流有二步
 *  01 继承 Readable 类
 *  02 重写它里面的 _read() 方法
 */

class MyReadable extends Readable{
  constructor(source) {
    super()
    // 当前我们正在模拟的操作是可读流，它其实就是一个能够产生数据的 “黑盒”
    // 因此这些一来我们就需要给它提供一些数据，用于模拟  底层数据 （磁盘上文件里的数据、程序中变量里的数据）
    this.source = source
  }
  _read() {
    // 将来我们从可读流里拿数据的时候，就按照要求调用 push 方法
    // 当 push  被调用的时候，就会自动的往缓冲区里添加一个数据，供使用者将来去获取
    // 而且 push 每执行一次，就意味着底层数据（source）中字节长度会少一些
    // 所以终有一天，底层数据是会被消耗干的，这个时候我们需要告知缓存区，没数据了
    // 此时只需要给 push 传入一个 null 值就可以了。
    let data = this.source.shift() || null
    this.push(data)
  }
}
// 当前我利用一个数组存放数据来模拟底层数据
let source = ['zce', 'zcegg', 'syy']

// 01 可读流就是专门用于生产数据的流，我们也叫做数据源
// 02 在 pipe 管道设计中，可读流是处于 pipe 左侧的，也就是上游
let rs = new MyReadable(source)

// 03 请求，我闲着没事，造了一个可读流干吗？---》 如何来消费流当中的数据
// 数据的生产者，数据的消费者

// 04 对于 Readable 来说，它本身提供了二个事件用于我们消费数据。（data ,readable)

// 这里的 rs 居然能用 on 来订阅一个事件，就是因为 fs 模块不仅仅继承了 stream ，还继承了EventEmitter 类
rs.on('data', (chunk) => {
  console.log(chunk.toString())
})