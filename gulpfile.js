const { src, dest }  = require("gulp");
const gulp = require('gulp')
const minify = require("gulp-minify");
const cleanCss = require('gulp-clean-css');

function minifyjs() {
    return src('./src/logic.js', { allowEmpty: true }) 
        .pipe(minify({noSource: true}))
        .pipe(dest('./src'))
}

gulp.task('minify-css', function() {
    return gulp.src('./src/main.min.css')
      .pipe(cleanCss({compatibility: 'ie8'}))
      .pipe(gulp.dest('./src/'));
  });


exports.default = minifyjs;