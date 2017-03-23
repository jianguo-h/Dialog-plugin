var gulp = require("gulp"),
	sass = require("gulp-sass"), // sass编译模块
	rename = require("gulp-rename"), // 重命名模块
	uglify = require("gulp-uglify"), // js压缩模块
	minifyCss = require("gulp-minify-css"), // css压缩模块
	sourcemaps = require("gulp-sourcemaps"), // sass映射
	plumber = require("gulp-plumber"),
	browserSync = require("browser-sync").create();

// 编译，压缩sass
gulp.task("sass", function() {
	return gulp.src("src/sass/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({
			"outputStyle": "expanded"
		}).on("error", sass.logError))
		.pipe(gulp.dest("src/css"))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(minifyCss())
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
});

// 压缩js
gulp.task("uglify", function() {
	return gulp.src("src/js/*.js")
		.pipe(plumber({
			errorHandler: function(error) {
				console.log(error);
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.stream());
});

// 监听scss和js文件
gulp.task("watch", ["sass", "uglify"], function() {
	browserSync.init({
		server: "./"
	});
	gulp.watch("src/sass/*.scss", ["sass"]);
	gulp.watch("src/js/*.js", ["uglify"]);
	gulp.watch("*.html").on('change', browserSync.reload);
});

// 默认情况下执行watch任务
gulp.task("default", ["watch"]);