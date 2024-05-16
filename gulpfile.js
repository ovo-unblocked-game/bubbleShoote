var gulp = require('gulp');
var connect = require('gulp-connect');


gulp.task('serveprod', function() {
  connect.server({
    root: [__dirname],
    port: process.env.PORT || 5000,
    livereload: false
  });
});

gulp.task('default',['serveprod']);
