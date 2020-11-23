const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')


module.exports = grunt => {
    // grunt-sass 是一个npm的模块，他在内部通过npm依赖sass
    // grunt-sass 需要一个npm提供sass模块支持，因此两个模块都需要安装
    grunt.initConfig({
        sass: {   // 配置目标
            // implementation 用来指定grunt-sass中使用哪一个模块去处理sass的编译
            options: {
                sourceMap: true, // 编译时，生成对应的sourceMap文件
                implementation: sass
            },
            main: { // main目标中需要指定sass中的输入文件，以及最终输出的css的文件路径
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'    // 属性名(键)，需要输出的css的路径
                    // 属性值，需要输入的sass文件的源路径
                }
            }
        },
        babel: {
            options: { 
                sourceMap: true,
                // 指定转换所有ECMAScript中的特性
                presets: ['@babel/preset-env'] 
            },
            main: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        watch: {
            js: { // 此时不需要输出任何的文件，只需要监听源文件即可
                files: ['src/js/*.js'],
                // 设置当监听的文件发生改变时，需要去执行的任务
                tasks: ['babel']
            },
            css: { // .scss 就是sass的新扩展名
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            }
        }

    })

    // grunt.loadNpmTasks('grunt-sass')

    loadGruntTasks(grunt) // 自动加载所有的 grunt 插件中的任务

    // 使用映射，确保在启动时，运行各种编译任务，然后再启动监听
    grunt.registerTask('default', ['sass', 'babel', 'watch'])
}
