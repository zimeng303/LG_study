// 箭头函数
// function inc (number) {
//     return number + 1
// }


// const inc = n => n + 1
// console.log(inc(100));

const arr = [1, 2, 3, 4, 5, 6, 7]

// const newArr = arr.filter(function (item) {
//     return item % 2 == 1
// })
const newArr = arr.filter(item => item % 2 == 1)
console.log(newArr);