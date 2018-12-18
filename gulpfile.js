const { task, series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require("gulp-uglify");

const clean = function (cb) {
    del(['assets/'])
    cb()
};

function vendorCss(cb) {
    src([
        'node_modules/bootstrap/scss/bootstrap.scss'
    ], { allowEmpty: true })
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(concat('bootstrap.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest("assets/css"));

    cb();
}

function appCss(cb) {
    src([
        'src/scss/styles.scss'
    ], { allowEmpty: true })
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest("assets/css"));

    cb();
}

function vendorJs(cb) {
    src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/popper.js/dist/popper.min.js',
        'node_modules/axios/dist/axios.min.js',
        'src/js/moment.min.js',
        'src/js/underscore-min.js'
    ], { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(dest("assets/js"));

    cb();
}

function appJs(cb) {
    src([
        'src/js/*.js'
    ], { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest("assets/js"));

    cb();
}

task(clean);

exports.build = parallel(vendorCss, appCss, vendorJs, appJs);
exports.default = series(vendorCss, appCss, vendorJs, appJs);