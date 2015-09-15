var labwiseApp = angular.module('labwiseApp', ['ngRoute','ui.bootstrap', 'ngResource', 'cgBusy' ]);

var app = {
    // Application Constructor
    initialize: function() {

        //console.log("initializing");
        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onErr);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },

    onErr: function(error)
    {
        console.log('Unable startup :' + '\n' + error.message);
    },

    onSuccess: function(position)
    {
        labwiseApp.latitude = position.coords.latitude;
        labwiseApp.longitude = position.coords.longitude;
        console.log("lat: " + position.coords.latitude);
        console.log("long: " + position.coords.longitude);
        var lat = parseFloat(position.coords.latitude);
        var lng = parseFloat(position.coords.longitude);

        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              var reverse_geo = results[1];
              if (reverse_geo.address_components[0]) {

                alert(reverse_geo.address_components[4].long_name+"," + reverse_geo.address_components[3].long_name+"," + reverse_geo.address_components[2].long_name+"," + reverse_geo.address_components[0].long_name);
                //text = text + "0: " + reverse_geo.address_components[0].long_name + "<br />"1: " + reverse_geo.address_components[1].long_name + "<br />"";
              }
            }
          }
          else {
              alert("No hay information Geocoding.");
          }
        });

    }
};
