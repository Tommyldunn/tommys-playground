var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var exorcist = require('exorcist');
var watchify = require('watchify');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require("gulp-uglify");
var cssnano = require('gulp-cssnano');
const del = require('del');
var $    = require('gulp-load-plugins')();
var sassPaths = [
  'bower_components/normalize.scss/sass',
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

function bundle(bundler) {
    return bundler
        .transform(babelify)
        .bundle()
        .on('error', function (e) {
            gutil.log(e.message);
        })
        .pipe(exorcist('./dist/js/main.js.map'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js'));
}

gulp.task('clean', (cb) => {
    return del(['dist'], cb);
});


gulp.task('js-watch', function() {
    watchify.args.debug = true;
    var watcher = watchify(browserify('./src/js/main.js', watchify.args));
    bundle(watcher);
    watcher.on('log', gutil.log);
    watcher.on('update', function() {
        bundle(watcher);
    });
});

gulp.task('js-build', function() {
    return bundle(browserify('./src/js/main.js'));
});

gulp.task('sass-build', function() {
    return gulp.src('./src/css/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css'));
});

gulp.task('favicon', function() {
    return gulp.src('./src/favicon.ico')
      .pipe(gulp.dest('./dist/'));
});

gulp.task('vendor-sass', function() {
  return gulp.src('./src/vendor.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass-watch', function() {
    gulp.watch('./src/css/*.scss', ['sass-build']);
});

gulp.task('minify-images', function() {
    return gulp.src('./src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task("js-uglify", function() {
    return gulp.src('./src/js/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task("css-minify", function() {
    return gulp.src('./dist/css/main.css')
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', ['js-watch', 'sass-watch'], function() {
    console.log(' --- Watching CSS & JS files --- ');
});

gulp.task('build', ['del', 'js-build', 'sass-build', 'favicon'], function() {
    console.log(' --- Finished Building CSS & JS files --- ');
});

gulp.task('minify', ['css-minify', 'js-uglify', 'minify-images'], function() {
    console.log(' --- Finished Minifying CSS & JS files --- ');
});
