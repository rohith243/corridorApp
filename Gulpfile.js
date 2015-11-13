var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
/*less conversion*/
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
gulp.task('less-css', function () {
  return gulp.src('./client/less/**/index.less')
    .pipe(sourcemaps.init())
    .pipe( less() )
    .pipe( cssmin() )
    .pipe( sourcemaps.write() )
    .pipe(gulp.dest('./client/css/'));
});

gulp.task('copy-fonts', function () {
  return gulp.src('./client/bower_components/components-font-awesome/fonts/**/*.*')
    .pipe(gulp.dest('./client/fonts/'));
});
gulp.task( 'less', ['less-css', 'copy-fonts'] );

gulp.task('copy-common', function() {
   return gulp.src('./common/**/*.*')
   .pipe(gulp.dest('./../build/common/'));
});

gulp.task('copy-modules', function() {
   return gulp.src('./modules/**/*.*')
   .pipe(gulp.dest('./../build/modules/'));
});

gulp.task('copy-server', function() {
   return gulp.src('./server/**/*.*')
   .pipe(gulp.dest('./../build/server/'));
});

gulp.task('copy-client', function() {
   return gulp.src(['./client/**/*.*','!./client/bower_components/**/*.*','!./client/less/**/*.*'])
   .pipe(gulp.dest('./../build/client/'));
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


gulp.task('copy-root-files', function() {
   return gulp.src(['.bowerrc'])
   .pipe(gulp.dest('./../build/'));
});

gulp.task( 'build-copy',[ 'less', 'copy-common', 'copy-modules','copy-server', 'copy-client', 'copy-packages', 'copy-root-files'], function() {
  //var clc = require('cli-color');  
  //console.warn( clc.red('verifiy public/confidential/phonebook.json file' ) );
  //console.warn( clc.red('verify routes/confidentials/mail-config.json file' ) );
} );


gulp.task('pre-commit', ['less']);