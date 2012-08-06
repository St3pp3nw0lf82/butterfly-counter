function Butterfly(name,index,optionalArg) {
this.id = index;
this.name = name;
if(typeof(optionalArg) === "undefined") {
	this.positionInStorage = null;
	this.positionInBasket = null;
	this.positionInOlderSightings = null;
	this.amount = 0;
	this.date = false;
	this.time = false;
	this.myPosition = {"latitude":false,"longitude":false,"isSet":false};
	this.inBasket = false;
	//this.errorCode = 0;
	this.errorCode = {"position":false,"network":false,"server":false}; /* 0 = no error, 1 = invalid position, 2 = no network connection, 3 = server error */
	this.serverMessage = false;
} else {
	this.positionInStorage = optionalArg.positionInStorage;
	this.positionInBasket = optionalArg.positionInBasket;
	this.positionInOlderSightings = optionalArg.positionInOlderSightings;
	this.amount = optionalArg.amount;
	this.date = optionalArg.date;
	this.time = optionalArg.time;
	this.myPosition = {"latitude":optionalArg.myPosition.latitude,"longitude":optionalArg.myPosition.longitude,"isSet":optionalArg.myPosition.isSet};
	this.inBasket = optionalArg.inBasket;
	this.errorCode = {"position":optionalArg.errorCode.position,"network":optionalArg.errorCode.network,"server":optionalArg.errorCode.server};
	//this.errorCode = optionalArg.errorCode; /* 0 = no error, 1 = invalid position */
	this.serverMessage = optionalArg.serverMessage;
}

this.printMe = printMe;
this.countMe = countMe;
this.uploadMe = uploadMe;
this.storeMe = storeMe;
this.editMe = editMe;
this.submitResult = submitResult;
this.updateMe = updateMe;
this.setInfoMessage = setInfoMessage;
this.getName = getName;
this.getAmount = getAmount;
this.getMyPosition = getMyPosition;
this.getDate = getDate;
this.getTime = getTime;
this.validateMyPosition = validateMyPosition;
//this.me_butterflylist = "<li data-icon='false' data-shadow='false'><a href='#bfc_choosebutterfly'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><div class='bf_infowrapper'><span class='bf_info'>"+this.name+"</span><span id='bf_"+this.id+"' class='bf_currentamount'></span></div></a></li>";
return true;
}

//Butterfly.prototype.uploadSuccess = false;
Butterfly.prototype = new Butterflyapp;
//Butterfly.prototype.uploadSuccess = function() { this.fire("success"); };

function printMe(forwhat) {
	switch(forwhat) {
		case "butterflylist":
			var that = this;
			//var output = $(this.me_butterflylist);
			var output = $("<li data-icon='false' data-shadow='false'><a href='#bfc_choosebutterfly'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><div class='bf_infowrapper'><span class='bf_info'>"+this.name+"</span><span id='bf_"+this.id+"' class='bf_currentamount'></span></div></a></li>");
			$("#butterflylist").append(output.click(function() { that.countMe(); }));
		break;
		case "sightingbasket":
			var that = this;
			var count = " count";
			if(this.amount > 1) { count = " counts"; }
			var output = $("<li id='"+this.name+"' data-icon='false'><a href='#bfc_edit'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span><span class='ui-li-count'>"+this.amount+count+"</span></a></li>").click(function() { that.editMe("new"); });
			$("#sightingbasket").append(output);
		break;
		case "oldersightings":
			var that = this;
			var count = " count";
			if(this.amount > 1) { count = " counts"; }
			var output = $("<li id='"+this.name+"' data-icon='false'><a href='#bfc_edit'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span><span class='servermessage'>"+this.serverMessage+"</span><span class='ui-li-count'>"+this.amount+count+"</span></a></li>").click(function() { that.editMe("old"); });
			$("#oldersightings").append(output);
		break;
		case "submitlist":
			//alert("in printme, case submitlist");
			var count = " count";
			if(this.amount > 1) { count = " counts"; }
			var output = "<li id='"+this.name+"' data-icon='false'><a href='#'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span><span class='servermessage'>"+this.serverMessage+"</span><span class='ui-li-count'>"+this.amount+count+"</span></a></li>";
			$("#submitlist").append(output);
		break;
		default:
	}
}

