$('#addtrip').click(function(event) {
    //take the contents of the input box and create an li within the 
    //destinationlist ul with that destination.
    event.preventDefault();
    var destination = $('#destinationname').val();
    console.log(destination);
    var listdestination=$('<li></li>').text(destination);
    $('.destinationlist').append(listdestination);
    $('#destinationname').val('');
})