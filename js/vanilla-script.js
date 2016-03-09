console.log("hello vanilla-script")

//Data Functions

//Time Conversion

var tempConvert = function(fTemp) {
    var cValue = ((fTemp - 32) * 5 / 9)
    return cValue
}

var dateConvert = function(timeValue) {
    var dateString = ""
    var nowDate = new Date(timeValue * 1000)
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var day = days[nowDate.getDay()];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov"];
    var month = months[nowDate.getMonth()];
    var date = nowDate.getDate()
    dateString = day + ", " + month + " " + date
    return dateString
}

var currentTimeConvert = function(timeValue) {
    var timeString = ""
    var nowDate = new Date(timeValue * 1000)
    var hours = nowDate.getHours()
    var minutes = nowDate.getMinutes()
    if (minutes < 10) {
        return timeString = hours + ":" + "0" + minutes
    } 
    else {
        return timeString = hours + ":" + minutes
    }
   }

var hourlyTimeConvert = function(timeValue) {
    var timeString = ""
    var nowDate = new Date(timeValue * 1000)
    var hours = nowDate.getHours()
    return timeString = hours + ":00"
}

//Parsing and Rendering Data
var doSkyconStuff = function(iconString) {
    console.log(iconString)
    var formattedIcon = iconString.toUpperCase().replace(/-/g, "_")
    console.log(formattedIcon)
    var skycons = new Skycons({ "color": "white" });
    // on Android, a nasty hack is needed: {"resizeClear": true}
    // you can add a canvas by its ID...
    skycons.add("icon1", Skycons[formattedIcon]);
    skycons.add("icon2", Skycons[formattedIcon]);
    // start animation!
    skycons.play();
}

var renderCurrentView = function(jsonData) { //renderCurrentWeather
    var htmlString = ""
    var currentObj = jsonData.currently
    htmlString += currentToHTML(currentObj)
    container.innerHTML = htmlString
}

var renderHourlyView = function(jsonData) { //renderHourlyWeather
    var htmlString = ""
    var hourlyDataArray = jsonData.hourly.data
    for (var i = 0; i < 24; i++) {
        var hourlyObj = hourlyDataArray[i]
        htmlString += hourlyToHTML(hourlyObj)
    }
    container.innerHTML = htmlString
}

var renderDailyView = function(jsonData) { //renderDailyWeather
    var htmlString = ""
    var dailyDataArray = jsonData.daily.data
    for (var i = 0; i < dailyDataArray.length; i++) {
        var dailyObj = dailyDataArray[i]
        htmlString += dailyToHTML(dailyObj)
    }
    container.innerHTML = htmlString
}

// Convert Data to HTML

var currentToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container current-weather">' + '<p class="current-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<p class="current-time">' + currentTimeConvert(jsonObj.time) + '</p>'
    tempString += '<div>' + '<canvas id="icon1" width="100" height="100"></canvas>' + '</div>'
    tempString += '<div class="current-temp-data">'+'<p class="current-temperature">' + jsonObj.temperature.toPrecision(2) + '&deg' + '</p>' + '</div>'
    tempString += '<div class="current-summary-data">' + '<p class="current-summary">' + jsonObj.summary + '</p>' + '</div>' + '</div>'
    var iconString = jsonObj.icon
    doSkyconStuff(iconString)
    return tempString
}

var hourlyToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container hourly-weather">' + '<p class="hourly-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<p class="hourly-time">' + hourlyTimeConvert(jsonObj.time) + '</p>'
    tempString += '<div class="hourly-temp-data">' + '<p class="hourly-temperature">' + jsonObj.temperature.toPrecision(2) + '&deg' + '</p>' + '</div>'
    tempString += '<p class="hourly-summary">' + jsonObj.summary + '</p>' + '</div>'
    return tempString
}

var dailyToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container daily-weather">' + '<p class="daily-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<canvas id="icon2" width="60" height="60"></canvas>'
    tempString += '<div class="daily-temp-data">'+'<p class="daily-temperature">' + jsonObj.temperatureMin.toPrecision(2) + '&deg' + "/" + jsonObj.temperatureMax.toPrecision(2) + '&deg' + '</p>' + '</div>'
    tempString += '<div class="daily-summary-data">' + '<p class="daily-summary-data">' + jsonObj.summary + '</p>' + '</div>'+'</div>'
    var iconString = jsonObj.icon
    doSkyconStuff(iconString)
    return tempString
}

// Active Functions

var makeWeatherPromise = function(lat, lng) {
    var url = baseUrl + "/" + apiKey + "/" + lat + "," + lng + "?callback=?"
    var promise = $.getJSON(url)
    return promise
}

var router = function() {
    var route = window.location.hash.substr(1),
        routeParts = route.split('/'),
        viewType = routeParts[0],
        lat = routeParts[1],
        lng = routeParts[2]

    if (route === "") { //default route
        handleDefault()
    }

    if (viewType === "current") {
        handleCurrentView(lat, lng)
    }
    if (viewType === "daily") {
        handleDailyView(lat, lng)
    }
    if (viewType === "hourly") {
        handleHourlyView(lat, lng)
    }
}

var changeView = function(clickEvent) {
    var route = window.location.hash.substr(1),
        routeParts = route.split('/'),
        lat = routeParts[1],
        lng = routeParts[2]

    var buttonEl = clickEvent.target,
        newView = buttonEl.value
    location.hash = newView + "/" + lat + "/" + lng
}

var handleCurrentView = function(lat, lng) {
    var promise = makeWeatherPromise(lat, lng)
    promise.then(renderCurrentView)
}

var handleHourlyView = function(lat, lng) {
    var promise = makeWeatherPromise(lat, lng)
    promise.then(renderHourlyView)
}

var handleDailyView = function(lat, lng) {
    var promise = makeWeatherPromise(lat, lng)
    promise.then(renderDailyView)
}

var handleDefault = function() {
    // get current lat long, write into the route
    var successCallback = function(positionObject) {
        var lat = positionObject.coords.latitude
        var lng = positionObject.coords.longitude
        location.hash = "current/" + lat + "/" + lng
    }
    var errorCallback = function(error) {
        console.log(error)
    }
    window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
}


// https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

var apiKey = "fb3549f9294dafeb23736a837799d69c"
var baseUrl = "https://api.forecast.io/forecast"
var callbackHack = "?callback=?"
var container = document.querySelector("#main-container")
var buttonsContainer = document.querySelector("#buttons")
var inputEL = document.querySelector(".search-bar")
inputEL.addEventListener = ("focus", function() {inputEL.value = ""})

window.addEventListener('hashchange', router)
buttonsContainer.addEventListener('click', changeView)
router()
