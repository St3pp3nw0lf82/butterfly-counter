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

function init() {
	alert("in init");
	//this.createButterflies("Small White");
	this.createButterflies("Small White","Large White","Green-veined White","Brimstone","Large Skipper","Six-spot Burnet","Silver Y","Common Blue","Holly Blue","Small Copper","Ringlet","Meadow Brown","Gatekeeper","Wall","Speckled Wood","Marbled White","Peacock","Small Tortoiseshell","Painted Lady","Comma","Red Admiral");
}

function createButterflies() {
	try {
		alert("in createbutterflies");
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
	alert("in printbutterflies");
	$("#butterflylist").html("");
	for(var i = 0; i < this.butterflies.length; i++) {
		this.butterflies[i].printMe();
	}
}

function showBasket() {
	var bf_summary = "";
	if(this.basket.length) {
		for(var i = 0; i < this.basket.length; i++) {
			bf_summary += "<p>Name: "+this.basket[i].getName()+"</br >Amount: "+this.basket[i].getAmount()+"</p>";
		}
	} else {
		bf_summary += "<p>You have made no sighting yet.</p><p><a href='#bfc_choosebutterfly' data-role='button'>Create one!</a><p/>";
	}
	$("#sightingbasket").html(bf_summary);
}

function closeApp() {
	// note: force app to close for example in iOS is stromgly recommended not to do on Apple devices!
	// see: http://stackoverflow.com/questions/3154491/quit-app-when-pressing-home
	navigator.app.exitApp();
}














