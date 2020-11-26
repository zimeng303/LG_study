const arr = [2,3,1,1,4,0,4] 

// const arr = [3,2,1,0,4]


function isArriveMaxPos (arr) {
     // 从第一个位置到最后一个位置，最多跳 len - 1 步
    let index = 0, len = arr.length 
    let falg = false
    while(index < len) {     
        index += arr[index] 
        if (index >= len - 1) {
            falg = true
        } else if(arr[index] == 0) {
            break
        }
    }
    return falg
}

console.log(isArriveMaxPos(arr))
