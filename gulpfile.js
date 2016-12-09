const gulp        = require('gulp'),
	  concat      = require('gulp-concat'),
	  uglify      = require('gulp-uglify'),
	  runSequence = require('run-sequence');

const srcFiles = [
	'./src/providers/*.js',
	'./src/components/**/**.js',
	'./src/pages/**/**.js'
];

gulp.task('dev', () => {
	return gulp.src(srcFiles)
			   .pipe(concat('app.components.js'))
			   // .pipe(uglify())
			   .pipe(gulp.dest('./src/'));
});

gulp.task('watch', function() {
    gulp.watch(srcFiles, function() {
        runSequence('dev');
    });
});


gulp.task('default', ['watch']);