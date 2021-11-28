const { src, dest } = require('gulp')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')

exports.default = () => {
    return src('src/*.css')
        .pipe(cleanCss())
        .pipe(rename({ extname: '.min.css' })) // extname 属性，用于指定重命名的扩展名
        .pipe(dest('dist')) // 写入目标目录
}