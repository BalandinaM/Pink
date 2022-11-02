const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const rename  = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const cheerio = require('gulp-cheerio');
const pug = require('gulp-pug');

//Pug

const pugHtml = () => {
  return gulp.src("source/pug/*.pug")
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest("source"));
};

exports.pugHtml = pugHtml;

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(terser())
    .pipe(rename("mobile-menu.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//const normStyles = () => {
//  return gulp.src("source/css/normalize.css")
//    .pipe(plumber())
//    .pipe(postcss(csso()))
//    .pipe(rename("style.min.css"))
//    .pipe(gulp.dest("build/css"))
//    .pipe(sync.stream());
//}
//
//exports.normStyles = normStyles;

//Img

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = images;

// WebP

const imagewebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.imagewebp = imagewebp;


//SVG

const svgsprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
        $('[stroke]').removeAttr('stroke');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img/icons"));
}

exports.svgsprite = svgsprite;

//Копирование изображений для просмотра в браузере

const copyImages = () => {
  return gulp.src([
    "source/img/**/*.{png,jpg,svg}",
    "!source/img/icons/*.svg",
    "!source/img/makety*.png"
  ])
    .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Copy

const copy = (done) => {
  gulp.src([
    "source/css/normalize.css",
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "!source/img/icons/*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/pug/*.pug", gulp.series("pugHtml"));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Сборка в продакшн

const build = gulp.series(
  clean,
  copy,
  images,
  pugHtml,  //насколько я понимаю, в идеале он не должен стоять тут в сборке, файлы должны обрабатываться до того как начинает работать сборщик, а в сборзик дожен попадать уже чистый html
  gulp.parallel(
    styles,
    //normStyles,
    html,
    scripts,
    svgsprite,
    imagewebp
  ),
);

exports.build = build;

// Этот скрипт для просмотра на сервере

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  pugHtml,
  gulp.parallel(
    styles,
    //normStyles,
    html,
    scripts,
    svgsprite,
    imagewebp
  ),
  gulp.series(
    server,
    watcher
  )
);

//webmanifest не нужно копировать в папку сборки?!
