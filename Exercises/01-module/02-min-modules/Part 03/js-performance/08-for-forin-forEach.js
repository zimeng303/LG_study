var arrList = new Array(1, 2, 3, 4, 5)

arrList.forEach(function (item) {
    console.log(item);
})

for (var i = 0, len = arrList.length; i < len; i++) {
    console.log(arrList[i]);
}

for (var i in arrList) {
   console.log(i);
}