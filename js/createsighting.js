// get users current position:
var success = function(position) {
	alert('Success!');
	$('#map').html('<p>Latitude: '+ position.coords.latitude +'</p><p>Longitude: '+ position.coords.longitude +'</p>');
	/*
	$('#map').gmap().bind('init', function(position, status) {
		if(status == 'OK') {
			var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$('#map').gmap('addMarker', {'position': clientPosition, 'bounds': true});
			// TODO: change button text depending on if map is shown or not:
		}
	});
	*/
};

var error = function(error) {
	$('#map').html('<p>Error code: '+ error.code +', error message: '+ error.message +'</p>');
};

function checkforbasket() {
	try {
		if(window.localStorage) {
			if(window.localStorage.bf_basket) {
				// .trigger('create') is needed in addition to .append() to apply the mobile styles to the new button:
				if(!$("#delete_basket").length) {
					$("#startoptions").append("<p id='delete_basket'><a href='#' data-role='button' onclick='javascript:delete_basket();'>Delete basket</a><p/>").trigger('create');
				}
			}
		} else {
			throw "locstor_err";
		}
	}
	catch(e) {
		var errormsg = "An error occurred while checking for a basket.\n";
		if(e == "locstaor_err") {
			errormsg += "Local storage isn't supported by your device.";
		} else {
			errormsg += "Error message: " + e.message;
		}
		alert(errormsg);
	}
}

function create_sightingbasket() {
	try {
		// create the butterfly basket: 
		if(window.localStorage) {
			if(!window.localStorage.bf_basket) {
				window.localStorage.bf_basket = JSON.stringify([]);
				if(window.localStorage.length == 0) { throw "basketcreate_err"; }
				// .trigger('create') is needed in addition to .append() to apply the mobile styles to the new button:
				$("#startoptions").append("<p id='delete_basket'><a href='#' data-role='button' onclick='javascript:delete_basket();'>Delete basket</a><p/>").trigger('create');
			}
		} else {
			throw "locstor_err";
		}
	} catch(e) {
		var errormsg = "An error occurred while trying to create the butterfly basket.\n";
		if(e == "locstor_err") {
			errormsg += "Local storage isn't supported by your device.";
		} else if(e == "basketcreate_err") {
			errormsg += "The butterfly basket couldn't be created.";	
		} else {
			errormsg += "Error message: " + e.message;
		}
		alert(errormsg);
	}
}

function create_sightingobject() {
	try {
		var sighting = {
			id: "",
			bf_name: "",
			bf_amount: 0,
			bf_location: ""
		};
		if(typeof(sighting) == "object") {
			var d = new Date();
			var id = d.getFullYear()+"_"+d.getMonth()+"_"+d.getDay()+"_"+d.getHours()+"_"+d.getMinutes()+"_"+d.getSeconds();
			sighting.id = id;
			sighting.bf_name = $(this).text();
			sighting.bf_amount++;
			if(window.localStorage.bf_basket) {
				var basket = JSON.parse(window.localStorage["bf_basket"]);
				if(typeof(basket) == "object") {
					basket.push(sighting);
					window.localStorage["bf_basket"] = JSON.stringify(basket);
				}
			}
			// check if geolocation is supported:
			//if(Modernizr.geolocation) { alert("geolocation supported"); } else { alert("geolocation not supported"); }
			/*
			if(navigator.geolocation.getCurrentPosition(
				function(position) {
					sighting.bf_location = position.coords.latitude + "," + position.coords.longitude;
					alert('Success!');
					$('#map').html('<p>Latitude: '+ position.coords.latitude +'</p><p>Longitude: '+ position.coords.longitude +'</p>');
				},
				function(error) {
					sighting.bf_location = "Location unknown";
				};)
			*/
			//return sighting;
		} else {
			throw "init_err";
		}
	}
	catch(e) {
		if(e == "error") { alert("specific error"); }
		if(e == "all_err") { alert("initialisation failed!"); }
	}
}

function delete_basket() {
	window.localStorage.clear();
	if(window.localStorage.length == 0) {
		alert("Basket deleted.");
		$("#delete_basket").remove();
	}
}























