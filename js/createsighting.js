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
		if(typeof(Storage) !== "undefined") {
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
		if(typeof(Storage) !== "undefined") {
			if(!window.localStorage.bf_basket) {
				var bf_basket = new Basket();
				window.localStorage.bf_basket = JSON.stringify(bf_basket);
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
/*
function create_sightingobject() {
	try {
		var sighting = new Sighting($(this).text());
		current_sightings.push(sighting);
/*
		if(window.localStorage.bf_basket) {
			var bf_basket = JSON.parse(window.localStorage.bf_basket);
			if(typeof(bf_basket) == "object") {
				var sighting = new Sighting($(this).text());
				if(typeof(sighting) == "object") {
					bf_basket.insertSighting(sighting);
					window.localStorage.bf_basket = JSON.stringify(bf_basket);
				} else {
					throw "init_err";
				}
			}
		} else {
			throw "basket_err";
		}

	}
	catch(e) {
		var errormsg = "An error occurred while creating a sighting object.\n";
		if(e == "init_err") { 
			errormsg += "Initialisation of sighting object failed.";
		} else if(e == "basket_err") { 
			errormsg += "No basket found.";
		} else {
			errormsg += "Error message: " + e.message;
		}
		alert(errormsg);
	}
}
*/
function edit_amount() {
	if(current_sightings.length > 0) {
	}
	var amount = 0;
	
	try {
		if(window.localStorage.bf_basket) {
			var bf_basket = JSON.parse(window.localStorage.bf_basket);
			if(typeof(bf_basket) == "object") {
				var items = bf_basket.length;
				var sighting = bf_basket.sightings[items-1];
				if(typeof(sighting) == "object") {
					sighting.increaseAmount();
					bf_basket.insertSighting(sighting);
					window.localStorage.bf_basket = JSON.stringify(bf_basket);
				} else {
					throw "init_err";
				}
			}
		} else {
			throw "basket_err";
		}
	}
	catch(e) {

	}
}

function delete_basket() {
	window.localStorage.clear();
	if(window.localStorage.length == 0) {
		alert("Basket deleted.");
		$("#delete_basket").remove();
	}
}























