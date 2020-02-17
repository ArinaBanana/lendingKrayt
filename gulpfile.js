"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");

var rename = require("gulp-rename");
var del = require("del");

var gulpStylelint = require("gulp-stylelint");

sass.compiler = require("node-sass");

var compileSass = function () {
   return gulp.src("source/styles/main.scss")
       .pipe(sass().on("error", sass.logError))
       .pipe(rename("style.css"))
       .pipe(gulp.dest("build/css"));
};

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

exports.build = gulp.series(clean, compileSass);
exports.autolint = stylelint;
