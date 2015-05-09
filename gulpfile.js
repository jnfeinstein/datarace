var buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    ngHtml2Js = require("gulp-ng-html2js"),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(cb) {
  del(['www'], cb);
})

gulp.task('templates', function() {
  return gulp.src("./client/**/*.html")
    .pipe(ngHtml2Js({
      moduleName: "templates"
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest("./www"));
});

gulp.task('scripts', function() {
  return browserify('./client/index.js', { debug: true })
    .bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
    gulp.watch('client/**/*.js', ['scripts']);
    gulp.watch('client/**/*.html', ['templates']);
});

gulp.task('test', function() {

});

gulp.task('default', ['scripts', 'templates']);
