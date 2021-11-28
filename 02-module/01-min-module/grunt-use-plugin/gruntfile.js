// grunt 插件中的命名方式：grunt-contrib-pluginname
module.exports = grunt => {
    // grunt-contrib-clean 插件，用来清除在项目开发过程中产生的临时文件
    // grunt-contrib-clean 插件中所提供的任务，是一种多目标任务，因此需要在 initConfig() 中进行配置。
    grunt.initConfig({
        clean: {
            temp: 'temp/app.js', // 所要清除的文件的具体路径
            allTxt: 'temp/*.txt', // 使用通配符*，删除所有txt文件
            allFiles: 'temp/**'   // 使用**的形式，删除temp整个文件夹

        }
    })
    
    // 使用 loadNpmTasks() 方法，加载插件中提供的任务，接收一个参数，参数为插件名称
    grunt.loadNpmTasks('grunt-contrib-clean')
}