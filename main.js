var trips = [];
var destination="";

function displayList(trips) {
    var list=document.getElementById('listofplaces');
    list.parentNode.removeChild(list);
    var destinationList=document.createElement('ul');
    destinationList.setAttribute('id', 'listofplaces');
        for (i=0; i<trips.length; i++) {
            var list=document.createElement('li');
            var listDestination=document.createTextNode(trips[i]);
            list.appendChild(listDestination);
            destinationList.appendChild(list);
        }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
    displayList(trips);
    let form = document.getElementById("trip-entry");
    form.addEventListener("submit", addTrip);
});

function addTrip(event) {
    event.preventDefault();
    destination = document.getElementById('destinationName').value;
    trips.push(destination);
    displayList(trips);
    localStorage.setItem("trips", JSON.stringify(trips));
    var map=document.getElementById('map');
    map.appendChild(getMap(destination));
    document.getElementById('destinationName').value="";
};

//Google geocode api call to add centered marker to map
function getMap(destination) {
    console.log("getmap");
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key:"AIzaSyDkfMKh99m-RruIiyhX4WoU98vnpwNOBxs",
          address:destination
        }
      })
      .then(function (response) {
          console.log(response);
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
        map.panTo(new google.maps.LatLng(lat,lng));
        })
        map.setZoom(5)
      .catch(function (error) {
        console.log(error);
      });
}
    //create a world map using Google Maps api
    var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.356, lng: -39.059},
          zoom: 1
        });
      }