var Notifier = (function () {
    /**
     * 最低限の機能に絞り込んだシンプルなイベント通知クラスです。
     *
     * * イベントリスナーに渡すEventクラスのようなものはありません。
     * * 代わりに任意の引数を渡す事ができます。
     * * バブリング/キャプチャリングフェーズはありません。
     *
     * *※このドキュメントはJavaScriptから生成したものですが、TypeScriptで利用する事を前提にしています。*
     *
     * ```
     * // TypeScript
     * /// <reference path="[path]/Notifier.ts" />
     * class Test {
     *   private _notifier:Notifier;
     *   private _count:number = 0;
     *
     *   constructor() {
     *     this._notifier = new Notifier();
     *
     *     this._notifier.on("type", this._onType);
     *
     *     // without params
     *     this._notifier.notify("type");
     *
     *     // with params
     *     this._notifier.notify("type", ["hoge"]);
     *     this._notifier.notify("type", ["hoge", "fuga"]);
     *
     *     this._notifier.off("type", this._onType);
     *
     *     // doesn't call '_onType' listener.
     *     this._notifier.notify("type");
     *   }
     *
     *   // if you need "this", use Arrow Function.
     *   private _onType = (param1:string, param2:string) => {
     *     console.log("'_onType' function is called(" + ++this._count + "), with params: " + param1 + ", " + param2);
     *   }
     *
     *   // console log
     *   // '_onType' function is called(1), with params: undefined, undefined
     *   // '_onType' function is called(2), with params: hoge, undefined
     *   // '_onType' function is called(3), with params: hoge, fuga
     * }
     * ```
     *
     * @example
     * ```
     * // TypeScript
     * var notifier:Notifier = new Notifier();
     * ```
     *
     * @class Notifier
     * @constructor
     */
    function Notifier() {
    }
    /**
     * イベントタイプにイベントリスナーを追加します。<br>
     * 既に追加されているイベントリスナーは一度削除されてから追加されるので、呼び出す順番は一番最後になります。
     *
     * @example
     * ```
     * // TypeScript
     * var notifier:Notifier = new Notifier();
     * ...
     * notifier.on("type", onType); // "onType" listener is added for "type" type.
     * ```
     *
     * @method on
     * @param {string} type		追加するイベントタイプ。
     * @param {Function}listener	追加するイベントリスナー。
     * @return {Notifier}			メソッドチェーン用の自身のオブジェクト。
     */
    Notifier.prototype.on = function (type, listener) {
        var typeList, listenerList;
        typeList = this._typeList = this._typeList || {};
        listenerList = typeList[type];
        if (listenerList)
            this.off(type, listener);
        listenerList = typeList[type];
        if (!listenerList) {
            this._typeList[type] = [listener];
        }
        else {
            listenerList.push(listener);
        }
        return this;
    };
    /**
     * イベントタイプに追加されているイベントリスナーを削除します。<br>
     * イベントリスナーを省略すると、指定したイベントタイプに追加されている全てのイベントリスナーを削除します。<br>
     * イベントタイプも省略すると、全てのイベントタイプの全てのイベントリスナーを削除します。
     *
     * @example
     * ```
     * // TypeScript
     * var notifier:Notifier = new Notifier();
     * ...
     * notifier.off("type", onType); // "onType" listener is removed from "type" type.
     * notifier.off("type"); // // all listeners is removed from "type" type.
     * notifier.off(); // all listeners is removed from all types.
     * ```
     *
     * @method off
     * @param {string} type			削除するイベントタイプ。
     * @param {Function} listener		削除するイベントリスナー。
     * @return {Notifier}				メソッドチェーン用の自身のオブジェクト。
     */
    Notifier.prototype.off = function (type, listener) {
        var i, len, typeList, listenerList;
        // all listeners is removed.
        if (!type && !listener) {
            delete this["_typeList"];
        }
        else if (!listener) {
            typeList = this._typeList;
            if (!typeList)
                return this;
            delete typeList[type];
            if (Object.keys(typeList).length == 0)
                delete this["_typeList"];
        }
        else {
            typeList = this._typeList;
            if (!typeList)
                return this;
            listenerList = typeList[type];
            if (!listenerList)
                return this;
            len = listenerList.length;
            for (i = 0; i < len; i++) {
                if (listenerList[i] == listener) {
                    if (len == 1) {
                        delete typeList[type];
                        if (Object.keys(typeList).length == 0)
                            delete this["_typeList"];
                    }
                    else {
                        listenerList.splice(i, 1);
                    }
                    break;
                }
            }
        }
        return this;
    };
    /**
     * イベントタイプにイベントリスナーが追加されているか確認します。<br>
     * イベントリスナーを省略すると、指定したイベントタイプに何らかのイベントリスナーが追加されている確認します。<br>
     * イベントタイプも省略すると、何らかのイベントタイプに何らかのイベントリスナーが追加されている確認します。
     *
     * @example
     * ```
     * // TypeScript
     * var notifier:Notifier = new Notifier();
     * ...
     * notifier.check("type", onType); // check "onType" listener is added for "type" type.
     * notifier.check("type"); // check any listeners is added for "type" type.
     * notifier.check(); // check any listeners is added for any types.
     * ```
     *
     * @method check
     * @param {string} type			確認するイベントタイプ。
     * @param {Function} listener		確認するイベントリスナー。
     * @return {boolean}				イベントリスナーが追加されているか。
     */
    Notifier.prototype.check = function (type, listener) {
        var i, len, typeList, listenerList;
        if (!type && !listener) {
            return !!(this._typeList);
        }
        else if (!listener) {
            typeList = this._typeList;
            return !!(typeList && typeList[type]);
        }
        else {
            typeList = this._typeList;
            if (!typeList)
                return false;
            listenerList = typeList[type];
            if (!listenerList)
                return false;
            len = listenerList.length;
            for (i = 0; i < len; i++) {
                if (listenerList[i] == listener)
                    return true;
            }
            return false;
        }
    };
    /**
     * イベントタイプに追加されているイベントリスナーを全て実行します。<br>
     * 第2引数の配列はイベントリスナーの引数として順番に渡されます。
     *
     * @example
     * ```
     * // TypeScript
     * var notifier:Notifier = new Notifier();
     * ...
     * notifier.notify("type"); // notify all listeners without params
     * notifier.notify("type", ["hoge", "fuga"]); // notify all listeners with params
     * ```
     *
     * @method notify
     * @param {string} type		通知するイベントタイプ。
     * @param {Array} params		リスナーに渡す引数。
     * @return {Notifier}			メソッドチェーン用の自身のオブジェクト。
     */
    Notifier.prototype.notify = function (type, params) {
        var i, len, typeList, listenerList;
        typeList = this._typeList;
        if (!typeList)
            return this;
        listenerList = typeList[type];
        if (!listenerList)
            return this;
        len = listenerList.length;
        for (i = 0; i < len; i++) {
            if (!params) {
                listenerList[i]();
            }
            else {
                listenerList[i].apply(null, params);
            }
        }
        return this;
    };
    return Notifier;
})();
