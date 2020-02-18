"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");

var rename = require("gulp-rename");
var del = require("del");

var gulpStylelint = require("gulp-stylelint");
var inject = require("gulp-inject");
var server = require("browser-sync").create();

sass.compiler = require("node-sass");

var stylelint = function () {
    return gulp.src("source/styles/**/*.scss")
        .pipe(gulpStylelint({
            reporters: [
                {formatter: 'string', console: true}
            ],
            failAfterError: true
        }))
};

var clean = function () {
    return del("build");
};

var reloadServer = function () {
   return server.reload();
};

var runServer = function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/styles/**/*.{scss,sass}", gulp.series(processSass, reloadServer));
    gulp.watch("source/*.html", gulp.series(processHtml, reloadServer));
};

var processDependencies = function () {
    return gulp.src([
        "node_modules/normalize.css/normalize.css"
    ])
        .pipe(rename("normalize.min.css"))
        .pipe(gulp.dest("build/css"))
};

var processSass = function () {
    return gulp.src("source/styles/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(rename("style.css"))
        .pipe(gulp.dest("build/css"));
};

var processHtml = function () {
    var sources = gulp.src(["build/js/*.js", "build/css/*.css"], {read: false, base: "build/"});
    return gulp.src("source/index.html")
        .pipe(inject(sources, {
            transform: function (filepath, file) {
                var fileName = filepath.replace('/' + file.base + '/', '');
                return inject.transform.call(inject.transform, fileName);
            }
        }))
        .pipe(gulp.dest("build"))
};

var build = gulp.series(clean, gulp.parallel(processDependencies, processSass), processHtml);

exports.build = build;
exports.start = gulp.series(build, runServer);
exports.autolint = stylelint;
