// F to C convert
var tempCbutton = document.querySelector("#temp-C-button")
var currentFtemp = document.querySelector(".current-temperature")

var tempConvert = function(fTemp) {
	var cValue = ((fTemp - 32) * 5/9)
	return cValue
}


