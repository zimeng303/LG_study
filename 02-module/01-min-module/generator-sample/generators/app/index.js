// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时，会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法，去实现一些功能，例如文件导入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    prompting () {
        // Yeoman 在询问用户环节会自动调用此方法
        // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问

        // 接收一个数组参数，数组的每一项都是一个问题对象
        return this.prompt([ // 返回一个 Promise对象
            {
                type: 'input', // 使用用户输入的方式，让用户提交信息
                name: 'name',  // 最终得到结果的一个键
                message: 'Your project name', // 在界面中给用户的提示，即问题
                default: this.appname // appname 为项目生成目录名称
            }
        ]).then(answers => { //用户输入之后的结果
            // answers => { name:'user input value' }
            this.answers = answers // 便于writing时使用
        })
    }
    writing () {
        // Yeoman 自动在生成文件阶段调用此方法
        // 我们这里尝试往项目目录中写入文件
        // this.fs.write(
        //     this.destinationPath('temp.txt'),
        //     Math.random().toString()
        // )

        // 通过模板方式写入文件到目标目录

        // 模板文件路径
        const tmpl = this.templatePath('bar.html')

        // 输出目标文件
        const output = this.destinationPath('bar.html')

        // 输出数据上下文
        // 此时使用用户输入数据，作为模板文件的上下文
        const context = this.answers 
        
        this.fs.copyTpl(tmpl, output, context)
    }

}