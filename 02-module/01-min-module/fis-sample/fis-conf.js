// 利用 fis 资源定位
// match() 的第一个参数，是指选择器
// 后面的参数，是对于匹配到的文件的配置
fis.match('*.{js,scss,png}', { 
    release: '/assets/$0' // $0 指的是当前文件的原始结构
})

fis.match('**/*.scss', {
    rExt: '.css',                   // 修改编译后的扩展名
    parser: fis.plugin('node-sass'), // 自动载入编译插件 
    optimizer: fis.plugin('clean-css') // css的压缩插件，内置插件
})

fis.match('**/*.js', {
    parser: fis.plugin('babel-6.x'), // 自动载入编译插件 
    optimizer: fis.plugin('uglify')  // js的压缩插件，内置插件
})

