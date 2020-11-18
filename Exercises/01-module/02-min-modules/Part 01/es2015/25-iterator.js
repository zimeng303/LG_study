// 迭代器 (Iterable)

const set = new Set(['foo', 'bar', 'baz'])

const iterator = set[Symbol.iterator]();

console.log(iterator.next()); 
console.log(iterator.next()); 
console.log(iterator.next()); 
console.log(iterator.next()); 
console.log(iterator.next()); 