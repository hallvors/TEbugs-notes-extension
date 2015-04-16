var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data, testdata='';
var Request = require("sdk/request").Request;

var testfilehostpath = 'http://arewecompatibleyet.hallvord.com/data/testing/';

var req = Request( {
	url : testfilehostpath+'latest.csv',
	onComplete : function(response){
		testdata = response.text;
		var pgscript = pageMod.PageMod({
		  include: "https://bugzilla.mozilla.org/*",
		  contentScriptFile: [data.url("util.js"),data.url("test.js")],
		  onAttach: function(worker) {
		    worker.port.emit("heres-some-data", testdata);
		  }
		});
	}
})
req.get();

// var testdata = data.load("results-2013-08-20.csv"); // TODO: load latest dynamically from some online URL (and preferably make sure it's cached for a suitable time)
