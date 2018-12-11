var root_url = "http://comp426.cs.unc.edu:3001/";

$(document).ready(() => {

    $(document).on('click', '#login-btn', function () {
        $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: {withCredentials: true},
            dataType: 'json',
            data: {
            "user": {
                "username": 'lironb',
                "password": 'sogood'
            }
            },
            success: (response) => {
                console.log("it worked");
                //Need to define empty but i'm not sure where...
                empty();
                
                //DON'T WE NEED THIS? 
                // if (response.status) {
                //     build_question_interface();
                // } else {
                //     alert("Login failed. Try again.");
                // }
            },
            error: () => {
            alert('Login failed!');
            }
        });
    
    });

       

    //Create Home Page Elements

    let container = $('#tripContainer');

    let tile = "<div class='leg-section'><div class='insideBox'><p>Origin: <input type='text' class='origin'></p><p>Destination: <input type='text' class='dest'></p><p>Date:</p><button type='button' class='search'>Search Flights</button></div></div>"

    let tile2 = "<div class ='leg-section'><div class='insideBox'><div id='floating-panel'><input id='address' type='textbox' value='Sydney, NSW'><input id='submit' type='button' value='Geocode'></div><div id='map'><script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyCwPFArHQ86xloIhaWtkUHNIOQZ2HCcl5s&callback=initMap'></script></div></div>"



    $(document).on('click', '.start', function () {
        container.append(tile);
    });
    $(document).on('click', '.start', function () {
        container.append(tile2);
    });

    $(document).on('click', '.search', function () {
        currentLeg = $(this).parents('.leg-section');
        currentDiv = $(this).parent();
        let origin = '';
        let dest = '';
        let flights;
        $.ajax(root_url + 'airports?filter[code]=' + $('.origin').val(), {
            type: 'GET',
            async: false,
            xhrFields: {withCredentials: true},
            dataType: 'json',
            success: (response) => {
                origin = response[0].id;
            },
            error: () => {
            console.log('Failed to find matching Airport');
            }
        });

        $.ajax(root_url + 'airports?filter[code]=' + $('.dest').val(), {
            type: 'GET',
            async: false,
            xhrFields: {withCredentials: true},
            dataType: 'json',
            success: (response) => {
                dest = response[0].id;
            },
            error: () => {
            console.log('Failed to find matching Airport');
            }
        });

        $.ajax(root_url + 'flights?filter[departure_id]=' + origin + '&filter[arrival_id]=' + dest, {
            type: 'GET',
            xhrFields: {withCredentials: true},
            async: false,
            dataType: 'json',
            success: (response) => {
                flights = response;
            },
            error: () => {
            console.log('Failed to find matching Airport');
            }
        });
        
        console.log(flights[0].id);
        currentLeg.append(flights[0].id);

        // console.log(origin);
        // console.log(dest);
    




        

        
    });
});

let getAirportID = function(code){
    $.ajax(root_url + 'airports?filter[code]=' + code, {
        type: 'GET',
        async: false,
        xhrFields: {withCredentials: true},
        dataType: 'json',
        success: (response) => {
            console.log(response);
            return response[0].id;
        },
        error: () => {
        console.log('Failed to find matching Airport');
        }
    });
}

let getFlightList = function(origin, dest){
    

    
    $.ajax(root_url + 'flights?filter[departure_id]=' + origin + '&filter[arrival_id]=' + dest, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        dataType: 'json',
        success: (response) => {
            console.log(response);
        },
        error: () => {
        console.log('Failed to find matching Airport');
        }
    });

}

//Google API or Google Map Coordinates 
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: -34.397, lng: 150.644}
    });
    var geocoder = new google.maps.Geocoder();
  
    document.getElementById('submit').addEventListener('click', function() {
      geocodeAddress(geocoder, map);
    });
  }
  
  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

