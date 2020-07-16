$(document).ready(function () {
    writeToSchedule();
    // localStorage.clear();
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    
    $('#submitWeather').click(function (event) {
        // event.preventDefault() prevents the form from trying to submit itself.
        // We're using a form so that the user can hit enter instead of clicking the button if they want
        event.preventDefault();
        // This line will grab the text from the input box
        var newCity = $("#locale").val().trim();


        // Create array to store high scores
        cities = JSON.parse(localStorage.getItem("cities")) || [];

        //console.log(cities);empty

        // add new city to cities
        if (newCity != "") {
            cities.unshift(newCity);
            cities = Array.from(new Set(cities));
            if (cities.length >= 12) {
                cities.pop();
            }
            // cities.reverse();
        } // Remove any appointments previosly scheduled at the same time as new appointment.

        //console.log(cities);
        // Update local storage with revised cities
        localStorage.setItem('cities', JSON.stringify(cities));
        //console.log(cities);
        // The city from the textbox is then added to our array
        var city = $("#locale").val();
        // calling renderButtons which handles the processing of our city array
        renderButtons();
        //console.log(city);
        getTheWeather(city);

    });


    

    $(document).on("click", ".fatCity", function () {
        //console.log("fatCity button pushed");
        var city = $(this).attr("data-name");
        getTheWeather(city);
    });
    // $(document).on("click", "#clearStorage", localStorage.clear());
   // $('#clearStorage').click(function (event) {
    //    clearStorage();
    //});
});
$('#clearStorage').click(function (event) {
    clearStorage();
});

// var APIKey = "05704eed827c348a42aefa846e03d80c";

// Here we are building the URL we need to query the database
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
// "q=Bujumbura,Burundi&units=imperial&appid=" + APIKey;


var cities = [];
var startDate = moment();
var dateOne = moment(startDate, 'dddd').add(24, 'hours');
var dateTwo = moment(startDate, 'dddd').add(48, 'hours');
var dateThree = moment(startDate, 'dddd').add(72, 'hours');
var dateFour = moment(startDate, 'dddd').add(96, 'hours');
var dateFive = moment(startDate, 'dddd').add(120, 'hours');
/*$("#time1").html("<h4>" + dateOne.format('dddd') + "<h4>");
$("#time2").html("<h4>" + dateTwo.format('dddd') + "<h4>");
$("#time3").html("<h4>" + dateThree.format('dddd') + "<h4>");
$("#time4").html("<h4>" + dateFour.format('dddd') + "<h4>");
$("#time5").html("<h4>" + dateFive.format('dddd') + "<h4>");*/
// Transfer content to HTML
function postToHtml(response) { // Converts the temp to Kelvin with the below formula
    $(".icon").empty();
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".tempF").text("Temperature" + tempF + "Fahrenheit");
    //var iconCode = data.weather[0].icon;
    var iconcode = response.weather[0].icon;
    console.log(iconcode);
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    console.log(iconurl);
    $(".city").html("<h1>" + response.name + " </h1>");
    $(".time").html("<h3>" + startDate.format('dddd') + ",  " + startDate.format('LL') + "</h3>");
    $(".icon").append("<img src='" + iconurl  + "' >");
    $(".wind").text("Wind Speed: " + response.wind.speed.toFixed(0) + " mph");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
    $(".temp").text("Temperature: " + tempF.toFixed(0) + "°F");
