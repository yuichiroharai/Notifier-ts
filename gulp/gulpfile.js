// ----------------------------------------------------------------------------------------------------
// ライブラリ読み込み
//

// ログ出力
var yaLog = require('./ya/log.js');

// 本体
var gulp = require('gulp');

// ユーティリティ
var fs = require('fs');
var rename = require('gulp-rename');
var run = require('gulp-run');
var eventStream = require('event-stream');

// エラー通知
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

// 結合＋ソースマップ
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var concatSourcemap = require('gulp-concat-sourcemap');

// TypeScript/JavaScript
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');

// BrowserSync
var browserSync = require('browser-sync');
var reload = browserSync.reload;





// ----------------------------------------------------------------------------------------------------
// タスクまとめ
//
gulp.task('default', ['debug']);
gulp.task('debug', ['bsync-debug', 'watch-debug', 'copy-debug', 'compile-debug']);
gulp.task('release', ['compile-release', 'docs-release']);

gulp.task('make-debug', ['copy-debug', 'compile-debug']);





// ----------------------------------------------------------------------------------------------------
// BrowserSync
//
gulp.task('bsync-debug', function () {
	return browserSync({server: { baseDir: "../debug" } });
});





// ----------------------------------------------------------------------------------------------------
// TypeScriptコンパイル
//
gulp.task('compile-debug', ['copy-debug'], function () {
	return eventStream.merge(
		compileTSDebug("../src/ts/**/*.ts", "notifier", "../debug/js/", "../ts/", false),
		compileTSDebug("../src/ts-test/**/*.ts", "notifiertest", "../debug/js-test/","../ts-test/", false)
	);
});

gulp.task('compile-release', function () {
	return compileTSRelease("../src/ts/**/*.ts", "notifier", "../release/js/", "../release/dts/");
});

// デバッグ用 関数 ------------------------------
function compileTSDebug(src, name, destJS, sourceRoot, isReload) {
	var stream;

	yaLog.tsDebug(src, name, destJS, sourceRoot);

	// エラー通知を仕込む
	stream = plumberAndNotify(gulp.src(src));

	// ソースマップの生成とTypeScriptコンパイル
	// コメントは要らないので削除
	stream.pipe(sourcemaps.init())
		.pipe(typescript({ target: "ES5", removeComments: true, sortOutput: true, sourceRoot: "" })).js
		.pipe(concatSourcemap(name + ".js"))
		.pipe(sourcemaps.write({ includeContent: false, sourceRoot: sourceRoot }))
		// 出力
		.pipe(gulp.dest(destJS));

	// BrowserSyncのリロード
	if (isReload) {
		stream = stream.pipe(reload({ stream: true }));
	}

	return stream;

}
// リリース用 関数 ------------------------------
function compileTSRelease(src, name, destJS, destDTS) {
	var stream, js, dts;

	yaLog.tsRelease(src, name, destJS, destDTS);

	// エラー通知を仕込む
	stream = plumberAndNotify(gulp.src(src));

	// TypeScriptをコンパイル
	// コメントはyuidocで使うので残す
	stream = stream.pipe(typescript({ target: "ES5", removeComments: false, sortOutput: true, declarationFiles: true }));

	// JSとDTSそれぞれを結合して取得
	js = stream.js.pipe(concat(name + ".js"));
	dts = stream.dts.pipe(concat(name + ".d.ts"));

	// JSとDTSのストリームをマージ
	return eventStream.merge(
		js
			// 通常版で出力
			.pipe(gulp.dest(destJS))
			// ファイル名を変えて圧縮して出力
			.pipe(rename(name + ".min.js"))
			.pipe(uglify())
			.pipe(gulp.dest(destJS)),
		dts
			// 出力
			.pipe(gulp.dest(destDTS))
	);
}





// ----------------------------------------------------------------------------------------------------
// コピー
//
gulp.task('copy-debug', function() {
	// ソースマップで参照する用にコピー
	return eventStream.merge(
		copyTSDebug("../src/ts/**/*.ts", "../debug/ts/"),
		copyTSDebug("../src/ts-test/**/*.ts", "../debug/ts-test/"),
		copyHTMLDebug("../src/**/*.html", "../debug/")
	);
});

// デバッグ用 関数 ------------------------------
function copyTSDebug(src, dest) {
	yaLog.copy("TypeScript", src, dest, true);

	return gulp.src(src)
		.pipe(rename(function (path) {
			// ソースマップの参照の仕方が小文字になるので合わせる
			path.basename = path.basename.toLowerCase();
		}))
		.pipe(gulp.dest(dest));
}
function copyHTMLDebug(src, dest) {
	yaLog.copy("HTML", src, dest, true);

	return gulp.src(src)
		.pipe(gulp.dest(dest));
}




// ----------------------------------------------------------------------------------------------------
// ファイル監視
//
gulp.task('watch-debug', function () {
	watchTSDebug("../src/ts/**/*.ts", "notifier", "../debug/js/", "../ts/", "../debug/ts/");
	watchTSDebug("../src/ts-test/**/*.ts", "notifiertest", "../debug/js-test/", "../ts-test/", "../debug/ts-test/");
});

// デバッグ用 関数 ------------------------------
function watchTSDebug(glob, name, destJS, sourceRoot, destTS) {

	yaLog.watch("TypeScript", glob, true);

	gulp.watch(glob, function (e) {
		var path;

		path = e.path.replace(/\\/g, "/");
		yaLog.changed("TypeScript", path, e.type, true);

		if (e.type != "deleted") {
			return eventStream.merge(
				copyTSDebug(glob, destTS, true),
				compileTSDebug(glob, name, destJS, sourceRoot, true)
			)
		}
	});
}





// ----------------------------------------------------------------------------------------------------
// yuidocドキュメント生成
//
gulp.task('docs-release', ['compile-release'], function () {
	// コマンドラインで実行
	run('yuidoc  ./ --config ../../src/config/yuidoc.json',{
		"cwd": "../release/js"
	}).exec();
});





// ----------------------------------------------------------------------------------------------------
// エラー通知
//
function plumberAndNotify(stream) {
	// plumber + notify
	return stream.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
}

