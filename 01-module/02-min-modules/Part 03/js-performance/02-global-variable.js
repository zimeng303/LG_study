// 慎用全局变量

// 全局变量
var i, str = '';
for (i = 0; i < 1000; i++) {
    str += i;    
}

// 局部变量
for (let i = 0; i < 1000; i++) {
    let str = '';
    str += i;  
}