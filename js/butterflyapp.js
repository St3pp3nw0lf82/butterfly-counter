function Butterflyapp() {
this.butterflies = [];
this.init = init;
this.getPosition = getPosition;
this.createButterflies = createButterflies;
this.printButterflies = printButterflies;
this.showBasket = showBasket;
this.checkConnection = checkConnection;
this.storeSightings = storeSightings;
this.submitSightings = submitSightings;
this.showMap = showMap;
this.closeApp = closeApp;
return true;
}

Butterflyapp.prototype.validPosition = false;
Butterflyapp.prototype.date = false;
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
Butterflyapp.prototype.currentPosition = {"latitude":false,"longitude":false,"lastTaken":false};

function init() {
	var d = new Date();
	var day = "" + d.getDate();
	if(day.length == 1) { day = "0" + day; }
	var month = d.getMonth();
	month += 1;
	month = "" + month;
	if(month.length == 1) { month = "0" + month; }
	var year = d.getFullYear();
	var today = day + "/" + month + "/" + year;
	alert("today: "+today)
	Butterflyapp.prototype.date = today;
	this.createButterflies("Small White","Large White","Green-veined White","Brimstone","Large Skipper","Six-spot Burnet","Silver Y","Common Blue","Holly Blue","Small Copper","Ringlet","Meadow Brown","Gatekeeper","Wall","Speckled Wood","Marbled White","Peacock","Small Tortoiseshell","Painted Lady","Comma","Red Admiral");
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
		$("#"+i).text(this.butterflies[i].getAmount());
		$("#butterflylist").listview("refresh");
	}
}

function showBasket(page) {
	//TODO: page parameter der festlegt fuer welche seite basket aufgabeut wird (basket oder submit page)
	$("#"+page).html("");
	if(this.basket.length) {
		for(var i = 0; i < this.basket.length; i++) {
			this.basket[i].printMe(page);
			$("#"+page).listview("refresh");
		}
	} else {
		$("#"+page).html("<p>You have made no sighting yet.</p><p><a href='#bfc_choosebutterfly' data-role='button'>Create one!</a><p/>");
	}
}

function checkConnection() {
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'UNKNOWN';
	states[Connection.ETHERNET] = 'ETHERNET';
	states[Connection.WIFI]     = 'WIFI';
	states[Connection.CELL_2G]  = '2G';
	states[Connection.CELL_3G]  = '3G';
	states[Connection.CELL_4G]  = '4G';
	states[Connection.NONE]     = 'NONE';
	//alert("networkstate: "+networkState);
	if(states[networkState] == "UNKNOWN" || states[networkState] == "NONE") {
		return false;
		//alert("false");
	} else {
		//alert("true");
		return true;
	}
}

function storeSightings() {

}

