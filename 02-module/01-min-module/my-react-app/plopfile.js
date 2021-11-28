// Plop 入口文件，需要导出一个函数
// 此函数接收一个 plop对象，并且提供了一系列的工具函数，用于创建生成器任务

module.exports = plop => {
    /**
     * setGenerator() 方法接收两个参数，
     * 一，生成器的名字
     * 二，生成器的配置选项
     */ 
    plop.setGenerator('component', {
        description: 'create a component',
        prompts: [ // 指定Generator在执行时，发出的命令行问题
            {
                type: 'input',
                name: 'name',
                message: 'component name',
                default: 'MyComponent'
            }
        ], // 完成命令行交互过后，需要执行的动作
        actions: [ // 数组中的每一个对象，都表示一个动作对象
            {   
                // type指定动作的类型，add代表添加一个全新的文件
                type: 'add', 
                // path指定新添加的文件会被添加到哪一个具体的路径下
                // 可以通过{{}}插值表达式的形式，去动态插入刚才用户输入的数据
                path: 'src/components/{{name}}/{{name}}.js',
                /** 
                 * 指定模板文件，模板文件采用Handlebars模板引擎进行书写
                 * 模板文件一般放置在根目录下的plop-templates下的components.hbs文件中
                 */
                templateFile: 'plop-templates/components.hbs'
            },
            {
                type: 'add',
                path: 'src/components/{{name}}/{{name}}.css',
                templateFile: 'plop-templates/components.css.hbs'
            },
            {
                type: 'add',
                path: 'src/components/{{name}}/{{name}}.test.js',
                templateFile: 'plop-templates/components.test.hbs'
            }
        ]
    })
}