function Butterflyapp() {
this.butterflies = [];
this.bf_images = {"Brimstone": "brimstone_small.jpg",
		"Comma": "comma_small.jpg",
		"Common Blue": "commonblue_small.jpg",
		"Gatekeeper": "gatekeeper_small.jpg",
		"Green-veined White": "greenveinedwhite_small.jpg",
		"Holly Blue": "hollyblue_small.jpg",
		"Large Skipper": "largeskipper_small.jpg",
		"Large White": "largewhite_small.jpg",
		"Marbled White": "marbledwhite_small.jpg",
		"Meadow Brown": "meadowbrown_small.jpg",
		"Painted Lady": "paintedlady_small.jpg",
		"Peacock": "peacock_small.jpg",
		"Red Admiral": "redadmiral_small.jpg",
		"Ringlet": "ringlet_small.jpg",
		"Silver Y": "silvery_small.jpg",
		"Six-spot Burnet": "sixspotburnet_small.jpg",
		"Small Copper": "smallcopper_small.jpg",
		"Small Tortoiseshell": "smalltortoiseshell_small.jpg",
		"Small White": "smallwhite_small.jpg",
		"Speckled Wood": "speckledwood_small.jpg",
		"Wall": "wall_small.jpg"};
this.init = init;
this.createButterflies = createButterflies;
this.printButterflies = printButterflies;
this.showBasket = showBasket;
this.closeApp = closeApp;
return true;
}

Butterflyapp.prototype.basket = [];
Butterflyapp.prototype.addToBasket = function(sighting) { return this.basket.push(sighting); };
Butterflyapp.prototype.currentPosition = {latitude:"",longitude:""};

function init() {
	this.createButterflies("Small White","Large White","Green-veined White","Brimstone","Large Skipper","Six-spot Burnet","Silver Y","Common Blue","Holly Blue","Small Copper","Ringlet","Meadow Brown","Gatekeeper","Wall","Speckled Wood","Marbled White","Peacock","Small Tortoiseshell","Painted Lady","Comma","Red Admiral");
}

function createButterflies() {
	try {
		for(var i = 0; i < arguments.length; i++) {
			var bf = new Butterfly(arguments[i]);
			if(typeof(bf) == "object") {
				this.butterflies.push(bf);
			} else {
				throw "bfcreation_err";
			}
		}
	} catch(e) {
		var errormsg = "";
		if(e == "bfcreation_err") {
			errormsg += "Creation of butterfly object failed.";
		} else {
			errormsg += e.message;
		}
		alert(errormsg);
	}	
}

function printButterflies() {
	// get GPS coordinates:
	getPosition(this);
	$("#butterflylist").html("");
	for(var i = 0; i < this.butterflies.length; i++) {
		this.butterflies[i].printMe("butterflylist");
		$("#butterflylist").listview("refresh");
	}
}

function showBasket() {
	$("#sightingbasket").html("");
	if(this.basket.length) {
		for(var i = 0; i < this.basket.length; i++) {
			alert(this.basket[i].currentPosition.latitude+"\n"+this.basket[i].currentPosition.longitude);
			this.basket[i].printMe("basket");
			$("#sightingbasket").listview("refresh");
		}
	} else {
		$("#sightingbasket").html("<p>You have made no sighting yet.</p><p><a href='#bfc_choosebutterfly' data-role='button'>Create one!</a><p/>");
	}
}

function closeApp() {
	// note: force app to close for example in iOS is stromgly recommended NOT TO DO on Apple devices!
	// see: http://stackoverflow.com/questions/3154491/quit-app-when-pressing-home
	navigator.app.exitApp();
}

function getPosition(obj) {
	var onSuccess = function(position) {
		obj.currentPosition.latitude = position.coords.latitude;
		obj.currentPosition.longitude = position.coords.longitude;
		//alert("Latitude: "+position.coords.latitude+"\nLongitude: "+position.coords.longitude);
		//return true;
	};
	var onError = function(error) {
		obj.currentPosition.latitude = "default";
		obj.currentPosition.longitude = "default";
		var errormsg = "Your current position could not be retrieved.\n";
		switch(error.code) {
			case "PERMISSION_DENIED":
				errormsg += "Retrieving position information is disabled on the device.";
			break;
			case "POSITION_UNAVAILABLE":
				errormsg += "Make sure to have network connection or GPS enabled on your device.";
			break;
			// TIMEOUT only in combination with timeout parameter set in the getCurrentPosition function
			case "TIMEOUT":
				errormsg += "Specified timeout to retrieve position was exceeded.";
			break;
			default:
				errormsg += error.message;
		}
		alert(errormsg);
		//return false;
	};
	navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}














