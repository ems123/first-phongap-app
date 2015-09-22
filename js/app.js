var labwiseApp = angular.module('labwiseApp', ['ngRoute','ui.bootstrap', 'ngResource', 'cgBusy', 'autocomplete' ]);

var app = {
    // Application Constructor
    initialize: function() {
        //console.log("initializing");
        //this.bindEvents();
        if (navigator.userAgent.match(/(iOS|iPhone|iPod|iPad|Android|BlackBerry)/)) {
          console.log("UA: Running in Cordova/PhoneGap");
          document.addEventListener("deviceready", this.bootstrapAngularMobile, false);
        } else {
          console.log("UA: Running in browser");
          this.bootstrapAngular();

        }

    },

    bootstrapAngular : function () {
      console.log("Bootstrapping AngularJS");
      // This assumes your app is named "app" and is on the body tag: <body ng-app="app">
      // Change the selector from "body" to whatever you need
      var domElement = document.getElementById('labwiseApp');
      // Change the application name from "app" if needed
      angular.bootstrap(document, ['labwiseApp']);
    },

    bootstrapAngularMobile : function () {
      console.log("Bootstrapping AngularJS");
      // This assumes your app is named "app" and is on the body tag: <body ng-app="app">
      // Change the selector from "body" to whatever you need
      var domElement = document.getElementById('labwiseApp');
      // Change the application name from "app" if needed
      angular.bootstrap(document, ['labwiseApp']);
      //app.receivedEvent('deviceready');
      app.checkConnection();
      app.registerPush();
    },

    /*
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
      angular.element(document).ready(function() {
            angular.bootstrap(document);
      });
      app.receivedEvent('deviceready');
      app.checkConnection();
      navigator.geolocation.getCurrentPosition(app.onSuccess, app.onErr);


    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        var device = window.device;
        labwiseApp.device = device;
    },

    onErr: function(error)
    {
        //alert('Unable startup :' + '\n' + error.message);
    },

    onSuccess: function(position)
    {
        navigator.notification.alert('geolocation found');
        labwiseApp.latitude = position.coords.latitude;
        labwiseApp.longitude = position.coords.longitude;
    },*/

    checkConnection: function() {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        navigator.notification.alert('connection type:' + states[networkState]);
        if(networkState == Connection.NONE) {
          navigator.notification.alert('No network connection. Please turn on network access');
        }
  },

  registerPush: function () {

        try  {
          labwiseApp.pushService.unregister(
            function(e) {
              //unRegister Success!!!
              navigator.notification.alert('unRegister Success');
            },
            function(e) {
              //unRegister Failed!!!
              navigator.notification.alert('unRegister Failed');
            });
        }catch(err) {
          //Handle errors here
          navigator.notification.alert(err.message);
        }

        labwiseApp.pushService.register().then(function(result) {
          navigator.notification.alert(result);
          localStorage.set('RED-ID', result);
        }, function(err) {
          navigator.notification.alert(err);
        });
  }

};
