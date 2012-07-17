function Butterfly(name) {
this.name = name;
this.amount = 0;
this.inBasket = false;
this.printMe = printMe;
this.countMe = countMe;
this.getName = getName;
this.getAmount = getAmount;
this.me = "<li id='"+this.name+"'><a href='#'><img class='bf_image' src='images/"+this.bf_images[this.name]+"'/><span class='bf_info'>"+this.name+"</span></a></li>";
return true;
}

Butterfly.prototype = new Butterflyapp;

function printMe() {
	var that = this;
	var output = $(this.me);
	$("#butterflylist").append(output.click(function() { that.countMe(); }));
}

function countMe() {
	try {
		this.amount++;
		if(!this.inBasket) {
			var that = this;
			var oldlength = Butterflyapp.prototype.basket.length;
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

function getName() { return this.name; }
function getAmount() { return this.amount; }
