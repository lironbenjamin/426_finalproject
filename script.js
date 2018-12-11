var root_url = "http://comp426.cs.unc.edu:3001/";

$(document).ready(() => {

    let airlines = [];
    let airports = ['RDU', 'RAJ', 'LIR', 'DAL'];

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
            },
            error: () => {
            alert('Login failed!');
            }
        });
    

    //Create Home Page Elements

    let container = $('#tripContainer');

    let tile = "<div class='leg-section'><div class='insideBox'><p>Origin: <input type='text' class='origin'></p><p>Destination: <input type='text' class='dest'></p><p>Date:</p><button type='button' class='search'>Search Flights</button></div><div class='flight-table'></div></div>"


    $(document).on('click', '.start', function () {
        container.append(tile);
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
