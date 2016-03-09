console.log('hello backbone')

var changeView = function(clickEvent) {
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		lat = routeParts[1],
		lng = routeParts[2]
	var buttonEl = clickEvent.target,
		newView = buttonEl.value
	location.hash = newView + "/" + lat + "/" + lng
}

var initView = function(someModel) {
	this.model = someModel
	var boundRender = this._render.bind(this)
	this.model.on("sync",boundRender)
}


var WeatherModel = Backbone.Model.extend({
	_generateUrl: function(lat,lng) {
		this.url = "https://api.forecast.io/forecast/976151b2336a5cba8b9ad9404c7cc25e/" + lat + "," + lng + "?callback=?"
	}
})

var CurrentlyView = Backbone.View.extend({

	el: "#container",

	initialize: initView,

	_render: function() {
		var currentObj = this.model.attributes.currently
		var iconString = currentObj.icon
		this.el.innerHTML = '<p class="temp">' + currentObj.temperature + '</p>'
	}
})

var DailyView = Backbone.View.extend({

	el: "#container",

	initialize: initView,

	_render: function() {
		console.log(this.model)
		var daysArray = this.model.attributes.daily.data
		var htmlString = ''
		for (var i = 0; i < daysArray.length; i ++) {
			var dayObject = daysArray[i]
			htmlString += '<div class="day">'
			htmlString += '<p class="max">' + dayObject.temperatureMax.toPrecision(2) + '&deg;</p>'
			htmlString += '<p class="min">' + dayObject.temperatureMin.toPrecision(2) + '&deg;</p>'
			htmlString += '</div>'
		}
		this.el.innerHTML = htmlString		
	}
})

var WeatherRouter = Backbone.Router.extend({

	routes: {
		"current/:lat/:lng": "handleCurrentWeather",
		"daily/:lat/:lng": "handleDailyWeather",
		"*default": "handleDefault"
	},

	handleCurrentWeather: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateUrl(lat,lng)
		var cv = new CurrentlyView(wm)
		wm.fetch()
	},

	handleDailyWeather: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateUrl(lat,lng)
		var dv = new DailyView(wm)
		wm.fetch()
	},

	handleDefault: function() {
	 	// get current lat long, write into the route
	 	var successCallback = function(positionObject) {
	 		var lat = positionObject.coords.latitude 
	 		var lng = positionObject.coords.longitude 
	 		location.hash = "current/" + lat + "/" + lng
	 	}
	 	var errorCallback = function(error) {
	 		console.log(error)
	 	}
	 	window.navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
	},

	initialize: function() {
		Backbone.history.start()
	}
})

var myRtr = new WeatherRouter()

var buttonsContainer = document.querySelector("#buttons")
buttonsContainer.addEventListener('click',changeView)
