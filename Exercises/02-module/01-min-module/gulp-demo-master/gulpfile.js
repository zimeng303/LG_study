const { src, dest, parallel, series, watch } = require('gulp')

// 文件清除，不是 gulp 的插件
const del = require('del')

// 开发服务器
const browserSync = require('browser-sync')

// 自动加载全部插件
const loadPlugins = require('gulp-load-plugins')

// // 返回一个 plugins的对象
const plugins = loadPlugins() 
// { babel: [Getter], imagemin: [Getter], sass: [Getter], swig: [Getter] }

// browserSync() 提供一个方法，用于创建服务器
const bs = browserSync.create()

// 页面中存在的动态数据
const data = {
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

// 创建临时文件 temp

// 清除文件
const clean = () => { 
    return del(['dist', 'temp'])
}

// 样式编译
const style = () => {
    // 通过添加配置选项base属性，设置转换的基准路径，这样就会把src后面的一系列路径保留下来
    return src('src/assets/styles/*.scss', { base: 'src' })
        // outputStyle 属性，指定转换后的css文件按照完全展开的格式进行生成
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 以文件流的方式，往浏览器推
}

// 脚本编译
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 以文件流的方式，往浏览器推
}

// 页面模板编译
const page = () => {
    return src('src/*.html', { base: 'src' })
        // 使用plugins.swig模板引擎时，会将一些数据使用 {{}} 形式，进行动态加载
        // 因此，需要将所加载的数据，添加到配置选项中
        .pipe(plugins.swig({ data }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true })) // 以文件流的方式，往浏览器推
}

// 图片压缩编译
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

// 字体文件编译
const font = () => {
    // 字体文件可以直接拷贝进目标文件，但存在 .svg文件，因此可以使用plugins.imagemin() 进行转换
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

// 其他文件编译
const extra = () => {
    // 直接拷贝的方式
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

// 自动唤醒浏览器，打开对应的网站
const serve = () => {
    /**
     * watch 方法接收两个参数
     * 第一个参数globs，即监听文件的路径，可以使用通配符
     * 第二个参数，即需要执行的任务，一般是设置编译的任务
     */
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)
    // 下面操作会增加构建过程
    // watch('src/assets/images/**', image)
    // watch('src/assets/fonts/**', font)
    // watch('public/**', extra)

    // 文件变化时，自动更新浏览器
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)

    // 初始化web服务器的核心配置
    bs.init({
        notify: false,     // 禁止弹出 “是否连接browser-sync” 提示
        port: 2080,        // 设置启动端口号，默认 3000
        // open: false,    // 设置是否在启动服务器时，自动打开浏览器
        // files: 'dist/**',// 设置哪些文件被监听，使其改变时自动更新浏览器，使用watch时，此属性可以省略，
        server: {
           // 减少构建过程，使图片、字体、其他文件使用'src', 'public'中的
           // 当在dist目录下找不到文件时，会依次往下查找
           baseDir: ['temp', 'src', 'public'],  // 指定网站的根目录
           routes: { // 将某一个路径(key)指定为另一个路径(value) 优先于 baseDir
            '/node_modules': 'node_modules'
           }
        }
    })
}

// 文件引用处理
const useref = () => {
    return src('temp/*.html', { base: 'dist' })
            .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
            // html js css 
            .pipe(plugins.if(/\.js$/, plugins.uglify()))
            .pipe(plugins.if(/\.css$/, plugins.cleanCss()))           
            .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
                // collapseWhitespace选项属性，清除所有的空白字符，否则只默认删除空格符
                collapseWhitespace: true,
                minifyCSS: true, // 压缩页面内的 style标签
                minifyJS: true   // 压缩页面内的 script标签
            })))
            .pipe(dest('temp'))
}

// 创建并行任务，完成 src目录下面需要编译的文件
const compile = parallel(style, script, page)

// 上线之前执行的任务
const build = series(
    clean, 
    parallel(
        series(compile, useref), 
        image, 
        font, 
        extra
    ))

const develop = series(clean, compile, serve)

module.exports = {
    clean,
    build,     // 生产打包
    develop    // 开发
}
