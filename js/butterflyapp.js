function Butterflyapp() {
this.butterflies = [];
this.init = init;
this.getPosition = getPosition;
this.createButterflies = createButterflies;
this.printButterflies = printButterflies;
this.showBasket = showBasket;
this.showMap = showMap;
this.closeApp = closeApp;
return true;
}

Butterflyapp.prototype.basket = [];
Butterflyapp.prototype.bf_images = {"Brimstone": "brimstone_small.jpg",
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
Butterflyapp.prototype.addToBasket = function(sighting) { return this.basket.push(sighting); };
Butterflyapp.prototype.currentPosition = {"latitude":"","longitude":"","lastTaken":""};

function init() {
	this.createButterflies("Small White","Large White","Green-veined White","Brimstone","Large Skipper","Six-spot Burnet","Silver Y","Common Blue","Holly Blue","Small Copper","Ringlet","Meadow Brown","Gatekeeper","Wall","Speckled Wood","Marbled White","Peacock","Small Tortoiseshell","Painted Lady","Comma","Red Admiral");
}

function getPosition() {
	// get timestamp:
	var d = new Date();
	this.currentPosition.lastTaken = d.getTime();
	// try getting position:
	var onSuccess = function(position) {
		Butterflyapp.prototype.currentPosition.latitude = position.coords.latitude;
		Butterflyapp.prototype.currentPosition.longitude = position.coords.longitude;
		//return true;
	};
	var onError = function(error) {
		//TODO: deal with default values:
		Butterflyapp.prototype.currentPosition.latitude = "default";
		Butterflyapp.prototype.currentPosition.longitude = "default";
		var errormsg = "Your current position could not be retrieved.\n";
		switch(error.code) {
			case "PERMISSION_DENIED":
				errormsg += "Retrieving position information is disabled on the device.";
			break;
			case "POSITION_UNAVAILABLE":
				errormsg += "Make sure to have network connection or GPS enabled on your device.";
			break;
			// TIMEOUT only in combination with timeout parameter set in the getCurrentPosition function below
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
	var now = new Date().getTime();
	var time_diff = ((now - this.currentPosition.lastTaken)*0.001);
	time_diff = parseInt(Math.round(time_diff));
	// make new sighting after 2 mins?: 
	if(time_diff > 120) {
		this.getPosition();
	}
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
			this.basket[i].printMe("basket");
			$("#sightingbasket").listview("refresh");
		}
	} else {
		$("#sightingbasket").html("<p>You have made no sighting yet.</p><p><a href='#bfc_choosebutterfly' data-role='button'>Create one!</a><p/>");
	}
}

function showMap() {
	if(this.basket.length) {		
		$('#map_canvas').gmap().bind('init', function(ev, map) {
			//$('#map_canvas').gmap('option','zoom',15);
			//for(var i = 0; i < Butterflyapp.prototype.basket.length; i++) {
				/*
				if(i < Butterflyapp.prototype.basket.length-1) {
					var thislat = Butterflyapp.prototype.basket
				}
				*/
				$('#map_canvas').gmap('addMarker', {'position': Butterflyapp.prototype.basket[0].getMyPosition(), 'bounds': true}).click(function() {
					var name = Butterflyapp.prototype.basket[0].getName();
					var amount = Butterflyapp.prototype.basket[0].getAmount();
					var path = window.location.toString();
					var index = path.lastIndexOf('/');
					var pathto = path.slice(0,index);
					var image = pathto+"/images/"+Butterflyapp.prototype.bf_images[Butterflyapp.prototype.basket[0].getName()];
					var infowindow = "<div id='iw_wrapper'><img src='"+image+"' class='iw_bfimage'/><p class='iw_bffacts'>Name: <strong>"+name+"</strong><br />Counts: <strong>"+amount+"</strong></p>";
					$('#map_canvas').gmap('openInfoWindow', {'content': infowindow}, this);
				});
			//}
		});
	}
}

function closeApp() {
	// note: force app to close for example in iOS is stromgly recommended NOT TO DO on Apple devices!
	// see: http://stackoverflow.com/questions/3154491/quit-app-when-pressing-home
	navigator.app.exitApp();
}
















