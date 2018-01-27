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
      });
      var bikeLayer = new google.maps.BicyclingLayer();
        bikeLayer.setMap(map);
      
      infoWindow = new google.maps.InfoWindow({
        map: map,
      });
      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here.');
      map.setCenter(pos);
      var myLocation = pos; //Sets variable to geo location long and lat co-ordinates.

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: myLocation, //Uses geolocation to find the following
        radius: 100000,
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
      url: 'http://image.ibb.co/gR2wCR/beer_mug.png',
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
  var photoUrl = details.photos[0].getUrl({maxWidth: 200});
      $("#pub_info").empty().append([
      '<div class="place-img"><img src="' + photoUrl + '"</div>',
      '<div><a href="' + details.url + '">' + details.name + '</a></br>',
      '<button type="submit" id="button">Add to Pub List</button></br>',
      details.vicinity,
      details.opening_hours.open_now = "Open Now",
      details.rating,
      details.formatted_phone_number + '</div>'].join("<br />"));
      $('#button').click(function(e) {
               e.preventDefault();
                $('#pub_list ul').append('<li><span class="pub-name">' + details.name + '</span><div class="pub-controls"><button class="pub-toggle"><span class="visited">visited</span></button> <button class="pub-delete"><span class="delete">remove</span></button></div></li>');
            });

            infoWindow.open(map, marker);
        });


        $('.my-pub-list').on('click', '.pub-delete', function(event) {
            $(this).closest('li').remove();
        });
        $('.my-pub-list').on('click', '.pub-toggle', function(event) {
            $(this).closest('li').find('.pub-name').toggleClass('my-pub-list__visited');
        });
    });
}



initMap();

// 


