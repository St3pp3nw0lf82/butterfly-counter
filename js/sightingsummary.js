function show_sightings() {
	try {
		if(window.localStorage.bf_basket) {
			var sightings = JSON.parse(window.localStorage["bf_basket"]);
			var sightingwrapper = "";
			$.each(sightings, function(key, value) {
				sightingwrapper += "<p><span class='bf_name'>" + value.bf_name + "</span></br >";
				sightingwrapper += "<span class='bf_amount'>" + value.bf_amount + "</span></br >";
				if(value.bf_location == "") {
					sightingwrapper += "<span class='bf_location'>Location unknown</span></p>";
				} else {
					sightingwrapper += "<span class='bf_name'>" + value.bf_location + "</span></p>";
				}
			});
			$("#sightingbasket").append(sightingwrapper);	
		} else {
			throw "nobasket_err";
		}
	}
	catch(e) {
		var errormsg = "An error occurred while creating the sighting summary.\n";
		if(e == "nobasket_err") {
			errormsg += "No basket was found.";
		} else {
			errormsg += "Error message: " + e.message;
		}
	}
}
