// Development Information
// Primary Developer Contact Information:
// Sebastian Remar
// Statler College of Engineering & Mineral Resources
// Student at the department of Aerospace/Mechanical Engineer
// Minor Computer Science
// West Virginia University (WVU)
// rsr0016@mix.wvu.edu
// Development History
// Date                   Developer        Comments
// -------------        -------------      ------------------------------------------------------------
// March 03, 2021    Sebastian Remar       First project using an API. Pretty satisfied with the results. 


// ================= WEATHER APP ================ //
// Creating Object weather 
let weather = {
    // Api key from open weather
    "apiKey" : "Enter API Key",

    // Fetching data from API
    fetchWeather: function(city){
        fetch("http://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=metric&appid=" 
        + this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    // Displaying Weather data
    displayWeather:function(data){
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        // Extracting icon from API
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.trunc(temp) + " °C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/hr";
        document.querySelector(".weather").classList.remove("loading");
        // Attempting to display an image related to user's input
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name +"')";

    },
    search:function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button").addEventListener("click",function(){
    weather.search();
});
// Object geoCode
let geoCode = {
    // Reverse code with user's latitude and longitude
    reverseGeocode : function (latitude,longitude){
        var apikey = 'Enter API key';
        var api_url = 'https://api.opencagedata.com/geocode/v1/json'
        // Code not written by developer, used from API. 
        var request_url = api_url
            + '?'
            + 'key=' + apikey
            + '&q=' + encodeURIComponent(latitude + ',' + longitude)
            + '&pretty=1'
            + '&no_annotations=1';
        // see full list of required and optional parameters:
        // https://opencagedata.com/api#forward
        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);
        request.onload = function() {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
        if (request.status === 200){ 
        // Success!
            var data = JSON.parse(request.responseText);
            // If there is not a city specified, try to look if there is a county instead. 
            if(data.results[0].components.city == undefined){
                weather.fetchWeather(data.results[0].components.county);
            } else{
                weather.fetchWeather(data.results[0].components.city)
            }
        } else if (request.status <= 500){ 
        // We reached our target server, but it returned an error
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
        } else {
            console.log("server error");
        }
    };
    request.onerror = function() {
    // There was a connection error of some sort
        console.log("unable to connect to server");        
    };
    request.send();  // make the request
    },
    getLocation: function(){
        function success (data){
            // geoCode.reverseGeocode(data.coords.latitude, data.coords.longitude);
            geoCode.reverseGeocode(40.646061,-111.497971)
        }
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success,console.error);
        } 
        else{
            // If cannot access user location, display weather at Lima instead. 
            weather.fetchWeather("Lima");
        }
    }    
};

document
.querySelector(".search-bar")
.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        weather.search();
    }
});

geoCode.getLocation();

