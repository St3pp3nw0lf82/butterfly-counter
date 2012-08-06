function Butterflyapp() {
this.butterflies = [];
this.init = init;
this.createButterflies = createButterflies;
this.printButterflies = printButterflies;
this.showBasket = showBasket;
//this.checkConnection = checkConnection;
this.submitSightings = submitSightings;
this.checkForOlderSightings = checkForOlderSightings;
this.showMap = showMap;
this.deleteSighting = deleteSighting;
this.closeApp = closeApp;
return true;
}

Butterflyapp.prototype.editSighting = [];
Butterflyapp.prototype.getPosition = getPosition;
Butterflyapp.prototype.checkConnection = checkConnection;
Butterflyapp.prototype.validPosition = false;
Butterflyapp.prototype.date = false;
Butterflyapp.prototype.basket = [];
Butterflyapp.prototype.olderSightings = [];
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
Butterflyapp.prototype.currentPosition = {"latitude":false,"longitude":false,"lastTaken":false};

function init() {
	try {
		var d = new Date();
		var day = "" + d.getDate();
		if(day.length == 1) { day = "0" + day; }
		var month = d.getMonth();
		month += 1;
		month = "" + month;
		if(month.length == 1) { month = "0" + month; }
		var year = d.getFullYear();
		var today = day + "/" + month + "/" + year;
		Butterflyapp.prototype.date = today;
		// check for older sightings:
		//this.checkForOlderSightings();
		//this.createButterflies("Small White","Large White","Green-veined White");
		this.createButterflies("Small White","Large White","Green-veined White","Brimstone","Large Skipper","Six-spot Burnet","Silver Y","Common Blue","Holly Blue","Small Copper","Ringlet","Meadow Brown","Gatekeeper","Wall","Speckled Wood","Marbled White","Peacock","Small Tortoiseshell","Painted Lady","Comma","Red Admiral");
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

function getPosition() {
	// get timestamp:
	var d = new Date();
	this.currentPosition.lastTaken = d.getTime();
	// try getting position:
	var onSuccess = function(position,validPosition) {
		Butterflyapp.prototype.currentPosition.latitude = position.coords.latitude;
		Butterflyapp.prototype.currentPosition.longitude = position.coords.longitude;
		Butterflyapp.prototype.validPosition = true;
	};
	var onError = function(error,validPosition) {
		//TODO: deal with default values:
		Butterflyapp.prototype.currentPosition.latitude = false;
		Butterflyapp.prototype.currentPosition.longitude = false;
		Butterflyapp.prototype.validPosition = false;
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
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}

function createButterflies() {
	try {
		for(var i = 0; i < arguments.length; i++) {
			var bf = new Butterfly(arguments[i],i);
			if(typeof(bf) === "object") {
				//bf.addListener("success", bf.updateMe());
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
	//alert("in printButterflies ...");
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
		$("#bf_"+i).text(this.butterflies[i].getAmount());
		$("#butterflylist").listview("refresh");
	}
}

function showBasket(page) {
	if(page == "sightingbasket") {
		$("#oldersightings").html("");
	}
	$("#"+page).html("");
	var no_sightings = true;
	if(this.olderSightings.length) {
		no_sightings = false;
		for(var i = 0; i < this.olderSightings.length; i++) {
			if(page == "sightingbasket") {
				this.olderSightings[i].printMe("oldersightings");
				$("#oldersightings").listview("refresh");
			} else {
				this.olderSightings[i].printMe(page);
				$("#"+page).listview("refresh");
			}
		}
	}
	if(this.basket.length) {
		no_sightings = false;
		for(var i = 0; i < this.basket.length; i++) {
			this.basket[i].printMe(page);
			$("#"+page).listview("refresh");
		}
	}
	if(no_sightings) {
		$("#"+page).html("<p>You have made no sighting yet.</p><p><a href='#bfc_choosebutterfly' data-role='button'>Create one!</a><p/>");
	}
}

function checkConnection() {
	//TODO: remove the line below!!!!!!!!!!:
	//return true;
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'UNKNOWN';
	states[Connection.ETHERNET] = 'ETHERNET';
	states[Connection.WIFI]     = 'WIFI';
	states[Connection.CELL_2G]  = '2G';
	states[Connection.CELL_3G]  = '3G';
	states[Connection.CELL_4G]  = '4G';
	states[Connection.NONE]     = 'NONE';

	if(states[networkState] == "UNKNOWN" || states[networkState] == "NONE") {
		return false;
	} else {
		return true;
	}
}

function submitSightings() {
	try {
		$("submitlist").html("");
		//TODO: 
		// UEBERGABEPARAMETER FUER submitSightings(), das angibt welches array mit bf-elementen uebertragen werden soll
		var sightings_toupload = false;
		// are there older sightings still to upload?:
		if(this.olderSightings.length) {
			sightings_toupload = true;
			// try to submit each sighting:
			for(var i = 0; i < this.olderSightings.length; i++) {
				//this.olderSightings[i].uploadMe("old",i);
				this.olderSightings[i].uploadMe("old");
			}
		}
		// check basket is not empty:
		if(this.basket.length) {
			sightings_toupload = true;
			// try to submit each sighting:
			for(var i = 0; i < this.basket.length; i++) {
				//this.basket[i].uploadMe("new",i);
				this.basket[i].uploadMe("new");
			}
		}
		if(!sightings_toupload) {
			throw "nosightings_err";
		}
	} catch(e) {
		var errormsg = "";
		if(e == "nosightings_err") {
			errormsg += "There are no sightings to submit.";
		} else {
			errormsg += e.message;
		}
		alert(errormsg);
	}
}

function checkForOlderSightings() {
	try {
		if(typeof(Storage) !== "undefined") {
			var storage = window.localStorage.key(0);
			//TODO: check === vs. == :
			alert("in checkforoldersightings, storage: "+storage);
			if(storage !== null || storage !== undefined) {
				alert("in checkforoldersightings, storage is not null: "+storage);
				// first clear olderSightings array:
				var len = this.olderSightings.length -1;
				for(var i = len; this.olderSightings[i]; i--) {
					this.olderSightings.pop(i);
				}
				//alert("items in older sightings: "+this.olderSightings.length);
				//this.olderSightings.length = 0;
				var sightings = JSON.parse(window.localStorage.getItem("sightings"));
				if(typeof(sightings) === "object" && sightings !== null) {
					//alert("length of sightings: "+sightings.length);
					//TODO: attach submit older sightings button to the start page:
					if(sightings.length) {
						$("startoptions").html("");
						$("startoptions").html("<p><a href='#bfc_choosebutterfly' data-role='button' id='start_sighting'>Start sighting session</a><p/><p><a href='#bfc_submit' data-role='button'>Submit older sightings</a><p/><p><a href='#' data-role='button' id='quit_app'>Quit app</a><p/>");
					}
					//alert("items in localStorage: "+sightings.length);
					for(var i = 0; i < sightings.length; i++) {
						var init_args = {
							id: sightings[i].id,
							name: sightings[i].name,
							positionInStorage: i,
							// TODO: when a sighting was stored locally, it can't be in basket:
							positionInBasket: null,
							positionInOlderSightings: this.olderSightings.length,
							amount: sightings[i].amount,
							date: sightings[i].date,
							time: sightings[i].time,
							myPosition: {latitude: sightings[i].myPosition.latitude,
								longitude: sightings[i].myPosition.longitude,
								isSet: sightings[i].myPosition.isSet},
							inBasket: true,
							errorCode: {position: sightings[i].errorCode.position,
								network: sightings[i].errorCode.network,
								server: sightings[i].errorCode.server},
							//errorCode: sightings[i].errorCode,
							serverMessage: sightings[i].serverMessage,
						};
						//alert(init_args.name);
						var bf = new Butterfly(sightings[i].name,sightings[i].id,init_args);
						if(typeof(bf) === "object") {
							//bf.addListener("success", this.updateMe());
							this.olderSightings.push(bf);
						} else {
							throw "bfrecover_err";
						}
					}
				}
			}
		} else {
			throw "storage_err";
		}
	} catch(e) {
		var errormsg = "Check for stored, older sightings failed.\n";
		if(e == "storage_err") {
			errormsg += "Local storage not supported on the device.";
		} else if(e == "bfrecover_err") {
			errormsg += "Recovery failed.";
		} else {
			errormsg += e.message;
		}
		alert(errormsg);
	}
}

function showMap() {
	if(this.basket.length) {		
		$('#map_canvas').gmap().bind('init', function(ev, map) {
			if(Butterflyapp.prototype.basket.length >= 2) {
				for(var i = 0; i < Butterflyapp.prototype.basket.length-1; i++) {
					for(var j =(i+1); j < array.length; j++) {
						var latdiff = parseInt(array[i].myPosition.latitude) - parseInt(array[j].myPosition.latitude);
						var longdiff = parseInt(array[i].myPosition.longitude) - parseInt(array[j].myPosition.longitude);
						if((latdiff == 0) && (longdiff == 0)) {  }
					}
					// build the info window:
					var name = Butterflyapp.prototype.basket[i].getName();
					var amount = Butterflyapp.prototype.basket[i].getAmount();
					var path = window.location.toString();
					var index = path.lastIndexOf('/');
					var pathto = path.slice(0,index);
					var image = pathto+"/images/"+Butterflyapp.prototype.bf_images[Butterflyapp.prototype.basket[i].getName()];
					var infowindow = "<div id='iw_wrapper'><img src='"+image+"' class='iw_bfimage'/><p class='iw_bffacts'>Name: <strong>"+name+"</strong><br />Counts: <strong>"+amount+"</strong></p>";
					// create the marker:
					$('#map_canvas').gmap('addMarker', {'position': Butterflyapp.prototype.basket[i].getMyPosition(), 'bounds': true}).click(function() {
							$('#map_canvas').gmap('openInfoWindow', {'content': infowindow}, this);
					});
				}
			}
		});
	}
}

function deleteSighting() {
	try {
		if(this.editSighting.length) {
			var ok = confirm("Delete this sighting?");
			if(ok) {
				if(this.editSighting[0].status == "new") {
					if(this.editSighting[0].me.positionInBasket < this.basket.length-1) {
						var i = this.editSighting[0].me.positionInBasket;
						for(var j = i+1; j < this.basket.length; j++) {
							this.basket[j].positionInBasket = j-1;
						}
					}
					this.basket.splice(this.editSighting[0].me.positionInBasket,1);			
				} else {
					//alert("in deleteSighting, positionInOlderSightings des zu loeschenden elements: "+this.editSighting[0].me.positionInOlderSightings);
					// adjust the position properties of every bf item in olderSightings and localStorage if necessary:
					if(typeof(Storage) !== "undefined") {
						var sightings = JSON.parse(window.localStorage.getItem("sightings"));
					}
					if(this.editSighting[0].me.positionInOlderSightings < this.olderSightings.length-1) {
						var i = this.editSighting[0].me.positionInOlderSightings;
						for(var j = i+1; j < this.olderSightings.length; j++) {
							this.olderSightings[j].positionInOlderSightings = j-1;
							sightings[j].positionInStorage = j-1;
						}
					}
					// delete from local storage:
					if(typeof(Storage) !== "undefined") {
						alert("delete from local stoprage...");
						for(var i = 0; i < sightings.length; i++) {
							//alert("index: "+i+", item: "+sightings[i].name);
						}
						sightings.splice(this.editSighting[0].me.positionInStorage,1);
						window.localStorage.setItem("sightings",JSON.stringify(sightings));
					}
					// delete from older sightings:
					this.olderSightings.splice(this.editSighting[0].me.positionInOlderSightings,1);
					/*
					for(var i=0; i < this.olderSightings.length; i++) {
						alert("index: "+i+", element: "+this.olderSightings[i].name);
					}
					*/
				}
				// after editing, delete item from editSighting again:
				this.editSighting.splice(0,1);
			}
		}
	} catch(e) {
		var errormsg = "Erasure of the sighting failed.\n" + e.message;
		alert(errormsg);
	}
}

function comparePositions(array) {
	//TODO: check for array == array
	for(var i = 0; i < array.length-1; i++) {
		for(var j =(i+1); j < array.length; j++) {
			var latdiff = parseInt(array[i].myPosition.latitude) - parseInt(array[j].myPosition.latitude);
			var longdiff = parseInt(array[i].myPosition.longitude) - parseInt(array[j].myPosition.longitude);
			if((latdiff == 0) && (longdiff == 0)) {  }
		}
	}
}

function closeApp() {
	// note: force app to close for example in iOS is stromgly recommended NOT TO DO on Apple devices!
	// see: http://stackoverflow.com/questions/3154491/quit-app-when-pressing-home
	navigator.app.exitApp();
}

/*
function deleteStorage() {
	if(this.olderSightings.length) {
		alert("delete olderSightings...");
		this.olderSightings.length = 0;
		alert("after delete, length of olderSightings: "+this.olderSightings.length);
	}
}
*/















