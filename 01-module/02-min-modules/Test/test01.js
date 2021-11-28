const arr = [1, 5, 10, 25, 26]

const sum = 47;

function compute (arr, sum) {
    const max = Math.max(...arr)
    for (const item of arr) {
        const c = sum - (max + item)
        if (arr.indexOf(c) != -1) {
            return [c, item, max]
        } 
    }
    
}
console.log(compute(arr, sum)); 


function getMinCoins(coins) {

    return function(amount) {
      let res = 0, change = []
      for(let i= coins.length; i>=0; i--) {
        let coin = coins[i]
        //从大到小试
        while(res + coin <= amount) {
          change.push(coin)
          res += coin
        }
      }
      return change
    }}
  newF = getMinCoins([1,5,10,25])
  console.log(newF(47)); 



