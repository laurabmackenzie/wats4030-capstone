var trips = [];
var destination = "";

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
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
    displayList(trips);
    let form = document.getElementById("trip-entry");
    form.addEventListener("submit", addTrip);
    let clear = document.getElementById('clearButton');
    clear.addEventListener("click", clearAll);
});

function addTrip(event) {
    event.preventDefault();
    var trip = {};
    destination = document.getElementById('destinationName').value;
    if (destination.length > 0) {
        getMap(destination);
    }
};

function clearAll(event) {
    event.preventDefault();
    localStorage.clear();
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
    displayList(trips);
    initMap();
}

function deleteDestination(event) {
    event.preventDefault();
    var index=this.parentNode.dataset.index;
    // var marker=trips[index].marker;
    // marker.setMap(null);
    trips.splice(index,1);
    displayList(trips);
    initMap(); 
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
            console.log(lat);
            console.log(lng);
            var marker = new google.maps.Marker({
                position: response.data.results[0].geometry.location,
                map: map,
                title: response.data.results[0].formatted_address
            });
            var trip={};
            trip.lat = lat;
            trip.lng = lng;
            trip.title = destination;
            trips.push(trip);
            localStorage.setItem("trips", JSON.stringify(trips));
            document.getElementById('destinationName').value = "";
            displayList(trips);
            map.panTo(new google.maps.LatLng(lat, lng));
            map.setZoom(5);
        })
        .catch(function (error) {
            console.log(error);
        });
}
//create a world map using Google Maps api
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.356, lng: -39.059 },
        zoom: 1
    });
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
}