function submitSightings() {
	try {
		// check for network connection:
		if(this.checkConnection()) {
			// check basket is not empty:
			if(this.basket.length) {
				// try to submit each sighting:
				//var submitQueue = new Array();
				for(var i = 0; i < this.basket.length; i++) {
					var data = "";
					var position_valid, upload_success = false;
					// only items with valid position object:
					if(this.basket[i].validateMyPosition()) {
						position_valid = true;
						// name, amount, date&time, position
						data += "name=" + this.basket[i].getName() + "&" +
						"amount=" + this.basket[i].getAmount() + "&" +
						"date=" + this.basket[i].getDate() + "&" +
						"time=" + this.basket[i].getTime() + "&" +
						"position=" + this.basket[i].getMyPosition();
						/*
						var oldlength = submitQueue.length;
						var newlength = submitQueue.push(this.basket[i]);
						if(!(oldlength < newlength)) {
							throw "insertqueue_err";
						}
						*/
					// try to determine position again:
					} else {
						if(!this.validPosition) {
							this.getPosition();
						}
						if(this.validPosition) {
							this.basket[i].myPosition.latitude = this.currentPosition.latitude;
							this.basket[i].myPosition.longitude = this.currentPosition.longitude;
							position_valid = true;
							// name, amount, date&time, position
							data += "name=" + this.basket[i].getName() + "&" +
							"amount=" + this.basket[i].getAmount() + "&" +
							"date=" + this.basket[i].getDate() + "&" +
							"time=" + this.basket[i].getTime() + "&" +
							"position=" + this.basket[i].getMyPosition();
							/*
							var oldlength = submitQueue.length;
							var newlength = submitQueue.push(this.basket[i]);
							if(oldlength < newlength) {
								throw "insertqueue_err";
							}
							*/
						} else {
							//TODO: add message to this bf element to inform user
							//$('#'+this.basket[i].id).text("Invalid position");
							
						}					
					}
					if(position_valid) {
						alert("data: "+data);
						/*
						$.ajax({
							url: 'http://192.168.1.29/bfsighting.php',
							type: 'POST',
							data: data,
							success: function(data) {

							},
							error: function() {

							}
						});
						*/
					}
					if(!position_valid || !upload_success) {
						// check if local storage is available and store this bf object:
						if(typeof(Storage) !== "undefined") {
							var storage = window.localStorage.key(0);
							if(storage === null || storage === undefined) {
								var sightings = new Array(this.basket[i]);
								window.localStorage.setItem("sightings",JSON.stringify(sightings));
							}
							/*
							var sightings = JSON.parse(window.localStorage.getItem("sightings"));
							sightings.push(this.basket[0]);
							window.localStorage.setItem("sightings",JSON.stringify(sightings));
							var check = JSON.parse(window.localStorage.getItem("sightings"));
							*/
						} else {
							throw "storage_err";
						}
					}
				}
			} else {
				throw "nosightings_err";
			}
		} else {
			throw "connection_err"
		}
		

				//alert("output of stored bf: "+check[0].me_butterflylist);
				//var checkSightings = storage
				/*
				if(!storage.getItem("sightings")) {
					alert("creating storage");
					window.localStorage.setItem("sightings", []);
			
				} else { alert("storage already exists"); }
				
			}
			/*
			if(typeof(storage) === "object") {
				var myobj = JSON.stringify(this.basket[0]);
				
				//for(var i = 0; i < this.basket.length; i++) {
					
				//}
			} else {
			
			}
			/*
			// get database object to access device storage:
			// 1mb == 1024 X 1024 bytes -> 1048576
			var db = window.openDatabase("sightings","1.0","Sighting database",1048576);
			// access local database:
			function createDB(tx) {
				tx.executeSql("create table if not exists bf_sightings (id integer not null primary key autoincrement,bf_id integer not null,sighting text)");
			}
			function errorCreate(err) {
				alert("Error creating table 'bf_sightings': "+err.message);
			}
			function successCreate() {
				alert("Table 'bf_sightings' successfully created!");	
			}
			db.transaction(createDB, errorCreate, successCreate);
			/*
			// build insert query:
			var insert_query = "insert into bf_sightings (bf_id, sighting)";
			for(var i = 0; i < this.basket.length; i++) {
				insert_query +=" select "+this.basket[i].id+" as bf_id,"+JSON.stringify(this.basket[i])+" as sighting";
				if(i < this.basket.length-1) { insert_query += " union"; }
			}
			//alert("insert query: "+insert_query);
			// insert values into db:
			function insertDB(tx,insert_query) {
				tx.executeSql(insert_query);
			}
			function errorInsert(err) {
				alert("Error inserting values into database: "+err.code);
			}
			function successInsert() {
				alert("Values successfully inserted!");
			}
			db.transaction(insertDB, errorInsert, successInsert);
			// check the network connection:
			/*
			if(this.checkConnection()) {
		
			} else {
				throw "connection_err";
			}
			*/
	} catch(e) {
		var errormsg = "";
		switch(e) {
			case "connection_err":
				errormsg += "Currently there is no network connection available.";
			break;
			case "storage_err":
				errormsg += "Local storage is not supported on the device.";
			break;
			case "nosightings_err":
				errormsg += "There are no sightings to submit.";
			break;
			case "insertqueue_err":
				errormsg += "The current butterfly object could not be added to the submit queue.";
			break;
			default:
				errormsg += "An error occurred trying to submit your sightings: "+e.message;
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
