function countMe() {
	try {
		this.amount++;
		$("#bf_"+this.id).text(this.amount);
		if(!this.myPosition.isSet) {
			this.myPosition.latitude = Butterflyapp.prototype.currentPosition.latitude;
			this.myPosition.longitude = Butterflyapp.prototype.currentPosition.longitude;
			this.myPosition.isSet = true;
		}
		if(!this.inBasket) {
			var d = new Date();
			var hours = "" + d.getHours();
			if(hours.length == 1) { hours = "0" + hours; }
			var minutes = "" + d.getMinutes();
			if(minutes.length == 1) { minutes = "0" + minutes; }
			var seconds = d.getSeconds();
			if(seconds.length == 1) { seconds = "0" + seconds; }
			this.time = hours + ":" + minutes + ":" + seconds;
			this.date = Butterflyapp.prototype.date;
			var oldlength = Butterflyapp.prototype.basket.length;
			this.positionInBasket = oldlength;
			var that = this;
			var newlength = Butterflyapp.prototype.addToBasket.call(this, that);
			if(oldlength < newlength) {
				this.inBasket = true;
			} else {
				throw "insert_err";
			}
		}
	} catch(e) {
		var errormsg = "";
		if(e == "insert_err") { errormsg += "An error occurred while trying to insert the new sighting into the basket."; }
		else { errormsg += e.message; }
		alert(errormsg);
	}
}

function submitResult(result, me, what) {
	var response = result.toLowerCase();
	if(response == "success") {
		me.serverMessage = "Upload was successfully.";
		// after upload was successful, remove item from basket/olderSightings and localStorage:
		if(what == "new") {
			/*
			if(me.positionInBasket < Butterflyapp.prototype.basket.length-1) {
				var i = me.positionInBasket;
				for(var j = i+1; j < Butterflyapp.prototype.basket.length; j++) {
					Butterflyapp.prototype.basket[j].positionInBasket = j-1;
				}
			}
			*/
			Butterflyapp.prototype.basket.splice(me.positionInBasket,1);
		} else {
			if(typeof(Storage) !== "undefined") {
				var sightings = JSON.parse(window.localStorage.getItem("sightings"));
			}
			if(me.positionInOlderSightings < Butterflyapp.prototype.olderSightings.length-1) {
				var i = this.editSighting[0].me.positionInOlderSightings;
				for(var j = i+1; j < Butterflyapp.prototype.olderSightings.length; j++) {
					Butterflyapp.prototype.olderSightings[j].positionInOlderSightings = j-1;
					sightings[j].positionInStorage = j-1;
				}
			}

			Butterflyapp.prototype.olderSightings.splice(me.positionInOlderSightings,1);
			if(typeof(Storage) !== "undefined") {
				sightings.splice(me.positionInStorage,1);
				window.localStorage.setItem("sightings",JSON.stringify(sightings));
			}
		}
	} else {
		//alert("in submitresult, response = "+result);
		me.errorCode.server = true;
		me.serverMessage = result;
		if(what == "new") {
			me.positionInOlderSightings = Butterflyapp.prototype.olderSightings.length;
			//alert("in submitResult, wert in me.positionInOlderSightings: "+me.positionInOlderSightings);
			me.storeMe();
			Butterflyapp.prototype.olderSightings.push(me);
			Butterflyapp.prototype.basket.splice(me.positionInBasket,1);
		} else {
			//alert("what = "+what+", nichts wird geloescht");
		}
		//$(me.me_submitlist).trigger("click");
	}
	me.printMe("submitlist");
	$("#submitlist").listview("refresh");
}

