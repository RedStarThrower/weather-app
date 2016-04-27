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
    this.model.on("sync", boundRender)
}

var WeatherModel = Backbone.Model.extend({
    _generateUrl: function(lat, lng) {
        this.url = "https://api.forecast.io/forecast/fb3549f9294dafeb23736a837799d69c/" + lat + "," + lng + "?callback=?"
    }
})

var CurrentView = Backbone.View.extend({

    el: "#container",

    initialize: initView,

    _render: function() {
        var htmlString = ""
        var currentObj = this.model.attributes.currently
        var iconString = currentObj.icon
        htmlString += currentToHTML(currentObj)
        this.el.innerHTML = htmlString
        doSkyconStuff(iconString, 1)
    }
})

var HourlyView = Backbone.View.extend({

    el: "#container",

    initialize: initView,

    _render: function() {
        //console.log(this.model)
        var htmlString = ""
        var hourlyDataArray = this.model.attributes.hourly.data
            //console.log(hourlyDataArray)
        for (var i = 0; i < 24; i++) {
            var hourlyObj = hourlyDataArray[i]
            htmlString += hourlyToHTML(hourlyObj)
        }
        this.el.innerHTML = htmlString
    }
})

var DailyView = Backbone.View.extend({

    el: "#container",

    initialize: initView,

    _render: function() {
        var htmlString = ""
        var dailyDataArray = this.model.attributes.daily.data
            //console.log(dailyDataArray)
        for (var i = 0; i < dailyDataArray.length; i++) {
            var dailyObj = dailyDataArray[i]
            var iconString = dailyObj.icon
            htmlString += dailyToHTML(dailyObj, i)
        }
        this.el.innerHTML = htmlString
        for (var i = 0; i < dailyDataArray.length; i++) {
            var dailyObj = dailyDataArray[i]
            var iconString = dailyObj.icon
            doSkyconStuff(iconString, i)
        }

    }
})

var WeatherRouter = Backbone.Router.extend({

    routes: {
        "current/:lat/:lng": "doCurrentRequest",
        "hourly/:lat/:lng": "doHourlyRequest",
        "daily/:lat/:lng": "doDailyRequest",
        "*default": "doDefault"
    },

    doCurrentRequest: function(lat, lng) {
        var wm = new WeatherModel()
        wm._generateUrl(lat, lng)
        var cv = new CurrentView(wm)
        wm.fetch()
    },

    doHourlyRequest: function(lat, lng) {
        var wm = new WeatherModel()
        wm._generateUrl(lat, lng)
        var hv = new HourlyView(wm)
        wm.fetch()
    },

    doDailyRequest: function(lat, lng) {
        var wm = new WeatherModel()
        wm._generateUrl(lat, lng)
        var dv = new DailyView(wm)
        wm.fetch()
    },

    doDefault: function() {
        var successCallback = function(positionObject) {
            var lat = positionObject.coords.latitude
            var lng = positionObject.coords.longitude
            location.hash = "current/" + lat + "/" + lng
        }
        var errorCallback = function(error) {
            console.log(error)
        }
        window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
    },

    initialize: function() {
        Backbone.history.start()
    }
})

var myRtr = new WeatherRouter()

var buttonsContainer = document.querySelector("#buttons")
buttonsContainer.addEventListener('click', changeView)
