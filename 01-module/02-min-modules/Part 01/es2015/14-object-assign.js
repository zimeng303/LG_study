// Object.assign 方法

const source1 = {
    a: 123,
    b: 123
}

const source2 = {
    c: 789,
    d: 789
}

const target = {
    a: 456,
    b: 456
}

const result = Object.assign(target, source1, source2)
// console.log(result);
// console.log(result == target);

function func (obj) {
    // obj.name = 'func obj'
    // console.log(obj);
    const funcObj = Object.assign({}, obj)
    funcObj.name = 'func obj'
}
const obj = { name: 'global obj' }
func(obj)
console.log(obj);