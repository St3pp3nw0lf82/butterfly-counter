function Butterflyapp() {
this.butterflies = [];
this.init = init;
this.timer_id = 0;
this.createButterflies = createButterflies;
this.printButterflies = printButterflies;
this.showBasket = showBasket;
this.submitSightings = submitSightings;
this.checkForOlderSightings = checkForOlderSightings;
this.showMap = showMap;
this.deleteSighting = deleteSighting;
this.resetApp = resetApp;
this.closeApp = closeApp;
return true;
}

Butterflyapp.prototype.editSighting = [];
Butterflyapp.prototype.getPosition = getPosition;
Butterflyapp.prototype.checkConnection = checkConnection;
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
Butterflyapp.prototype.currentPosition = {"latitude":false,"longitude":false};

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
		// determine current position:
		this.getPosition();
		// repeat determining the position every 2 minutes (120000 milliseconds): 
		this.timer_id = setInterval(function() { this.getPosition(); },120000);
		// check for older sightings:
		this.checkForOlderSightings();
		// create the butterflies:
		//this.createButterflies("Small White","Large White","Green-veined White","Brimstone","Large Skipper","Six-spot Burnet","Silver Y","Common Blue","Holly Blue","Small Copper","Ringlet","Meadow Brown","Gatekeeper","Wall","Speckled Wood","Marbled White","Peacock","Small Tortoiseshell","Painted Lady","Comma","Red Admiral");
		this.createButterflies("Small White","Large White");
	} catch(e) {
		var errormsg = "Initialisation of the app failed.\n" + e.message;
		alert(errormsg);
	}
}

