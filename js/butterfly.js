function Butterfly(name) {
this.name = name;
this.amount = 0;
this.myPosition = {latitude:"",longitude:"",isSet:false};
this.inBasket = false;
this.printMe = printMe;
this.countMe = countMe;
this.getName = getName;
this.getAmount = getAmount;
this.getMyPosition = getMyPosition;
this.me_butterflylist = "<li id='"+this.name+"' data-icon='false'><a href='#'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span></a></li>";
return true;
}

Butterfly.prototype = new Butterflyapp;

function printMe(forwhat) {
	if(forwhat == "butterflylist") {
		var that = this;
		var output = $(this.me_butterflylist);
		$("#butterflylist").append(output.click(function() { that.countMe(); }));
	} else if(forwhat == "basket") {
		var count = " count";
		if(this.amount > 1) { count = " counts"; }
		var output = "<li id='"+this.name+"' data-icon='false'><a href='#'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span><span class='ui-li-count'>"+this.amount+count+"</span></a></li>";
		$("#sightingbasket").append(output);
	}
}

function countMe() {
	try {
		this.amount++;
		if(!this.myPosition.isSet) {
			this.myPosition.latitude = Butterflyapp.prototype.currentPosition.latitude;
			this.myPosition.longitude = Butterflyapp.prototype.currentPosition.longitude;
			this.myPosition.isSet = true;
		}
		if(!this.inBasket) {
			var that = this;
			var oldlength = Butterflyapp.prototype.basket.length;
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

function getName() { return this.name; }
function getAmount() { return this.amount; }
function getMyPosition() { return {this.myPosition.latitude,this.myPosition.longitude}; }
