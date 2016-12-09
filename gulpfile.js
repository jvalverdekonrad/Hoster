'use strict';

const gulp         = require('gulp'),
	  concat       = require('gulp-concat'),
	  uglify       = require('gulp-uglify'),
	  runSequence  = require('run-sequence'),
	  sass         = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer');

const srcScripts = [
	'./src/providers/*.js',
	'./src/components/**/**.js',
	'./src/pages/**/**.js'
];

const srcStyles = [
	'./src/assets/scss/**/*.scss',
];

const x = './src/assets/scss/app.scss';

const log = (taskName) => {
	let separator = '';
	const length = taskName.length + 6;

	for (let i = 0; (i<length); i = i + 1) {
		separator = `${separator}-`;
	}

	console.log(`${separator}\n-- ${taskName} --\n${separator}`);

};

gulp.task('scripts', () => {
	log('Scripts');
	return gulp.src(srcScripts)
			   .pipe(concat('app.components.js'))
			   // .pipe(uglify())
			   .pipe(gulp.dest('./src/'));
});

gulp.task('sass', () => {
	log('SASS');
	return gulp.src(x)
			   .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        	   .pipe(autoprefixer())
			   .pipe(concat('app.css'))
			   .pipe(gulp.dest('./src/'));
});

gulp.task('watch',  () => {
	runSequence('sass', 'scripts');
    gulp.watch(srcScripts, () => { runSequence('scripts'); });
    gulp.watch(srcStyles,  () => { runSequence('sass');    });
});


gulp.task('default', ['watch']);