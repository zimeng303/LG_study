// 数组的解构

const arr = [100, 200, 300]
// const foo = arr[0]
// const bar = arr[1]
// const baz = arr[2]

// console.log(foo, bar, baz)

// const [foo, bar, baz] = arr
// console.log(foo, bar, baz)

// const [, , baz] = arr
// console.log(baz);

// ...xx 表示从当前位置开始的所有成员
// ...xx 这种只能在解构位置的最后一个成员上使用
// const [foo, ...rest] = arr
// console.log(rest);

// const [foo, bar, baz, more = 'default value'] = arr
// console.log(more);

const path = '/foo/bar/baz'
// const tmp = path.split('/')
// const rootdir = tmp[1]

const [, rootdir] = path.split('/')
console.log(rootdir);

