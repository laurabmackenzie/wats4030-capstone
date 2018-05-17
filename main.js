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

$( document ).ready(function() {
    trips = JSON.parse(localStorage.getItem("trips") || "[]");
    displayList(trips);
});



$('#addTrip').click(function(event) {
    event.preventDefault();
    destination = $('#destinationName').val();
    trips.push(destination);
    displayList(trips);
    localStorage.setItem("trips", JSON.stringify(trips));
    $('#map').append(getMap(destination));
    $('#destinationName').val('');
});

function getMap(destination) {
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key:"AIzaSyDkfMKh99m-RruIiyhX4WoU98vnpwNOBxs",
          address:destination
        }
      })
      .then(function (response) {
          //add the marker to the map already created
        console.log(response);
        })
      .catch(function (error) {
        console.log(error);
      });
}