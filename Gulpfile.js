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
  return gulp.src(['./public/javascripts/**/*.js','./routes/**/*.js','!./public/javascripts/config/**/*.js','!./public/javascripts/vendors/**/*.js'] )
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('pre-commit', ['jshint']);





/*copiying files to build folder*/
gulp.task('copy-views', function() {
   return gulp.src('./views/**/*.ejs')
   .pipe(gulp.dest('./../build/views'));
});
gulp.task('copy-routes', function() {
   return gulp.src('./routes/**/*.*')
   .pipe(gulp.dest('./../build/routes'));
});
gulp.task('copy-bin', function() {
   return gulp.src('./bin/**/*')
   .pipe(gulp.dest('./../build/bin/'));
});
gulp.task('copy-root-files', function() {
   return gulp.src(['./app.js','.bowerrc'])
   .pipe(gulp.dest('./../build/'));
});
var change = require('gulp-change');
gulp.task('copy-packages', function() {
   return gulp.src( [ './bower.json','package.json' ] )
    .pipe(change(function( content ) {
       var json = JSON.parse( content );
       delete( json.devDependencies );
       return JSON.stringify( json, null, '    ' );
    } ) )
   .pipe(gulp.dest('./../build/'));
});

gulp.task('copy-public-folder', function() {
    return gulp.src(['./public/**/*.*','!./public/bower_components/**/*.*'])
   .pipe(gulp.dest('./../build/public'));
});

gulp.task( 'build-copy',[ 'copy-packages','copy-bin','copy-views','copy-routes','copy-root-files', 'copy-public-folder'], function() {
  var clc = require('cli-color');  
  console.warn( clc.red('verifiy public/confidential/phonebook.json file' ) );
  console.warn( clc.red('verify routes/confidentials/mail-config.json file' ) );
} );

/*gulp.task('copy-bower-components', function() {
   return gulp.src([
      './bower_components/angular-material/angular-material.min.css',
      './bower_components/components-font-awesome/css/font-awesome.min.css'
      './bower_components/angular-ui-notification/dist/angular-ui-notification.min.css',
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/angular/angular.min.js',
      './bower_components/angular-animate/angular-animate.min.js',
      './bower_components/angular-aria/angular-aria.min.js',
      './bower_components/angular-material/angular-material.min.js',
      './bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
      './bower_components/headroom.js/dist/angular.headroom.min.js',
      './bower_components/showdown/compressed/Showdown.js',
      './bower_components/angular-markdown-directive/markdown.js',
      './bower_components/angular-sanitize/angular-sanitize.min.js',
      './bower_components/jsoneditor/dist/jsoneditor.min.css'
      './bower_components/jsoneditor/dist/jsoneditor.min.js'
      './bower_components/angular-ui-router/release/angular-ui-router.min.js'

    ] )
   .pipe(gulp.dest('./../build/public'));
});
*/