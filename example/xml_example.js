/**
 * Example of using the jscurl_xml_get function. Parses the US
 * Department of Homeland Security's official XML feed for the current
 * terror alert level, and sets a comment object to display that level
 * and the coordinated color.

 * 2010 Brian Gruber. Public domain.
 */

function bang() {
    jscurl_xml_get("http://www.dhs.gov/dhspublic/getAdvisoryCondition",
		   function(x) {
		       switch(x.@CONDITION.toXMLString()) {
		       case "LOW":
			   outlet(0, "bgcolor", 0, 1, 0, 1);
			   break;
		       case "GUARDED":
			   outlet(0, "bgcolor", 0, 0, 1, 1);
			   break;
		       case "ELEVATED":
			   outlet(0, "bgcolor", 1, 1, 0, 1);
			   break;
		       case "HIGH":
			   outlet(0, "bgcolor", 1, .5, 0, 1);
			   break;
		       case "SEVERE":
			   outlet(0, "bgcolor", 1, 0, 0, 1);
			   break;
		       };
		       outlet(0, "set", x.@CONDITION.toXMLString());
		   });
}
