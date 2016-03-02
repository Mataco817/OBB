var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('plugin-overwrite', function() {
	// Step 1: Move the edited files back into the plugin folder
	gulp.src('./www/plugin/bluetoothSerial.js')
	  .pipe(gulp.dest('./plugins/com.plugin/src/browser/'));

	// Step 2: Build the project
	if (sh.exec('ionic build browser').code !== 0) {
	  console.log('Failed to build for browser');
	  process.exit(1);
	}

	// Step 3: Move built files back into webroot
	gulp.src(['./platforms/browser/www/cordova.js', './platforms/browser/www/cordova_plugins.js'])
	  .pipe(gulp.dest('./www/build/'));

	gulp.src('./platforms/browser/www/plugins')
	  .pipe(gulp.dest('./www/build/'));
});

gulp.task('browser:serve', function() {
    gulp.src(paths.browser)
        .pipe(webserver({
            livereload: {enable: true, port: 35729},
            directoryListing: false,
            host: localhost,
            port: 8100,
            open: true
        }));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
