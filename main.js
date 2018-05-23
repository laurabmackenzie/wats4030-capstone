var trips = [];
var destination="";

function displayList(trips) {
    $(".destinationList").remove();
    $(".list").append("<ul class='destinationList'></ul>");
    for (i=0; i<trips.length; i++) {
        var listDestination=$('<li></li>').text(trips[i]);
        $('.destinationList').append(listDestination);
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
    displayList(trips);
});

function addTrip() {
    console.log('hello');
    destination = document.getElementById('destinationName').value;
    console.log(destination);
    trips.push(destination);
    displayList(trips);
    localStorage.setItem("trips", JSON.stringify(trips));
    $('#map').append(getMap(destination));
    document.getElementById('destinationName').value="";
};

//Google geocode api call to add centered marker to map
function getMap(destination) {
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key:"AIzaSyDkfMKh99m-RruIiyhX4WoU98vnpwNOBxs",
          address:destination
        }
      })
      .then(function (response) {
          //add the marker to the map already created
        var lat=response.data.results[0].geometry.location.lat;
        var lng=response.data.results[0].geometry.location.lng;
        console.log(lat);
        console.log(lng);
        var marker = new google.maps.Marker({
            position: response.data.results[0].geometry.location,
            map: map,
            title: response.data.results[0].formatted_address
          });
          //center the map to the current location
        map.setCenter(new google.maps.LatLng(lat,lng));
        })
      .catch(function (error) {
        console.log(error);
      });
}
    //create a map of the current location using Google Maps api
    var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      }