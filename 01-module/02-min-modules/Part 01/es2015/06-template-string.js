// 带标签的模板字符串

// const str = console.log`hello world`

const name = 'tom'
const gender = true

function myTagFunc (strings, name, gender) {
    // console.log(strings, name, gender);
    const sex = gender ? 'man' : 'woman'
    return strings[0] + name + strings[1] + gender + strings[2]
}

const result = myTagFunc`hey, ${name} is a ${gender}`
console.log(result);



