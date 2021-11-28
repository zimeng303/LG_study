import { forEach } from './utils.js'

const app = document.getElementById('app')
console.log(app.innerHTML);

const arr = [1, 2, 3]
forEach(arr, item => {
    console.log(item);
})