/**
 * Example of using jscurl_get to get and parse a JSON feed. In this
 * case, it gets the latest 15 "hot links" from delicous and pumps out
 * their descriptions.

 * 2010 Brian Gruber. Public domain.
 */

// load the JSON library.
evalfile("json2.js");

function bang() {
    jscurl_get(this,
               "http://feeds.delicious.com/v2/json",
               function(result) {
		   var j = JSON.parse(result);

		   // for each item in the resulting list...
		   for(var i = 0; i != j.length; i++) {
		       // spit out the "d" parameter, which is the
		       // link's description.
		       outlet(0, j[i].d);
		   }
	       });
}

/* seriously, don't use this unless you really know what's in the file. */
evalfile.local = 1;
function evalfile(filename) {
    var f = new File(filename);
    eval(readWholeFile(f));
}

readWholeFile.local = 1;
function readWholeFile(f) {
    var BLOCK_SIZE = 1024;
    if(f.isopen) {
	var s = "";
	var l;
	while(l = f.readstring(1024)) {
	    s += l;
	}
	return s;
    }
  }
}