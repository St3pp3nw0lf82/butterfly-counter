function Butterfly(name,index) {
this.id = index;
this.name = name;
this.amount = 0;
this.date = false;
this.time = false;
this.myPosition = {"latitude":false,"longitude":false,"isSet":false};
this.inBasket = false;
this.printMe = printMe;
this.countMe = countMe;
this.getName = getName;
this.getAmount = getAmount;
this.getMyPosition = getMyPosition;
this.getDate = getDate;
this.getTime = getTime;
this.validateMyPosition = validateMyPosition;
this.me_butterflylist = "<li data-icon='false' data-shadow='false'><a href='#bfc_choosebutterfly'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><div class='bf_infowrapper'><span class='bf_info'>"+this.name+"</span><span id='"+this.id+"' class='bf_currentamount'></span></div></a></li>";
return true;
}

Butterfly.prototype = new Butterflyapp;

function printMe(forwhat) {
	switch(forwhat) {
		case "butterflylist":
			var that = this;
			var output = $(this.me_butterflylist);
			$("#butterflylist").append(output.click(function(e) { that.countMe(); e.preventDefault();}));
		break;
		case "sightingbasket":
			var count = " count";
			if(this.amount > 1) { count = " counts"; }
			var output = "<li id='"+this.name+"' data-icon='false'><a href='#'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span><span class='ui-li-count'>"+this.amount+count+"</span></a></li>";
			$("#sightingbasket").append(output);
		break;
		case "submitlist":
			var output = "<li id='"+this.name+"' data-icon='false'><a href='#'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span><span id='"+this.id+"'></span><span class='ui-li-count'>"+this.amount+count+"</span></a></li>";
			$("#submit_list").append(output);
		break;
		default:
	}
}

function countMe() {
	try {
		this.amount++;
		$("#"+this.id).text(this.amount);
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
