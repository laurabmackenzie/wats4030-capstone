var trips = [];
var destination = "";
var description = "";
var markers = [];
var map;

//retrieves trips from local storage.
function loadTrips() {
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
}

//retrieves markers from local storage.
function loadMarkers() {
    markers = JSON.parse(localStorage.getItem("markers") || "[]");
}

//creates a map marker
function getMarker(i) {
    if (trips[i].lat = markers[i].lat) {
        if (trips[i].lng = markers[i].lng) {
            createMarker(markers[i].lat, markers[i].lng, trips[i].title);
        }
    }
}

//saves trips to local storage.
function saveTrips() {
    localStorage.setItem("trips", JSON.stringify(trips));
}

//saves markers to local storage.
function saveMarkers() {
    localStorage.setItem('markers', JSON.stringify(markers));
}


//enables user to see all saved markers on map.
function fitMap() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend({ lat: markers[i].lat, lng: markers[i].lng });
    }
    if (markers.length > 1) {
        map.fitBounds(bounds);
    }
}


//displays destination list.
function displayList(trips) {
    var list = document.getElementById('listofplaces');

    if (list) {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    for (i = 0; i < trips.length; i++) {
        var listItem = document.createElement('a');
        var itemStyle = document.createElement('strong');
        var deleteIcon = document.createElement('a');
        var listDestination = document.createTextNode(trips[i].title);
        //creating delete icon
        var trashCan = document.createElement('i');
        trashCan.setAttribute('class', 'far fa-trash-alt');
        deleteIcon.setAttribute('href', '#');
        deleteIcon.appendChild(trashCan);
        listItem.setAttribute('href', '#');
        listItem.setAttribute('class', 'list-group-item list-group-item-action');
        listItem.setAttribute('data-index', i);
        itemStyle.appendChild(listDestination)
        listItem.appendChild(itemStyle);
        listItem.appendChild(deleteIcon);
        //adding description
        var p = document.createElement('p');
        p.setAttribute("class", "special")
        var description = document.createTextNode(trips[i].description);
        if (description.length > 0) {
            p.appendChild(description);
            listItem.appendChild(p);
        }
        list.appendChild(listItem);
        //event listeners
        deleteIcon.addEventListener("click", deleteDestination);
        listItem.addEventListener("click", updateInfo)
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
    //hide deleteall button if there's no saved list.
    if (trips.length==0) {
        clear.style.visibility="hidden";
    }
    let view = document.getElementById('viewallButton');
    view.addEventListener("click", viewAll);
   });



function addTrip(event) {
    event.preventDefault();
    destination = document.getElementById('destinationName').value;
    description = document.getElementById('destinationDescription').value;
    if (destination.length > 0) {
        getMap(destination);
    }
    saveTrips();
    saveMarkers();
    //makes clear all button visible when a trip is added.
    let clear = document.getElementById('clearButton');
    clear.style.visibility="visible";
}

//scrolls to the bottom of the list so users can see most recently added destination.
function scrollList() {
    var scrollItem=document.getElementById('listofplaces');
    scrollItem.scrollTop=scrollItem.scrollHeight;
}


//deletes entire list
function clearAll(event) {
    event.preventDefault();
    localStorage.clear();
    loadTrips();
    loadMarkers();
    displayList(trips);
    initMap();
    //hides delete all button
    let clear = document.getElementById('clearButton');
    clear.style.visibility="hidden";
}

//way for users to see all desination on map wihtout clicking refresh
function viewAll(event) {
    initMap();
    var map=getElementById('map');
    map.scrollIntoView();
}


//delete and individual destination.
function deleteDestination(event) {
    event.preventDefault();
    var index = this.parentNode.dataset.index;
    trips.splice(index, 1);
    markers.splice(index, 1);
    displayList(trips);
    saveTrips();
    saveMarkers();
    initMap();
    //hides delete all button when the last destination is deleted.
    if (trips.length==0) {
        let clear = document.getElementById('clearButton');
        clear.style.visibility="hidden";
    }
}

//pans and zooms in on clicked location
function updateInfo(event) {
    event.preventDefault();
    removeActive();
    var index = this.dataset.index;
    console.log(index);
    console.log(trips[index]);
    if (trips[index]!=undefined) {
    map.panTo(new google.maps.LatLng(trips[index].lat, trips[index].lng));
    map.setZoom(5);
    this.className += " active";
    }
}


//removes active state 
function removeActive() {
    var item = document.querySelector(".active");
    if (item) {
        item.classList.remove("active");
    }
}

//creates a map marker
function createMarker(lat, lng, address) {
    var myLatLng = { lat: lat, lng: lng };
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
            var marker = {};
            marker.lat = lat;
            marker.lng = lng;
            markers.push(marker);
            saveMarkers();
            console.log(lat);
            console.log(lng);
            var trip = {};
            trip.lat = lat;
            trip.lng = lng;
            trip.title = address;
            trip.description = description;
            trips.push(trip);
            saveTrips();
            document.getElementById('destinationName').value = "";
            document.getElementById('destinationDescription').value = "";
            displayList(trips);
            scrollList();
            map.panTo(new google.maps.LatLng(lat, lng));
            map.setZoom(5);
            createMarker(lat, lng, address);
        })
        .catch(function (error) {
            console.log(error);
            alert('There is no destination with this name. Please try again.')
        });
}


//create a world map using Google Maps api
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.356, lng: -39.059 },
        zoom: 1
    });
    for (i = 0; i < markers.length; i++) {
        getMarker(i);
        fitMap();
    }
}