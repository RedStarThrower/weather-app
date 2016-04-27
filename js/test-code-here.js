//console.log('hello code-test')

//Variables

//https://maps.googleapis.com/maps/api/geocode/json?address=houston,tx
var inputEl = document.querySelector(".search-bar")
var locationText = document.querySelector("#location-text")

//var searchPromise = $.getJSON(fullURL)

var handleSearchData = function(jsonObj) {
	console.log(jsonObj)
	var locationsString = ""
	var lat = jsonObj.results[0].geometry.location.lat
	var lng = jsonObj.results[0].geometry.location.lng
	var formattedLocation = jsonObj.results[0].formatted_address
	locationText.innerHTML = formattedLocation
	var fullURL = "https://api.forecast.io/forecast/fb3549f9294dafeb23736a837799d69c/" + lat + "," + lng + "?callback=?"
	var forecastPromise = $.getJSON(fullURL)
	forecastPromise.then()
	}

//searchPromise.then(showData)

//Functions

var searchRequest = function(keyEvent) {
	var baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
	var inputEl = keyEvent.target
	if (keyEvent.keyCode === 13) {
		var searchQuery = inputEl.value
		inputEl.value = ""
		//console.log(searchQuery)
		var fullURL = baseURL + searchQuery
		//console.log(fullURL)
		var searchPromise = $.getJSON(fullURL)
		searchPromise.then(handleSearchData)
	}	
}

inputEl.addEventListener("keydown", searchRequest)

