self.port.on('heres-some-data', function(csvdata){
	var data = CSVToArray(csvdata);
	var perbug = {};
	data.forEach(function(value){ perbug[value[0]]=value; });
	var el, elms = document.evaluate('//a[contains(@href, "show_bug.cgi")]', document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null), bug, match;
	for ( var i=0 ; el = elms.snapshotItem(i); i++ ){
		if(el.parentNode.classList.contains('bz_comment_number') || el.parentNode.classList.contains('navigation') )continue;
		match = el.href.match(/id=(\d+)$/);
		if(match && match[1] && perbug[match[1]]){
			bug = match[1];
			var testresult = perbug[bug][3];
			var span = document.createElement("span");
			var d = new Date(perbug[bug][1].replace(/\s/, 'T'));
			var d2 = Date.now();
			var diff = parseInt((d2 - d.getTime()) / (1000*60*60*24 ));
			span.classList.add("testres");
			span.title = "Tested "+diff+' days ago'; //(perbug[bug][1].split(/\s/))[0];
			span.appendChild(document.createTextNode(testresult === "true" ? " ☑" : testresult === "false" ? " ☐" : ' '+testresult )); // square
			var resolved = el.classList.contains('bz_closed') || el.classList.contains('bz_resolved') ;
			if(  testresult=== "true" ){
				span.classList.add("pass");
				if(!resolved){
					span.classList.add("needs-attention");
				}
			}
			else{
				span.classList.add("fail");
				if(resolved){
					span.classList.add("needs-attention");
				}
			}
			// append after..
			if( el.nextSibling ){
				el.parentNode.insertBefore(span, el.nextSibling);
			}else{
				el.parentNode.appendChild(span);
			}
		}
	}
});

document.head.appendChild(document.createElement('style')).appendChild(document.createTextNode('.testres{line-height:2rem;position:relative}.testres.pass {color:green}.testres.fail{color:red}.testres.needs-attention{font-size: large; text-decoration:blink}.testres:after {line-height:2rem;content: attr(title);position: absolute; top: 130%;left: 20%;background: #ffcb66; padding: 5px 15px; color: black;border-radius: 10px;white-space: nowrap; opacity: 0;}.testres:before {line-height:2rem;content: "";position: absolute;width: 0;height: 0; border-bottom: 20px solid #ffcb66;border-left: 20px solid transparent;border-right: 20px solid transparent; opacity: 0;left: 30%;top: 90%;}.testres:hover:before {bottom: 70%;}.testres:hover:after, .testres:hover:before {opacity: 1;}'));
