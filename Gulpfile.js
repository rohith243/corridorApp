var gulp = require('gulp');
var gutil = require('gulp-util');

var prettify = require('gulp-jsbeautifier');
gulp.task('format-js', ['format-js-dev'], function() {
  gulp.src(['./public/javascripts/**/*.js'])
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('format-js-dev', function() {
  gulp.src(['./routes/**/*.js'])
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./routes/'));
});

gulp.task('format-html', function() { 
  gulp.src(['./views/**/*.ejs','!./views/cached-pages/**/*.ejs'])
    .pipe(prettify({indent_size: 4}))
    .pipe(gulp.dest('./views/'))
});

gulp.task('format-partials', function() {
  gulp.src(['./public/partials/**/*.html'])
    .pipe(prettify({indent_size: 4}))
    .pipe(gulp.dest('./public/partials/'))
});


gulp.task('format-css', function() {
  gulp.src(['./public/stylesheets/**/*.css'])
    .pipe(prettify({indent_size: 4}))
    .pipe(gulp.dest('./public/stylesheets/'))
});

gulp.task( 'format', [ 'format-js', 'format-html', 'format-partials', 'format-css' ], function() {
	console.log( 'Formatting completed..' );
});

/*jshint comes here*/
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var gulp   = require('gulp');
gulp.task('jshint', function() {
  return gulp.src(['./public/javascripts/**/*.js','./routes/**/*.js','!./public/javascripts/config/**/*.js'] )
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('pre-commit', ['jshint']);
