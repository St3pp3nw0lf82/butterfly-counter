$(document).bind( "mobileinit", function() {
	// load content from cross domain pages out of a phonegap build app:
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
});
