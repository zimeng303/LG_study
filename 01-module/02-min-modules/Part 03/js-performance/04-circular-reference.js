
function fn () {
    const obj1 = {}
    const obj2 = {}

    obj1.name = obj2  // obj1 和 obj2之间的引用数字不为0
    obj2.name = obj1  // 引用计数算法无法回收，会造成内存浪费

    return 'lg is a coder'
}

fn()