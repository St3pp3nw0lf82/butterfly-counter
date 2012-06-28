function showposition() {

	// get users current position:
	var success = function(position) {
		$('#map').html('<p>Latitude: '+ position.coords.latitude +'</p><p>Longitude: '+ position.coords.longitude +'</p>');
		/*
		$('#map').gmap().bind('init', function(position, status) {
			if(status == 'OK') {
				var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				$('#map').gmap('addMarker', {'position': clientPosition, 'bounds': true});
				// TODO: change button text depending on if map is shown or not:
			}
		});
		*/
	};
	
	var error = function(error) {
		$('#map').html('<p>Error code: '+ error.code +', error message: '+ error.message +'</p>');
	};
	
	navigator.geolocation.getCurrentPosition(success, error);
}
