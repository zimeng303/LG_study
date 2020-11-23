module.exports = grunt => {
    // initConfig()接收一个对象{}形式的参数
    // 对象的属性名(键)，一般与任务名保持一致; 值可以是任意类型
    grunt.initConfig({
        str: 'string',
        obj: {
            property: 123
        }
    })

    grunt.registerTask('str', () => {
        // 通过config() 方法，获取对应属性的值，传入的参数是设置的属性名
        console.log(grunt.config('str'));  // string
    })
    grunt.registerTask('obj', () => {
        console.log(grunt.config('obj'));  // { property: 123 }
        console.log(grunt.config('obj.property'));  // 123
    })

    grunt.registerTask('tasklist', ['str', 'obj'])
}