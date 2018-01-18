var map;
var infoWindow;
var pos;

function initMap() {

  if (navigator.geolocation) { //GEO LOCATION, FINDS USERS LOCATION
    navigator.geolocation.getCurrentPosition(function(position) {

      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 13
      });
      infoWindow = new google.maps.InfoWindow({
        map: map
      });
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
      var myLocation = pos; //Sets variable to geo location long and lat co-ordinates.

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: myLocation, //Uses geolocation to find the following
        radius: 10000,
        keyword: 'brewery',
        types: ['bar']
      }, callback);
    });
  }
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach(createMarker);
 }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: {
      url: 'http://maps.gstatic.com/mapfiles/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    },
      position: place.geometry.location
  });
    marker.addListener('click', function() {

  var request = {
    reference: place.reference
  };
  var service = new google.maps.places.PlacesService(map);
    service.getDetails(request, function(details, status) {
      infoWindow.setContent([
      details.name,
      details.formatted_address,
      details.website,
      details.rating,
      details.formatted_phone_number].join("<br />"));
      
      infoWindow.open(map, marker);
    });
  })
}

initMap();

