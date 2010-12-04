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

 * The callback for jscurl_get takes one argument, which is a String
 * containing the body of the HTTP GET.

 * The callback for jscurl_xml_get takes one argument, which is a
 * javascript XML object. It is provided because some extra
 * boilerplate is required before translation to an E4X object; see
 * https://developer.mozilla.org/en/E4X#Known_bugs_and_limitations for
 * details.

 */

jscurl_get.local = 1;
function jscurl_get(context, url, callback) {
    var p = new Patcher();
    var myuldl = p.newdefault(122, 90, "jit.uldl", "@convert", 0);
    var mymat = p.newdefault(122, 90, "jit.matrix");

    var callback_funcname = "G__callback";
    var callback_route = p.newdefault(122, 90, "route", "download");
    var callback_select = p.newdefault(122, 90, "select", 1);
    var callback_call = p.newdefault(122, 90, "t", callback_funcname);

    p.connect(myuldl, 0, mymat, 0);
    p.connect(myuldl, 1, callback_route, 0);
    p.connect(callback_route, 0, callback_select, 0);
    p.connect(callback_select, 0, callback_call, 0);
    p.connect(callback_call, 0, context.box, 0);

    context[callback_funcname] =
        function() {
            var dimx = 0;
            var dimy = 0;
            var dim_route = p.newdefault(122, 90, "route", "dim");
            var dim_funcname = "G__dim";
            var dim_prepend = p.newdefault(122, 90, "prepend", dim_funcname);

            context[dim_funcname] = function() {
                dimx = arguments[0];
                dimy = arguments[1];
                var output = p.newdefault(122, 90, "pattr");
                p.connect(mymat, 1, output, 0);

                var result = "";
                for(var i = 0; i != dimy; i++) {
                    for(var j = 0; j != dimx; j++) {
                        mymat.getcell(j, i);
                        var charcode = output.getvalueof()[4];
                        // jit.uldl pads lines w/ zeros so the matrix is
                        // rectangular. Skip the zeros.
                        if(charcode !== 0) {
                            result += String.fromCharCode(charcode);
                        }
                    }
                }
                delete context[dim_funcname];
                callback(result);
            }

            p.connect(mymat, 1, dim_route, 0);
            p.connect(dim_route, 0, dim_prepend, 0);
            p.connect(dim_prepend, 0, context.box, 0);

            mymat.getdim();

            delete context[callback_funcname];
        };

    myuldl.download(url, "matrix");
}

jscurl_xml_get.local = 1;
function jscurl_xml_get(context, url, callback) {
    jscurl_get(context,
               url,
               function(r) {
                   r = r.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
                   callback(new XML(r));
               });
}
