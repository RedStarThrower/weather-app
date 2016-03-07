// Variables

var apiKey = "fb3549f9294dafeb23736a837799d69c"

var baseUrl = "https://api.forecast.io/forecast/"

var mainContainer = document.querySelector("#main-container")

var callbackHack = "?callback=?"

var tempCbutton = document.querySelector("#temp-C-button")
var currentViewButton = document.querySelector("#current-view-button")
var hourlyViewButton = document.querySelector("#hourly-button")
var weeklyViewButton = document.querySelector("#weekly-button")

// General Functions
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
    	if (minutes.length === 1) {
        	minutes = "0" + minutes
        	timeString = hours + ":" + minutes
        	return timeString
    	}
    timeString = hours + ":" + minutes
    return timeString
}

var hourlyTimeConvert = function(timeValue) {
    var timeString = ""
    var nowDate = new Date(timeValue * 1000)
    var hours = nowDate.getHours()
    return timeString = hours + ":00"
}

var renderCurrentView = function(jsonData) {
    var htmlString = ""
    var currentObj = jsonData.currently
    htmlString += currentToHTML(currentObj)
    mainContainer.innerHTML = htmlString
}

var renderHourlyView = function(jsonData) {
    var htmlString = ""
    var hourlyDataArray = jsonData.hourly.data
    for (var i = 0; i < 25; i++) {
        var hourlyObj = hourlyDataArray[i]
        htmlString += hourlyToHTML(hourlyObj)
    }
    mainContainer.innerHTML = htmlString
}

var renderDailyView = function(jsonData) {
    var htmlString = ""
    var dailyDataArray = jsonData.daily.data
    for (var i = 0; i < dailyDataArray.length; i++) {
        var dailyObj = dailyDataArray[i]
        htmlString += dailyToHTML(dailyObj)
    }
    mainContainer.innerHTML = htmlString
}

var currentToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container current-weather">' + '<p class="current-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<p class="current-time">' + currentTimeConvert(jsonObj.time) + '</p>'
    tempString += '<p class="current-temperature">' + jsonObj.temperature.toPrecision(2) + '&deg' + '</p>'
    tempString += '<p class="current-summary">' + jsonObj.summary + '</p>' + '</div>'
    return tempString
}

var hourlyToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container hourly-weather">' + '<p class="hourly-date">' + dateConvert(jsonObj.time) + '</p>'
    tempString += '<p class="hourly-time">' + hourlyTimeConvert(jsonObj.time) + '</p>'
    tempString += '<p class="hourly-temperature">' + jsonObj.temperature.toPrecision(2) + '&deg' + '</p>'
    tempString += '<p class="hourly-summary">' + jsonObj.summary + '</p>' + '</div>'
    return tempString
}

var dailyToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div class="temp-container daily-weather">' + '<p class="daily-date">' + dateConvert(jsonObj.time)
    tempString += '<p class="daily-temperature">' + jsonObj.temperatureMin.toPrecision(2) + '&deg' + "/" + jsonObj.temperatureMax.toPrecision(2) + '&deg' + '</p>'
    tempString += '<p class="daily-summary">' + jsonObj.summary + '</p>' + '</div>'
    return tempString
}

// Active Functions

var doRequest = function(lat, lng) {
    var fullUrl = baseUrl + apiKey + "/" + lat + "," + lng + callbackHack
    //console.log(fullUrl)
    return $.getJSON(fullUrl)
}

var latLongCurrent = function(positionObject) {
    var lat = positionObject.coords.latitude
    var lng = positionObject.coords.longitude
    window.location.hash = "currentView/" + lat + "/" + lng
}

var latLongHourly = function(positionObject) {
    var lat = positionObject.coords.latitude
    var lng = positionObject.coords.longitude
    window.location.hash = "hourlyView/" + lat + "/" + lng
}

var latLongDaily = function(positionObject) {
    var lat = positionObject.coords.latitude
    var lng = positionObject.coords.longitude
    window.location.hash = "dailyView/" + lat + "/" + lng
}

var router = function() {
    //console.log(window.location)
    var route = window.location.hash.substr(1)
    var routeParts = route.split('/')
    var viewType = routeParts[0]
    var lat = routeParts[1]
    var lng = routeParts[2]
    //console.log(routeParts)
    if (viewType === "currentView") {
        doRequest(lat, lng).then(renderCurrentView)
    } else if (viewType === "hourlyView") {
        console.log('rending hourly view')
        doRequest(lat, lng).then(renderHourlyView)
    } else if (viewType === "dailyView") {
        console.log('rending weekly view')
        doRequest(lat, lng).then(renderDailyView)
    }
}

window.addEventListener("hashchange", router)

//tempCbutton.addEventListener("hover", )

currentViewButton.addEventListener("click", function() {
    navigator.geolocation.getCurrentPosition(latLongCurrent)
})

hourlyViewButton.addEventListener("click", function() { 
     navigator.geolocation.getCurrentPosition(latLongHourly)
 })

weeklyViewButton.addEventListener("click", function() { 
    navigator.geolocation.getCurrentPosition(latLongDaily)
})

if (window.location.hash.substr(1) === "") {
    navigator.geolocation.getCurrentPosition(latLongCurrent)
} else router()
