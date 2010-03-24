/**
 * Get files for the js object, using a callback. Requires Jitter.
 * copyright 2010 Brian Gruber.

 * Copying
 * ------- 
 * This program is released under the terms of the GPL as below with
 * the exception that it may be used in conjunction with any version
 * of Max by Cycling '74. Software created with Max using this library
 * is subject to the conditions of the GPL.
 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.

 * USAGE
 * =====
 * Place this file in your jsextensions directory. Call from your own
 * javascript using the jscurl_get or jscurl_xml_get functions.

 * The callback for jscurl_get takes one argument, which is the path
 * to the downloaded file. You can do with this path whatever you
 * wish, but you probably want to read the file using Max' File
 * object.

 * The callback for jscurl_xml_get takes one argument, which is a
 * javascript XML object.

 */

jscurl_get.local = 1;
function jscurl_get(url, callback) {
    var p = new Patcher();
    var myuldl = p.newdefault(122, 90, "jit.uldl");
    var mycallback = p.newdefault(122, 90, "js", "jscurl");
    mycallback.message("set_callback", callback);
    p.hiddenconnect(myuldl, 1, mycallback, 0);
    myuldl.message("download", url, getRandomString(8));
}

jscurl_xml_get.local = 1;
function jscurl_xml_get(url, callback) {
    jscurl_get(url,
	       function(filename) {
		   var f = new File(filename);
		   var r = readWholeFile(f);
		   r = r.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
		   callback(new XML(r));
		   f.close();
	       });
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

var callback_fn = post;

function set_callback(fn) {
    callback_fn = fn;
}

function download(success, path) {
    if(success) {
	callback_fn(path);
    } else {
	post("Failed to download.");
    }
}

getRandomInt.local = 1;
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

getRandomString.local = 1;
function getRandomString(length) {
    var a = [];
    for(var i = 0; i != length; i++) {
	var j = getRandomInt(65, 116);
	// eliminate punctation characters between upper and lower case
	j = j > 90 ? j + 6 : j;
	a.push(j);
    }
    return String.fromCharCode.apply(this, a);
}