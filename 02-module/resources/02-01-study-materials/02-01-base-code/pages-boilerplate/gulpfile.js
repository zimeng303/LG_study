// 实现这个项目的构建任务

// 安装 gulp 依赖，引入 gulp 提供的 src、dest方法 创建读取流、写入流
// 需要使用 series, parallel 方法，使任务可以串行或并行
// 使用 Watch方法用于监视源文件。当对源文件进行任何更改时，自动运行适当的任务

const { src, dest, series, parallel, watch } = require('gulp')

// 导入 del 插件，清除指定文件
const del = require('del')

// 导入 browser-sync 插件，开启服务器
const bs = require('browser-sync')

// 为了减少插件的导入加载次数，使用 gulp-load-plugins 插件自动加载所用到的插件
// 此插件返回了 plugins 对象

const plugins = require('gulp-load-plugins')()


// 定义路径数据的配置变量
const config = {
    build: {
        dist: 'dist',    // 部署目录
        temp: 'temp',    // 临时目录
        public: 'public',
        src: 'src',
        path: {
            fonts: 'assets/fonts/**',
            images: 'assets/images/**',
            scripts: 'assets/scripts/*.js',
            styles: 'assets/styles/*.scss',
            pages: '*.html'
        }
    },
    data: {
        menus: [
            {
                name: 'Home',
                icon: 'aperture',
                link: 'index.html'
            },
            {
                name: 'Features',
                link: 'features.html'
            },
            {
                name: 'About',
                link: 'about.html'
            },
            {
                name: 'Contact',
                link: '#',
                children: [
                    {
                        name: 'Twitter',
                        link: 'https://twitter.com/w_zce'
                    },
                    {
                        name: 'About',
                        link: 'https://weibo.com/zceme'
                    },
                    {
                        name: 'divider'
                    },
                    {
                        name: 'About',
                        link: 'https://github.com/zce'
                    }
                ]
            }
        ],
        pkg: require('./package.json'),
        date: new Date()
    }
}

// 使用 del 插件返回的方法，将上一次生成的temp和dist目录清除，重新创建
const clean = () => del([config.build.dist, config.build.temp])

// 定义 style 任务，编译样式文件
const style = () => {
    /**
     * 利用 pipe() 将读取流存入到新的写入流中
     * 设置 base，保证写入的路径不包含设置的路径
     * 此时采用的是sass语法，需将其转换成css后进行写入
     * 使用 gulp-sass 插件转换，但他又依赖sass模块，因此都要安装
     * 
     * 设置outputStyle属性，让生成的css中的{}可以完全展开
     */
    return src(config.build.path.styles, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest(config.build.temp))
}

// 定义 script 任务，编译js文件
const script = () => {
    /**
     * 在js文件中，使用了 ES6+ 新特性，为了保证低版本浏览器的兼容性，
     * 使用 gulp-babel 插件转换为 ES5 语法，
     * 另需要 @babel/core核心库和 @babel/preset-env 预设库进行支持
     */
    return src(config.build.path.scripts, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
        .pipe(dest(config.build.temp))
}

// 定义 page 任务，编译 HTML文件
const page = () => {
    /**
     * 在HTML页面采用swig模板引擎的写法进行书写，
     * 需要借助 gulp-swig 插件，将动态数据进行传入
     * 在上面的config中添加传入的配置数据
     */
    return src(config.build.path.pages, { base: config.build.src, cwd: config.build.src })
            .pipe(plugins.swig({ data: config.data }))
            .pipe(dest(config.build.temp)) // 写入到临时文件中
}

// 定义 font 任务，需要将字体压缩后，打包进部署目录，临时目录可以不用放置
// 因为字体中包含svg文件，因此可以使用 gulp-imagemin插件进行压缩
const font = () => {
    return src(config.build.path.fonts, { base: config.build.src, cwd: config.build.src })
            .pipe(plugins.imagemin())
            .pipe(dest(config.build.dist))
}

// 定义 image 任务，需要将图片压缩后，打包进部署目录，临时目录可以不用放置
const image = () => {
    /**
     * 使用 gulp-imagemin 插件压缩图片，此时是无损压缩
     */
    return src(config.build.path.images, { base: config.build.src, cwd: config.build.src })
            .pipe(plugins.imagemin())
            .pipe(dest(config.build.dist))
}

// 定义 extra 任务，将public中的文件直接拷贝进dist中即可，无需其他操作
const extra = () => {
    return src(config.build.public, { base: config.build.public, cwd: config.build.public })
            .pipe(dest(config.build.dist))
}

// 定义 useref 任务，处理构建注释，压缩HTML、CSS、JS，存放到部署目录dist
const useref = () => {
    /**
     * 编译HTML文件后，temp中生成的HTML文件存在构建注释
     * 使用 gulp-useref 对构建注释进行处理
     * 
     * 在处理构建注释后，写入到部署目录dist之前，需要将css、js、html文件进行压缩
     * 采用 gulp-if 判断文件类型，然后再根据不同的文件类型，采用不同的压缩文件
     * 压缩 html: gulp-htmlmin
     * 压缩 css: gulp-clean-css
     * 压缩 js: gulp-uglify
     */
    return src('*.html', { base: config.build.temp, cwd: config.build.temp })
            .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
            .pipe(plugins.if(/\.js$/, plugins.uglify()))
            .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
            .pipe(plugins.if(/\.html$/, plugins.htmlmin({
                collapseWhitespace: true, // 清空空白符
                minifyCSS: true,          // 压缩页面内的style标签
                minifyJS: true            // 压缩页面内的script标签
            })))
            .pipe(config.build.dist)
}

// 定义 serve 任务，开启服务器
const serve = () => {
    // 使用 watch() 方法监听源文件的改变，实时更新浏览器页面
    watch(config.build.path.styles, { cwd: config.build.src }, style)
    watch(config.build.path.scripts, { cwd: config.build.src }, script)
    watch(config.build.path.pages, { cwd: config.build.src }, page)
    watch([
        config.build.path.images,
        config.build.path.fonts
    ], { cwd: config.build.src }, bs.reload)
    watch('**', { cwd: config.build.public }, bs.reload)

    // 初始化 web服务器 的核心配置
    bs.init({
        notify: false, // 取消  Browsersync service 提示
        port: 8080, // 设置服务器启动的端口号
        server: {   // 设置服务器的默认站点
            baseDir: [config.build.temp, config.build.src, config.build.public],
            routes: { // 将某一个路径(key)指定为另一个路径(value) 优先于 baseDir
                '/node_modules': 'node_modules'
            }
        }
    })
}

// 并行任务，同时编译 src 目录下的样式、js、页面文件
const compile = parallel(style, script, page)

// 串行任务，存在先后顺序，需要向清理旧的dist和temp文件
// 部署时，需要将图片字体等进行编译，其余任务可以同时执行
// 在执行useref之前，需要先执行compile，否则无法处理HTML中的构建注释，串行任务
const build = series(
    clean, 
    parallel(
        series(compile, useref), 
        image, 
        font, 
        extra
    )
)

// 开发过程中，可以不对图片字体等进行压缩，减少任务执行次数，提高效率
const develop = series(clean, compile, serve)

module.exports = {
    clean,
    compile,
    build,
    develop
}