function updateMe() {
	alert("result triggered.");
}

function upload(data, callback, that, what) {
	$.ajax({
		url: 'http://192.168.1.29/bfsighting.php',
		type: 'POST',
		data: data,
		complete: function(jqXHR, textStatus) {
			callback.call(this, textStatus, that, what);
		}
	});
}

function uploadMe(what) {
	try {
		var position_valid = true;
		if(!this.validateMyPosition) {
			// try to determine the correct position now:
			Butterflyapp.prototype.getPosition();
			if(Butterflyapp.prototype.currentPosition.latitude != false && Butterflyapp.prototype.currentPosition.longitude != false) {
				this.myPosition.latitude = Butterflyapp.prototype.currentPosition.latitude;
				this.myPosition.longitude = Butterflyapp.prototype.currentPosition.longitude;
				this.errorCode.position = false;
			} else {
				position_valid = false;
			}
		}
		if(position_valid) {
			// check if a network connection is available:
			if(Butterflyapp.prototype.checkConnection()) {
				var that = this;
				var data = "name=" + this.getName() + "&" +
				"amount=" + this.getAmount() + "&" +
				"date=" + this.getDate() + "&" +
				"time=" + this.getTime() + "&" +
				"latitude=" + this.myPosition.latitude + "&" +
				"longitude=" + this.myPosition.longitude;
				// try to submit the bf object:
				upload(data, this.submitResult, that, what);	
			} else {
				this.errorCode.network = true;
				this.serverMessage = "No network connection";
				if(what == "new") {
					this.positionInOlderSightings = Butterflyapp.prototype.olderSightings.length;
					this.storeMe();
					Butterflyapp.prototype.olderSightings.push(this);
					Butterflyapp.prototype.basket.splice(this.positionInBasket,1);
				}
			}
		} else {
			this.errorCode.position = true;
			this.serverMessage = "Invalid position";
			if(what == "new") {
				this.positionInOlderSightings = Butterflyapp.prototype.olderSightings.length;
				this.storeMe();
				Butterflyapp.prototype.olderSightings.push(this);
				Butterflyapp.prototype.basket.splice(this.positionInBasket,1);
			}
		}
	} catch(e) {
		var errormsg = "Upload failed.\n" + e.message;
		alert(errormsg);
	}
}

function storeMe() {
	try {
		if(typeof(Storage) !== "undefined") {
			var storage = window.localStorage.key(0);
			alert("storage: "+storage);
			if(storage === "null" || storage === "undefined") {
				alert("in storeMe, creating new sightings array");
				var sightings = new Array();
			} else {
				alert("in storeMe, sightings array already exists");
				var sightings = JSON.parse(window.localStorage.getItem("sightings"));
			}
			// store the bf items that couldn't be submitted:
			var position = sightings.length;
			this.positionInStorage = position;
			this.positionInBasket = null;
			sightings.push(this);
			window.localStorage.setItem("sightings",JSON.stringify(sightings));
		} else {
			throw "storage_err";
		}
	} catch(e) {
		var errormsg = "Storing failed.\n";
		if(e == "storage_err") {
			errormsg += "Local storage is not supported on the device.";
		} else {
			errormsg += e.message;
		}
		alert(errormsg);
	}
}

function editMe(what) {
	var that = {me: this, status: what};
	Butterflyapp.prototype.editSighting.push(that);
}

function setInfoMessage(message) {
	this.infomessage = message;
}

function getName() { return this.name; }
function getAmount() { return this.amount; }
function getMyPosition() {
	var mypos = this.myPosition.latitude+","+this.myPosition.longitude;
	return mypos;
}

function getDate() { return this.date; }
function getTime() { return this.time; }

function validateMyPosition() {
	if(this.myPosition.latitude != false && this.myPosition.longitude != false) {
		return true;
	} else {
		return false;	
	}
}
