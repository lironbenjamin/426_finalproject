var root_url = "http://comp426.cs.unc.edu:3001/";

$(document).ready(() => {
    let main = $('.main');

    //////Functions to rebuild inteface components /////
    
    let build_login = function(){
        main.empty();
        $('.navbar').remove();
        login_page = "<div class='loginbox' id='page-login'><h1>Login</h1>        <p>Username</p><input id='login_user' placeholder='Enter Username' type='text'><p>Password</p><input id='login_pass' placeholder='Enter Password' type='password'><button id='login-btn'>Login</button></div>";
        main.append(login_page);
    }

    let build_navbar = function(user){
        nav = $('<nav class="navbar"><a class="navbar-item pNav">Plan</a><a class="navbar-item rNav">Reset Password</a><a class="navbar-item logNav">Logout</a></nav>');
        nav.insertBefore('.main');
    }

    let build_trip_planner = function(){
        main.empty();
        main.append('<button class="start">Begin Planning Your Trip</buton>')
        
    }

    let build_change_password = function(){
        main.empty();
       let pword_box = "<div class='loginbox' id='page-login'><h1>Change Password</h1><p>Username</p><input id='user' placeholder='Enter Username' type='text'><p>Old Password</p><input id='old_pass' placeholder='Enter Old Password' type='password'><p>New Password</p><input id='new_pass' placeholder='Enter New Password' type='password'><button id='reset-btn'>Reset Password</button></div>";
       main.append(pword_box);

    }
///////////////////////////////////////////////////////


    build_login();
    $(document).on('click', '#login-btn', function () {
        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: {withCredentials: true},
            dataType: 'json',
            data: {
            "user": {
                "username": user,
                "password": pass
            }
            },
            success: (response) => {
                console.log("it worked");
                main.empty();
                build_navbar();
                build_trip_planner();
                
            },
            error: () => {
            alert('Login failed!');
            }
        });
    
    });



///////////Navigation button clicks /////////////////////
////////////// Button click to build trip planner////////
    $(document).on('click', '.pNav', function () {
        build_trip_planner();
    });

////////////// Button click for reset password //////////
    $(document).on('click', '.rNav', function () {
        build_change_password();
    });

////////////// Button click for logging out ////////////
    $(document).on('click', '.logNav', function () {
        build_login();
    });

///////////// Button click for changing password ////////
    $(document).on('click', '#reset-btn', function () {
        let user = $('#user').val();
        let old_pass = $('#old_pass').val();
        let new_pass = $('#new_pass').val();
        console.log(new_pass);
        $.ajax(root_url + 'passwords', {
            type: 'PUT',
            xhrFields: {withCredentials: true},
            dataType: 'json',
            data: {
            "user": {
                "username": user,
                "old_password": old_pass,
                "new_password": new_pass
            }
            },
            success: (response) => {
                console.log("reset worked");
                main.empty();
                main.append('Password Reset Succesful');
                
            },
            error: () => {
            alert('Inncorect credientials');
            }
        });
    });
    
 ///////////////////////////////////////////////////////
 ////////////// Tirp Planner Functionality /////////////
    $(document).on('click', '.start', function () {
        main.append(tile);
    });

    $(document).on('click', '.search', function () {
        currentLeg = $(this).parents('.leg-section');
        currentDiv = $(this).parent();
        let origin = '';
        let dest = '';
        let flights;
        let instances;
        $.ajax(root_url + 'airports?filter[code]=' + currentLeg.find('.origin').val(), {
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

        $.ajax(root_url + 'airports?filter[code]=' + currentLeg.find('.dest').val(), {
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
        
        let route_id = flights[0].id;

        $.ajax(root_url + 'instances?filter[flight_id]=' + route_id, {
            type: 'GET',
            xhrFields: {withCredentials: true},
            async: false,
            dataType: 'json',
            success: (response) => {
                instances = response;
            },
            error: () => {
            console.log('Failed to find matching Airport');
            }
        });

        console.log(instances);
        for(i = 0; i < instances.length; i++){
            currentInstance = instances[i];

        }
    });




 /////////////////////////////////////////////////////

    //Create Home Page Elements
    let flightsPane = "<div class='flights-pane'></div>"

    let tile = "<div class='leg-section'><div class='insideBox'><p>Origin: <input type='text' class='origin'></p><p>Destination: <input type='text' class='dest'></p><p>Date:</p><button type='button' class='search'>Search Flights</button></div></div>"

    let tile2 = "<div class ='leg-section'><div class='insideBox'><div id='floating-panel'><input id='address' type='textbox' value='Sydney, NSW'><input id='submit' type='button' value='Geocode'></div><div id='map'><script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyCwPFArHQ86xloIhaWtkUHNIOQZ2HCcl5s&callback=initMap'></script></div></div>"
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

