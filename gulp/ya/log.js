// ----------------------------------------------------------------------------------------------------
// ログ出力
//

// ファイル監視を開始する際のログを出力します。
function watch(type, glob, isDebug) {
	console.log("\n-------------------- " + type + " のファイル監視を開始します。 (" + ((isDebug) ? "debug" : "release") + ") --------------------");

	console.log("glob: " + glob);
}

// ファイル監視によってファイル変更を検知した際のログを出力します。
function changed(type, path, action, isDebug) {
	console.log("\n-------------------- " + type + " のファイルが変更されました。 (" + ((isDebug) ? "debug" : "release") + ") --------------------");

	console.log("path: " + path);
	console.log("action: " + action);
}

// ファイルをコピーする際のログを出力します。
function copy(type, src, dest, isDebug) {
	console.log("\n-------------------- " + type + " のファイルをコピーします。 (" + ((isDebug) ? "debug" : "release") + ") --------------------");

	console.log("src: " + src);
	console.log("dest: " + dest);
}

// TypeScript ファイルをデバッグ用に処理する際のログを出力します。
function tsDebug(src, name, destJS, sourceRoot) {
	console.log("\n-------------------- TypeScript ファイルの処理を開始します。 (debug) --------------------");

	console.log("src: " + src);
	console.log("name: " + name);
	console.log("destJS: " + destJS);
	console.log("sourceRoot: " + sourceRoot);
}

// TypeScript ファイルをリリース用に処理する際のログを出力します。
function tsRelease(src, name, destJS, destDTS) {
	console.log("\n-------------------- TypeScript ファイルの処理を開始します。 (release) --------------------");

	console.log("src: " + src);
	console.log("name: " + name);
	console.log("destJS: " + destJS);
	console.log("destDTS: " + destDTS);
}

// JavaScript ファイルをドキュメント化する際のログを出力します。
function docsJS(src, dest, config, isDebug) {
	console.log("\n-------------------- JavaScript ファイルのドキュメント化を開始します。 (" + ((isDebug) ? "debug" : "release") + ") --------------------");

	console.log("src: " + src);
	console.log("dest: " + dest);
	console.log("config: " + JSON.stringify(config));
}


// ----------------------------------------------------------------------------------------------------
// export
//
module.exports = {
	watch: watch,
	changed: changed,
	copy: copy,
	tsDebug: tsDebug,
	tsRelease: tsRelease,
	docsJS: docsJS
};