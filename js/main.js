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
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: [ // Below are styles of each map layer
          { "elementType": "geometry",
            "stylers": [{ "color": "#ebe3cd"}]},
          
          { "elementType": "labels.text.fill",
            "stylers": [{ "color": "#523735" }]},
          
          { "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#f5f1e6" }]},
          
          { "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#c9b2a6" }]},
          
          { "featureType": "administrative.land_parcel",
            "stylers": [{ "visibility": "off" }]},
          
          { "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#dcd2be"}]},
          
          { "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ae9e90" }]},
  
          { "featureType": "administrative.neighborhood",
            "stylers": [{ "visibility": "off" }]},
  
          { "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{ "color": "#dfd2ae" }]},
  
          { "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#dfd2ae" }]},
  
          { "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "off" }]},
  
          { "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#93817c" }]},
  
          { "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#a5b076" }]},
  
          { "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#447530" }]},
  
          { "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f1e6" }]},
  
          { "featureType": "road",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]},
 
          { "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{ "color": "#fdfcf8" }]},
  
          { "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#f8c967" }]},
  
          { "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#e9bc62" }]},
  
          { "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [{ "color": "#e98d58" }]},
  
          { "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#db8555" }]},
  
          { "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#806b63" }]},
  
          { "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{ "color": "#dfd2ae" }]},
  
          { "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#8f7d77" }]},
  
          { "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#ebe3cd" }]},
  
          { "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{ "color": "#dfd2ae" }]},
  
          { "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#3696b1" }]},
  
          { "featureType": "water",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "off" }]},
  
          { "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#92998d" }]
  }]
      });
      
      infoWindow = new google.maps.InfoWindow({
        map: map,
      });
      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here.'); // Change text for user's location marker
      map.setCenter(pos);
      
        var myLocation = pos; //Sets variable to geo location long and lat co-ordinates.
        var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
          location: myLocation, //Uses geolocation to find the following
          radius: 100000, // Radius set to 100,000 feet from user's location
          keyword: ['bar', 'brewery', 'beer', 'liquor'],
          types: ['bar', 'restaurant']
          }, callback);
    });
  }
  getPubs();
}

function callback(results, status) { // For each location, run createMarker and set marker
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach(createMarker);
 }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: {
      url: 'http://image.ibb.co/gR2wCR/beer_mug.png', // Beer mug icon
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(30, 36)
    },
    position: place.geometry.location
  });
    marker.addListener('click', function() {

      var request = {
        reference: place.reference
      };
      var service = new google.maps.places.PlacesService(map);
  
      service.getDetails(request, function(details, status) {
        var photoUrl = details.photos[0].getUrl({maxWidth: 640});
          infoWindow.setContent(details.name);
          $("#pub_info").empty().append([
          '<div class="pub-photo">' +
          '<img src="' + photoUrl + '"class="center-cropped"></div>' +
          '<div class="pub-name">' +
          '<a href="' + details.url + '" class="pub-link">' + details.name + '</a>' +
          '<span class="right white">' + details.rating + '</span></div>' + 
          '<div class="pub-details">' + details.vicinity,
//        ADDITIONAL OBJECTS RETURNED BY GOOGLE PLACES LIBRARY
//        details.opening_hours.open_now = "Open Now",
//        details.rating,
//        details.place_id,
//        details.geometry.location,
          details.formatted_phone_number + 
          '<div>' +
          '<button type="submit" role="link" id="button" class="main-btn">Add to Pub List</button></br>' +
          '<button type="submit" role="link" id="directions" class="main-btn">Directions</button></br>' +
          '</div>'].join("<br />"));
      
          $('#button').click(function(e) {
            e.preventDefault();
          $('#pub_list ul').append('<li>' +
          '<span class="pub-name-list" id="' + details.geometry.location + '">' + details.name + '</span>' +
          '<div class="pub-controls">' +
          '<img src="http://image.ibb.co/b45EB6/Red_X_in_circle_small.png" class="pub-delete" alt="Click X to Remove Pub from List" border="0"></div></li>');
          
          delBtn();
          });
            
          $('#directions').click(function(e) {
            e.preventDefault();
          window.open('https://www.google.com/maps/dir/Current+Location/' + details.geometry.location);
          });

          infoWindow.open(map, marker);
        });

        $('.my-pub-list').on('click', '.pub-delete', function(event) {
            $(this).closest('li').remove();
            delBtn();
        });
    });
}

function delBtn() { // DELETES THE "MAP MY PUBS" BUTTON WHEN THERE ARE NO PUBS IN THE LIST
  var mypub = $('#map_pub');

  if ($('#pub_list ul li').length > 0) { 
    mypub.empty().append('<button type="submit" role="link" id="map_my_pubs" class="main-btn">Map My Pubs</button>');
  } else {
    mypub.empty();
  }
}

function getPubs() { // GETS THE LIST OF PUBS AND LOADS DESTINATIONS INTO A GOOGLE MAP FOR DIRECTIONS
  var dirURL = "https://www.google.com/maps/dir/Current+Location";
      
  $('#map_pub').click(function(e) {
    e.preventDefault();
  $("#pub_list span").each(function(index) {
    dirURL += "/" + $(this).attr('id');
  });
    window.open(dirURL);
  });
}

initMap();


