var trips = [];
var destination = "";
var markers = [];
var map;

function loadTrips() {
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
}

function loadMarkers() {
    markers = JSON.parse(localStorage.getItem("markers")|| "[]");
}

function getMarker(i) {
        if (trips[i].lat=markers[i].lat) {
            if (trips[i].lng=markers[i].lng) {
                createMarker(markers[i].lat, markers[i].lng, trips[i].title);
            }
        }
    }

function saveTrips() {
    localStorage.setItem("trips", JSON.stringify(trips));
}

function saveMarkers() {
    localStorage.setItem('markers', JSON.stringify(markers));
}

function fitMap() {
    var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
        bounds.extend({lat:markers[i].lat, lng: markers[i].lng});
}
    map.fitBounds(bounds);
}

function displayList(trips) {
    var list = document.getElementById('listofplaces');

    if (list) {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    for (i = 0; i < trips.length; i++) {
        var listItem = document.createElement('li');
        var deleteButton = document.createElement('button');
        var listDestination = document.createTextNode(trips[i].title);
        var buttonText = document.createTextNode('remove');
        listItem.setAttribute('data-index', i);
        listItem.appendChild(listDestination);
        deleteButton.appendChild(buttonText);
        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
        deleteButton.addEventListener("click", deleteDestination);
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    loadTrips();
    loadMarkers();    
    displayList(trips);
    let form = document.getElementById("trip-entry");
    form.addEventListener("submit", addTrip);
    let clear = document.getElementById('clearButton');
    clear.addEventListener("click", clearAll);
});

function addTrip(event) {
    event.preventDefault();
    //var trip = {};
    destination = document.getElementById('destinationName').value;
    if (destination.length > 0) {
        getMap(destination);
    }
    saveTrips();
    saveMarkers();
};

function clearAll(event) {
    event.preventDefault();
    localStorage.clear();
    loadTrips();
    loadMarkers();
    displayList(trips);
    initMap();
}

function deleteDestination(event) {
    event.preventDefault();
    var index=this.parentNode.dataset.index;
    trips.splice(index,1);
    markers.splice(index,1);
    displayList(trips);
    saveTrips();
    saveMarkers();
    initMap();
}

function createMarker(lat, lng, address) {
    var myLatLng = {lat:lat, lng:lng};
    var newmarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: address
    });
}

//Google geocode api call to add centered marker to map
function getMap(destination) {
    console.log("getmap");
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            key: "AIzaSyDkfMKh99m-RruIiyhX4WoU98vnpwNOBxs",
            address: destination
        }
    })
        .then(function (response) {
            console.log(response);
            //add the marker to the map already created
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            var address = response.data.results[0].formatted_address;
            var marker={};            
            marker.lat=lat;
            marker.lng=lng;
            markers.push(marker);
            saveMarkers();
            console.log(lat);
            console.log(lng);
            var trip={};
            trip.lat = lat;
            trip.lng = lng;
            trip.title = destination;
            trips.push(trip);
            saveTrips();
            document.getElementById('destinationName').value = "";
            displayList(trips);
            map.panTo(new google.maps.LatLng(lat, lng));
            map.setZoom(5);
            createMarker(lat, lng, address);
        })
        .catch(function (error) {
            console.log(error);
        });
}
//create a world map using Google Maps api
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.356, lng: -39.059 },
        zoom: 1
    });
    for (i=0; i<markers.length; i++) {
    getMarker(i);
    fitMap();
    }
}