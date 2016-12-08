var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css');


gulp.task('css-fix', function () {
    gulp.src('css/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('css/build'));
});
gulp.task('js-min', function () {
    gulp.src('js/hammer.js')
        .pipe(uglify())
        .pipe(gulp.dest('js/hammer.min.js'));
});