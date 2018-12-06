const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const tsProject = ts.createProject('tsconfig.json');
const nodemon = require('gulp-nodemon');

/**
 * @description 清除dist
 */
gulp.task('clean',function(){
    return gulp.src('dist/*',{read:false}).pipe(clean());
});

/**
 * @description 复制 modules
 */
gulp.task('copy', function () {
    return gulp.src(['modules/**/*.js'], {base: '.'})
    .pipe(gulp.dest('dist'));
})
/**
 * @description 编译 ts
 */
gulp.task('tsc', function () {
    return tsProject.src()
        // 注意顺序
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('nodemon', function () {
	return nodemon({
        script: 'dist/index.js',  // 服务的启动文件
        watch: './',    // 源代码目录
        tasks: ['tsc'], // 在重启服务前需要执行的任务
        ext: 'ts', // 监听.ts结尾的文件 必须
        // 设置环境
        env: {
            'NODE_ENV': 'localhost'
		},
		watch: [
			'.config','*.ts'
		],
        // 必须开启debug模式
        exec: 'node --inspect'
    });
})

gulp.task('dev',gulp.series('clean','copy','tsc','nodemon'));
gulp.task('build',gulp.series('clean','copy','tsc'));