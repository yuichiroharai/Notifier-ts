/// <reference path="../ts/Notifier.ts" />

class NotifierTest extends Notifier {


// ----------------------------------------------------------------------------------------------------
// constructor
//
	constructor() {
		super();
	}


// ----------------------------------------------------------------------------------------------------
// add
//
	public onListener1ForType1():void {
		this.on("type1", this._listener1);
		console.log("listener1 is added for type1.");
	}
	public onListener1ForType2():void {
		this.on("type2", this._listener1);
		console.log("listener1 is added for type2.");
	}

	public onListener2ForType1():void {
		this.on("type1", this._listener2);
		console.log("listener2 is added for type1.");
	}
	public onListener2ForType2():void {
		this.on("type2", this._listener2);
		console.log("listener2 is added for type2.");
	}



// ----------------------------------------------------------------------------------------------------
// remove
//
	public offListener1ForType1():void {
		this.off("type1", this._listener1);
		console.log("listener1 is removed for type1.");
	}
	public offListener1ForType2():void {
		this.off("type2", this._listener1);
		console.log("listener1 is removed for type2.");
	}

	public offListener2ForType1():void {
		this.off("type1", this._listener2);
		console.log("listener2 is removed for type1.");
	}
	public offListener2ForType2():void {
		this.off("type2", this._listener2);
		console.log("listener2 is removed for type2.");
	}

	public offAllListenersForType1():void {
		this.off("type1");
		console.log("all listeners are removed for type1.");
	}
	public offAllListenersForType2():void {
		this.off("type2");
		console.log("all listeners are removed for type2.");
	}

	public offAllListenersForAllTypes():void {
		this.off();
		console.log("all listeners are removed for all types.");
	}



// ----------------------------------------------------------------------------------------------------
// has
//
	public checkListener1ForType1():void {
		var b:boolean = this.check("type1", this._listener1);
		console.log("has listener1 for type1: " + b);
	}
	public checkListener1ForType2():void {
		var b:boolean = this.check("type2", this._listener1);
		console.log("has listener1 for type2: " + b);
	}

	public checkListener2ForType1():void {
		var b:boolean = this.check("type1", this._listener2);
		console.log("has listener2 for type1: " + b);
	}
	public checkListener2ForType2():void {
		var b:boolean = this.check("type2", this._listener2);
		console.log("has listener2 for type2: " + b);
	}

	public checkAnyListenersForType1():void {
		var b:boolean = this.check("type1");
		console.log("has any listeners for type1: " + b);
	}
	public checkAnyListenersForType2():void {
		var b:boolean = this.check("type2");
		console.log("has any listeners for type2: " + b);
	}

	public checkAnyListenersForAnyTypes():void {
		var b:boolean = this.check();
		console.log("has any listeners for any types: " + b);
	}



// ----------------------------------------------------------------------------------------------------
// notify
//
	public notifyType1():void {
		console.log("\ntype1 is notified.");
		this.notify("type1");
	}
	public notifyType2():void {
		console.log("\ntype2 is notified.");
		this.notify("type2");
	}


// ----------------------------------------------------------------------------------------------------
// listener
//
	public _listener1 = () => {
		console.log(">> listener1 is called.");
	};
	private _listener2 = () => {
		console.log(">> listener2 is called.");
	};


// ----------------------------------------------------------------------------------------------------
// init buttons
//
	public init():void {

		// add
		document.getElementById("onListener1ForType1").addEventListener("click", () => { this.onListener1ForType1() });
		document.getElementById("onListener1ForType2").addEventListener("click", () => { this.onListener1ForType2() });
		document.getElementById("onListener2ForType1").addEventListener("click", () => { this.onListener2ForType1() });
		document.getElementById("onListener2ForType2").addEventListener("click", () => { this.onListener2ForType2() });

		// remove
		document.getElementById("offListener1ForType1").addEventListener("click", () => { this.offListener1ForType1() });
		document.getElementById("offListener1ForType2").addEventListener("click", () => { this.offListener1ForType2() });
		document.getElementById("offListener2ForType1").addEventListener("click", () => { this.offListener2ForType1() });
		document.getElementById("offListener2ForType2").addEventListener("click", () => { this.offListener2ForType2() });
		document.getElementById("offAllListenersForType1").addEventListener("click", () => { this.offAllListenersForType1() });
		document.getElementById("offAllListenersForType2").addEventListener("click", () => { this.offAllListenersForType2() });
		document.getElementById("offAllListenersForAllTypes").addEventListener("click", () => { this.offAllListenersForAllTypes() });

		// has
		document.getElementById("checkListener1ForType1").addEventListener("click", () => { this.checkListener1ForType1() });
		document.getElementById("checkListener1ForType2").addEventListener("click", () => { this.checkListener1ForType2() });
		document.getElementById("checkListener2ForType1").addEventListener("click", () => { this.checkListener2ForType1() });
		document.getElementById("checkListener2ForType2").addEventListener("click", () => { this.checkListener2ForType2() });
		document.getElementById("checkAnyListenersForType1").addEventListener("click", () => { this.checkAnyListenersForType1() });
		document.getElementById("checkAnyListenersForType2").addEventListener("click", () => { this.checkAnyListenersForType2() });
		document.getElementById("checkAnyListenersForAnyTypes").addEventListener("click", () => { this.checkAnyListenersForAnyTypes() });

		// notify
		document.getElementById("notifyType1").addEventListener("click", () => { this.notifyType1() });
		document.getElementById("notifyType2").addEventListener("click", () => { this.notifyType2() });

		// show Notifier as JSON
		document.getElementById("NotifierTest").addEventListener("click", () => { console.log(JSON.stringify(this)) });

	}

}
var notifyTest:NotifierTest;

notifyTest = new NotifierTest();
notifyTest.init();
