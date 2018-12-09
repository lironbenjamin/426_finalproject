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

    let tile = "<div class='leg-section'><div class='insideBox'><p>Origin: <input type='text' class='origin'></p><p>Destination: <input type='text' class='dest'></p><p>Date:</p><button type='button' class='search'>Search Flights</button></div></div>"


    $(document).on('click', '.start', function () {
        container.append(tile);
    });

    $(document).on('click', '.search', function () {
        currentLeg = $(this).parents('.leg-section');
        currentDiv = $(this).parent();

        let promise1 = new Promise((resolve, reject) =>{
            origin = $('.origin').val();
            dest = $('.dest').val();

            if (origin !== null){
                resolve(origin, dest)
            }

            if (oID === null){
                reject("rip")
            }

        })
        promise1.then( (o, d) => {
            console.log(getAirportID('BOS')); 
            }).catch( (message) => {
               console.log(message);
         })

        

        
    });
});

let getAirportID = function(code){
    $.ajax(root_url + 'airports?filter[code]=' + code, {
        type: 'GET',
        xhrFields: {withCredentials: true},
        dataType: 'json',
        success: (response) => {
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
