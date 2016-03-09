console.log("hello utility-script")

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
    } else if (hours < 10) {
        return timeString = "0" + hours + ":" + minutes
    } else {
        return timeString = hours + ":" + minutes
    }
}

var hourlyTimeConvert = function(timeValue) {
    var timeString = ""
    var nowDate = new Date(timeValue * 1000)
    var hours = nowDate.getHours()
    if (hours < 10) {
        return timeString = "0" + hours + ":00"
    }
    return timeString = hours + ":00"
}

//Parsing and Rendering Data

var doSkyconStuff = function(iconString, i) {
    //console.log(iconString)
    var formattedIcon = iconString.toUpperCase().replace(/-/g, "_")
        //console.log(formattedIcon)
    var skycons = new Skycons({ "color": "white" });
    skycons.add("icon" + i, Skycons[formattedIcon]);
    skycons.play();
}

// Convert Data to HTML

var currentToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container current-weather">' + '<p class="current-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<p class="current-time">' + currentTimeConvert(jsonObj.time) + '</p>'
    tempString += '<div class="icons">' + '<canvas id="icon1" width="100" height="100"></canvas>' + '</div>'
    tempString += '<div class="current-temp-data">' + '<p class="current-temperature">' + jsonObj.temperature.toPrecision(2) + '&deg' + '</p>' + '</div>'
    tempString += '<div class="current-summary-data">' + '<p class="current-summary">' + jsonObj.summary + '</p>' + '</div>' + '</div>'
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

var dailyToHTML = function(jsonObj, i) {
    var tempString = ""
    tempString += '<div class="temp-container daily-weather">' + '<p class="daily-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<div class="icons">' + '<canvas id="icon' + i + '"width="60" height="60"></canvas>' + '</div>'
    tempString += '<div class="daily-temp-data">' + '<p class="daily-temperature">' + jsonObj.temperatureMin.toPrecision(2) + '&deg' + "/" + jsonObj.temperatureMax.toPrecision(2) + '&deg' + '</p>' + '</div>'
    tempString += '<div class="daily-summary-data">' + '<p class="daily-summary-data">' + jsonObj.summary + '</p>' + '</div>' + '</div>'
    return tempString
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

//Variables

// https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

var apiKey = "fb3549f9294dafeb23736a837799d69c"
var baseUrl = "https://api.forecast.io/forecast"
var callbackHack = "?callback=?"
var container = document.querySelector("#container")
var buttonsContainer = document.querySelector("#buttons")
var inputEL = document.querySelector(".search-bar")