function getPosition() {
	// try getting position:
	var onSuccess = function(position,validPosition) {
		Butterflyapp.prototype.currentPosition.latitude = position.coords.latitude;
		Butterflyapp.prototype.currentPosition.longitude = position.coords.longitude;
	};
	var onError = function(error,validPosition) {
		Butterflyapp.prototype.currentPosition.latitude = false;
		Butterflyapp.prototype.currentPosition.longitude = false;
		//TODO: maybe its better not to display error messages every time position determining fails because it annoys the user:
		/*
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
		*/
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
}

function createButterflies() {
	try {
		for(var i = 0; i < arguments.length; i++) {
			var bf = new Butterfly(arguments[i],i);
			if(typeof(bf) === "object") {
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
	alert("in printbutterflies...");
	$("#butterflylist").html("");
	for(var i = 0; i < this.butterflies.length; i++) {
		this.butterflies[i].printMe("butterflylist");
		$("#bf_"+i).text(this.butterflies[i].getAmount());
		alert("doing refresh...");
		$("#butterflylist").listview("refresh");
	}
}

function showBasket(page) {
	$("#"+page).html("");
	// basket and older sightings:
	if(page == "sightingbasket") {
		$("#oldersightings").html("");
		$("#os_wrapper_old").css("display","none");
		$("#os_wrapper_new").css("display","none");
		$("#no_sightings").css("display","none");
		var no_sightings = true;
		if(this.olderSightings.length) {
			$("#os_wrapper_old").css("display","block");
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
			$("#os_wrapper_new").css("display","block");
			no_sightings = false;
			for(var i = 0; i < this.basket.length; i++) {
				this.basket[i].printMe(page);
				$("#"+page).listview("refresh");
			}
		}
		if(no_sightings) {
			$("#no_sightings").css("display","block");
		}
		if(no_sightings || (this.checkConnection()==false)) {
			$("#submit_option").addClass("ui-disabled");
			$("#submit_option").trigger("create");
			$("#map_option").addClass("ui-disabled");
			$("#map_option").trigger("create");
		} else {
			$("#submit_option").removeClass("ui-disabled");
			$("#submit_option").trigger("create");
			$("#map_option").removeClass("ui-disabled");
			$("#map_option").trigger("create");
		}
	// submitlist:
	} else {
		if(this.olderSightings.length) {
			for(var i = 0; i < this.olderSightings.length; i++) {
				this.olderSightings[i].submitlistItem = i;
				this.olderSightings[i].printMe("submitlist","old");
				$("#"+page).listview("refresh");
			}
		}
		if(this.basket.length) {
			for(var i = 0; i < this.basket.length; i++) {
				this.basket[i].submitlistItem = i;
				this.basket[i].printMe("submitlist","new");
				$("#"+page).listview("refresh");
			}
		}
	}
}

function checkConnection() {
	//return true;
	var networkState = navigator.network.connection.type;
	alert("networkstate: "+networkState);
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
		var sightings_toupload = false;
		// are there older sightings still to upload?:
		if(this.olderSightings.length) {
			sightings_toupload = true;
			// start upload process with first item:
			this.olderSightings[0].uploadMe("old");
		}
		// check basket is not empty:
		if(this.basket.length) {
			sightings_toupload = true;
			// start upload process with first item:
			this.basket[0].uploadMe("new");
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
		if(typeof(Storage) !== undefined) {
			// check the device platform:
			var platform = device.platform.toLowerCase()
			var quitapp = "";
			// make sure not to display the quit app button on an iOS platform:
			if(platform != "iphone" && platform != "ipad" && platform != "ios") {
			//if(platform == "android") {
				quitapp = "<p><a href='#' data-role='button' id='quit_app'>Quit app</a><p/>";
			}
			if(window.localStorage.getItem("sightings") !== null) {
				// first clear olderSightings array:
				var len = this.olderSightings.length;
				while(len--) {
					this.olderSightings.pop();
				}
				var sightings = JSON.parse(window.localStorage.getItem("sightings"));
				if(typeof(sightings) === "object" && sightings !== null) {
					$("#startoptions").html("");
					if(sightings.length) {
						$("#startoptions").html("<p><a href='#bfc_choosebutterfly' data-role='button' id='start_sighting'>Start sighting session</a><p/><p><a href='#bfc_summary' data-role='button'>Older sightings</a><p/>"+quitapp);
						
					} else {
						$("#startoptions").html("<p><a href='#bfc_choosebutterfly' data-role='button' id='start_sighting'>Start sighting session</a></p>"+quitapp);
					}
					$("#startoptions").trigger("create");
					for(var i = 0; i < sightings.length; i++) {
						var init_args = {
							id: sightings[i].id,
							name: sightings[i].name,
							positionInStorage: i,
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
							serverMessage: sightings[i].serverMessage,
						};
						var bf = new Butterfly(sightings[i].name,sightings[i].id,init_args);
						if(typeof(bf) === "object") {
							this.olderSightings.push(bf);
						} else {
							throw "bfrecover_err";
						}
					}
				}
			} else {
				$("#startoptions").html("<p><a href='#bfc_choosebutterfly' data-role='button' id='start_sighting'>Start sighting session</a></p>"+quitapp);
				$("#startoptions").trigger("create");
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
	try {
		var showonmap = 0;
		showonmap = this.basket.length + this.olderSightings.length;
		
		if(showonmap > 0) {
			if(this.basket.length) {
				for(var i = 0; i < this.basket.length; i++) {
					// is the position valid?:
					if(this.basket[i].validateMyPosition()) {
						var position = this.basket[i].getMyPosition();
					} else {
						// use default value:
						var position = "51.042271,-1.588427";
					}
					// build the info window:
					var name = this.basket[i].getName();
					var amount = this.basket[i].getAmount();
					var path = window.location.toString();
					var index = path.lastIndexOf('/');
					var pathto = path.slice(0,index);
					var image = pathto+"/images/"+this.bf_images[this.basket[i].getName()];
					var infowindow = "<div id='iw_wrapper'><img src='"+image+"' class='iw_bfimage'/><p class='iw_bffacts'>Name: <strong>"+name+"</strong><br />Counts: <strong>"+amount+"</strong></p>";
					// create the marker:
					$('#map_canvas').gmap('addMarker', {'position': position, 'bounds': true}).click(function() {
							$('#map_canvas').gmap('openInfoWindow', {'content': infowindow}, this);
					});
				}
			}
			if(this.olderSightings.length) {
				for(var i = 0; i < this.olderSightings.length; i++) {
					// is the position valid?:
					if(this.olderSightings[i].validateMyPosition()) {
						var position = this.olderSightings[i].getMyPosition();
					} else {
						// use default value:
						var position = "51.042271,-1.588427";
					}
					// build the info window:
					var name = this.olderSightings[i].getName();
					var amount = this.olderSightings[i].getAmount();
					var path = window.location.toString();
					var index = path.lastIndexOf('/');
					var pathto = path.slice(0,index);
					var image = pathto+"/images/"+this.bf_images[this.olderSightings[i].getName()];
					var infowindow = "<div id='iw_wrapper'><img src='"+image+"' class='iw_bfimage'/><p class='iw_bffacts'>Name: <strong>"+name+"</strong><br />Counts: <strong>"+amount+"</strong></p>";
					// create the marker:
					$('#map_canvas').gmap('addMarker', {'position': position, 'bounds': true}).click(function() {
							$('#map_canvas').gmap('openInfoWindow', {'content': infowindow}, this);
					});
				}
			}
		} else {
			throw "nosightings_err";
		}
	} catch(e) {
		var errormsg = "Display of the map failed.\n";
		switch(e) {
			case "nosightings_err":
				errormsg += "No sightings found.";
			break;
			default:
				errormsg += e.message;
			break;
		}
		alert(errormsg);
	}
}

function deleteSighting() {
	try {
		if(this.editSighting.length) {
			var ok = confirm("Delete this sighting?");
			if(ok) {
				var deletion_ok = false;
				var adjust_positions = false;
				if(this.editSighting[0].status == "new") {
					if(this.editSighting[0].me.positionInBasket < this.basket.length-1) {
						adjust_positions = true;
						var i = this.editSighting[0].me.positionInBasket;
					}
					// delete from sighting basket:
					var oldlength = this.basket.length;
					this.basket.splice(this.editSighting[0].me.positionInBasket,1);
					var newlength = this.basket.length;
					if(newlength < oldlength) {
						deletion_ok = true;
						if(adjust_positions) {
							for(i; i < this.basket.length; i++) {
								this.basket[i].positionInBasket = i;
							}
						}
					}	
					this.editSighting[0].me.resetMe();
				} else {
					// adjust the position properties of every bf item in olderSightings and localStorage if necessary:
					if(typeof(Storage) !== undefined) {
						if(window.localStorage.getItem("sightings") !== null) {
							var sightings = JSON.parse(window.localStorage.getItem("sightings"));
						} else {
							throw "locstoraccess_err";
						}
						
						var diff_length = sightings.length - this.olderSightings.length;
						var diff_pos = this.editSighting[0].me.positionInStorage - this.editSighting[0].me.positionInOlderSightings;
						// make sure both arrays and positions of bf item stored in them are equal:
						if(!diff_length && !diff_pos) {
							if(this.editSighting[0].me.positionInOlderSightings < this.olderSightings.length-1) {
								adjust_positions = true;
								var i = this.editSighting[0].me.positionInOlderSightings;
							}
							// delete from older sightings ...:
							var oldlength_os = this.olderSightings.length;
							this.olderSightings.splice(this.editSighting[0].me.positionInOlderSightings,1);
							var newlength_os = this.olderSightings.length;
							// ... and local storage:
							var oldlength_ls = sightings.length;
							sightings.splice(this.editSighting[0].me.positionInStorage,1);
							var newlength_ls = sightings.length;
							if((newlength_os < oldlength_os) && (newlength_ls < oldlength_ls)) {
								deletion_ok = true;
								if(adjust_positions) {
									for(i; i < this.olderSightings.length; i++) {
										this.olderSightings[i].positionInOlderSightings = i;
										sightings[i].positionInOlderSightings = i;
										this.olderSightings[i].positionInStorage = i;
										sightings[i].positionInStorage = i;
									}
								}
								window.localStorage.setItem("sightings",JSON.stringify(sightings));
							} else {
								throw "erase_err";
							}
						} else {
							throw "diff_err";
						}
					} else {
						throw "locstor_err";
					}
				}
				// after editing, delete item from editSighting again:
				this.editSighting.splice(0,1);
				if(deletion_ok) {
					alert("Sighting deleted.");
				}
				// back to summary page again:
				$.mobile.changePage("#bfc_summary");
			}
		}
	} catch(e) {
		var errormsg = "Erasure of the sighting failed.\n";
		switch(e) {
			case "locstor_err":
				errormsg += "Local storage is not supported on the device.";
			break;
			case "diff_err":
				errormsg += "Both local storage and older sightings arrays differ.";
			break;
			case "erase_err":
				errormsg += "Removal was faulty.";
			break;
			case "locstoraccess_err":
				errormsg += "Access to local storage failed.";
			break;
			default:
				errormsg += e.message;
		}
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

function resetApp() {
	var sightings = JSON.parse(window.localStorage.getItem("sightings"));
	var len = this.olderSightings.length;
	while(len--) {
		this.olderSightings.pop();
	}
	var slen = sightings.length;
	while(slen--) {
		sightings.pop();
	}
	window.localStorage.setItem("sightings",JSON.stringify(sightings));
}

function closeApp() {
	clearInterval(this.timer_id);
	// note: force app to close for example in iOS is stromgly recommended NOT TO DO on Apple devices!
	// see: http://stackoverflow.com/questions/3154491/quit-app-when-pressing-home
	navigator.app.exitApp();
}















