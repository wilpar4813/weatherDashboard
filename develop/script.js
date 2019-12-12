
$(document).ready(function () {
    writeToSchedule();
    //localStorage.clear();
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    $('#submitWeather').click(function (event) {
        // event.preventDefault() prevents the form from trying to submit itself.
        // We're using a form so that the user can hit enter instead of clicking the button if they want
        event.preventDefault();
        // This line will grab the text from the input box
        var newCity = $("#locale").val().trim();


        //Create array to store high scores
        cities = JSON.parse(localStorage.getItem("cities")) || [];
        
        console.log(cities);

        //add new city to cities
        if(newCity != ""){
        cities.unshift(newCity);
        cities = Array.from(new Set(cities));
        if(cities.length >= 10){
            cities.pop();
        }
        //cities.reverse();
}// Remove any appointments previosly scheduled at the same time as new appointment.
       
        console.log(cities);
        //Update local storage with revised cities
        localStorage.setItem('cities', JSON.stringify(cities));
        console.log(cities);
        // The city from the textbox is then added to our array
        var city = $("#locale").val();
        // calling renderButtons which handles the processing of our city array
        renderButtons();
        console.log(city);
        if (city != '') {
            $("#error").html("");

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=05704eed827c348a42aefa846e03d80c",
                // var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=Bujumbura,Burundi&units=imperial&appid=" + APIKey;
                method: "GET"
            })
                .then(function (response) {

                    console.log(response);
                 
                    postToHtml(response);
                    $.ajax({
                        url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&APPID=05704eed827c348a42aefa846e03d80c",
                        method: "GET"
                    })
                        .then(function (data) {

                            console.log(data);
                            postUV(data);
                        });
                });


        } else {
            $("#error").html('Field cannot be empty');
        }
    })
});



//var APIKey = "05704eed827c348a42aefa846e03d80c";

// Here we are building the URL we need to query the database
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
//  "q=Bujumbura,Burundi&units=imperial&appid=" + APIKey;

// Here we run our AJAX call to the OpenWeatherMap API
//$.ajax({
//   url: queryURL,
//  method: "GET"
// // })
// We store all of the retrieved data inside of an object called "response"
// .then(function(response) {

// Log the queryURL
// console.log(queryURL);

// Log the resulting object
// console.log(response);


var cities = [];
var startDate = moment();
var dateOne = moment(startDate, 'dddd').add(24, 'hours');
var dateTwo = moment(startDate, 'dddd').add(48, 'hours');
var dateThree = moment(startDate, 'dddd').add(72, 'hours');
var dateFour = moment(startDate, 'dddd').add(96, 'hours');
var dateFive = moment(startDate, 'dddd').add(120, 'hours');
$("#timeOne").html("<h4>" + dateOne.format('dddd') + "<h4>");
$("#timeTwo").html("<h4>" + dateTwo.format('dddd') + "<h4>");
$("#timeThree").html("<h4>" + dateThree.format('dddd') + "<h4>");
$("#timeFour").html("<h4>" + dateFour.format('dddd') + "<h4>");
$("#timeFive").html("<h4>" + dateFive.format('dddd') + "<h4>");
// Transfer content to HTML
function postToHtml(response) {
    // Converts the temp to Kelvin with the below formula
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".tempF").text("Temperature" + tempF + "Fahrenheit");
    var iconcode = response.weather.icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    console.log(iconurl);
    $(".city").html("<h1>" + response.name + " (" + startDate.format('L') + ") </h1>");
    $("#wicon").attr('src', iconurl);
    $(".wind").text("Wind Speed: " + response.wind.speed.toFixed(0) + " mph");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
    $(".temp").text("Temperature: " + tempF.toFixed(0) + "°F");



    // Log the data in the console as well
    console.log("Wind Speed: " + response.wind.speed);
    console.log("Humidity: " + response.main.humidity);
    console.log("Temperature (F): " + tempF);
};
// Transfer content to HTML

// Function for displaying city history data
function renderButtons() {

    // Deleting the city buttons prior to adding new city buttons
    // (this is necessary otherwise we will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array.
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class
        a.addClass("fatCity");
        // Adding a data-attribute with a value of the movie at index i
        a.attr("data-name", cities[i]);
        // Providing the button's text with a value of the movie at index i
        a.text(cities[i]);
        // Adding the button to the HTML
        $("#buttons-view").append(a);
    }
}

function postUV(data) {
    $("#uvValue").text("UV Index: " + data.value);
    if (data.value > 7) {
        console.log(data.value);
        $('#uvValue').css('background', 'red');
    } else {
        $('#uvValue').css('background', 'white');
    }
}

// Write the schedule array to html
function writeToSchedule() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    // Deleting the city buttons prior to adding new city buttons
    // (this is necessary otherwise we will have repeat buttons)
    $("#buttons-view").empty();
        // Looping through the array of movies
        for (var i = 0; i < cities.length; i++) {

            // Then dynamicaly generating buttons for each movie in the array.
            // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
            var a = $("<button>");
            // Adding a class
            a.addClass("fatCity");
            // Adding a data-attribute with a value of the movie at index i
            a.attr("data-name", cities[i]);
            // Providing the button's text with a value of the movie at index i
            a.text(cities[i]);
            // Adding the button to the HTML
            $("#buttons-view").append(a);
        }
}