//api.openweathermap.org/data/2.5/weather
    // Log the data in the console as well
    //console.log("Wind Speed: " + response.wind.speed);
    //console.log("Humidity: " + response.main.humidity);
    //console.log("Temperature (F): " + tempF);

};
// Transfer five day forecast content to HTML
function fiveDayForecast(response) {
    $("#dayContainer").empty();
    var iterator = 0;
    for (i = 0; i < 40; i ++) {
        anotherDay = response.list[i].dt_txt;
        anotherDay = anotherDay.slice(-8);
        
        if (anotherDay === "15:00:00") {
            //console.log(anotherDay);
            iterator = iterator + 1;
            //console.log(iterator);
            var tempF = (response.list[i].main.temp - 273.15) *1.80 +32;
            $("#dayContainer").append("<div class='column' id='dayColumn'><div id='forecastBox'><p id='time" + iterator + "'><hr></p> <div class='weatherIcon" + iterator + "day'></div><div class='temp" + iterator + "day'></div><div class='humidity" + iterator + "day'></div></div>'");
           
            var uconcode = response.list[i].weather[0].icon;
            //console.log(uconcode);
            var uconurl = "https://openweathermap.org/img/w/" + uconcode + ".png";
            //console.log(uconurl);
            
            //$(".icon").append("<img src='" + iconurl  + "'>");
            
            var weatherData = ".weatherIcon" + iterator + "day";
            //console.log(weatherData);
            $(weatherData).append("<img src='" + uconurl  + "'>");
            var humidityData = ".humidity" + iterator + "day";
            //console.log(humidityData);
            $(humidityData).text("Humidity: " + response.list[i].main.humidity + "%");
            var tempData = ".temp" + iterator + "day";
            //console.log(tempData);
            $(tempData).text("Temperature: " + tempF.toFixed(0) + "°F");
            //console.log("Another time throught he loop");
        } // End if
    } // End For loop
    //console.log("I am here");
    $("#time1").html("<h4>" + dateOne.format('dddd') + "<h4>");
    $("#time2").html("<h4>" + dateTwo.format('dddd') + "<h4>");
    $("#time3").html("<h4>" + dateThree.format('dddd') + "<h4>");
    $("#time4").html("<h4>" + dateFour.format('dddd') + "<h4>");
    $("#time5").html("<h4>" + dateFive.format('dddd') + "<h4>");
}
// End Function

// Function for displaying city history data
function renderButtons() {
    // Deleting the city buttons prior to adding new city buttons
    // (this is necessary otherwise we will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array.
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var a = $("<button id='cityButton'>");
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
    $("#uvValue").html("UV Index: <div id = 'dataValue'>" + data.value + "</div>");
    if (data.value > 7) {
        //console.log(data.value);
        $('#dataValue').css('background', 'red');
        //data.attr("data.value", );
    } else {
        $('#dataValue').css('background', 'white');
    }
}


// Write the schedule array to html
function writeToSchedule() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    // Deleting the city buttons prior to adding new city buttons
    // (this is necessary otherwise we will have repeat buttons)
    console.log(cities[0]);
    $("#locale").val(cities[0]);
    getTheWeather(cities[0]);
    // $("#locale").val().text(cities[0]);
    $("#buttons-view").empty();
    // Looping through the array of cities
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
function getTheWeather(city) {
    //console.log("getTheWeather function was called")
    if (city != '') {
        $("#error").html(""); // Clears error message field when text is entered

        $.ajax({ // AJAX call for current conditions
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=05704eed827c348a42aefa846e03d80c",
            method: "GET"
        }).then(function (response) {

            //console.log(response);
            postToHtml(response);
            $.ajax({ // AJAX call for UV data
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&APPID=05704eed827c348a42aefa846e03d80c",
                method: "GET"
            }).then(function (data) { // Post UV to HTML.then function data
                //console.log(data);
                postUV(data);

            });
        });
        $.ajax({ // AJAX call for 5 day forecast ex...api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=790cf6ec7fe5512d347deb73bd7b4690",
            method: "GET"
        }).then(function (response) { // Post current forecast to HTML.then function response
            //console.log(response);
            fiveDayForecast(response);
        });
    } else { // Error message if user doesn't enter anything
        $("#error").html('Field cannot be empty');
    }
}
function clearStorage() {
    //console.log("Local storage to be cleared");
    localStorage.clear();
    $("#buttons-view").empty();
}
/*
function render() {
    const renderWeatherIcon = this.state.data.weather.map(item => {
      return <img src={`http://openweathermap.org/img/w/${item.icon}.png`} />;
    });
    return <div>{renderWeatherIcon}</div>;
  }*/