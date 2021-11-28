const arr = [7, 2, 5, 3, 6, 1, 4]

function computed (arr) {
    let result = []
    for (let i = 0; i < arr.length-1; i++) {
        for (let j = 1; j < arr.length; j++ ) {
           if (arr[j] > arr[i] && j > i) {
              result.push(arr[j] - arr[i])
           }
        }
    }
    return Math.max(...result)
}
console.log(computed(arr)); 


// @ts-check

/** @type {number}  */ 
let foo 

foo = 123

foo = '111'