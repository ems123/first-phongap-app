var labwiseApp = angular.module('labwiseApp', ['ngRoute','ui.bootstrap', 'ngResource', 'cgBusy', 'autocomplete' ]);

var app = {
    // Application Constructor
    initialize: function() {
        //console.log("initializing");
        //this.bindEvents();
        if (navigator.userAgent.match(/(iOS|iPhone|iPod|iPad|Android|BlackBerry|android)/)) {
          console.log("UA: Running in Cordova/PhoneGap");
          document.addEventListener("deviceready", this.bootstrapAngularMobile, false);
          navigator.notification.alert('Preparing for installation.');
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
      navigator.notification.alert('initializing App.');
      // Change the application name from "app" if needed
      app.checkConnection();
      setTimeout(app.registerPush(), 3000 );
      //app.registerPush();
      angular.bootstrap(document, ['labwiseApp']);
      //app.receivedEvent('deviceready');
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
        navigator.notification.alert('checking connection.');
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

    // handle GCM notifications for Android
  onNotificationGCM: function (event) {
      switch (event.event) {
        case 'registered':
          if (event.regid.length > 0) {
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + event.regid);
            alert("regID = " + event.regid);
            localStorage.set('regID', event.regid);
            //send device reg id to server

          }
          break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (event.foreground) {
              console.log('INLINE NOTIFICATION');
              var my_media = new Media("/android_asset/www/" + event.soundname);
              my_media.play();
            } else {
              if (event.coldstart) {
                  console.log('COLDSTART NOTIFICATION');
              } else {
                  console.log('BACKGROUND NOTIFICATION');
              }
            }

            navigator.notification.alert(event.payload.message);
            console.log('MESSAGE -> MSG: ' + event.payload.message);
            //Only works for GCM
            console.log('MESSAGE -> MSGCNT: ' + event.payload.msgcnt);
            //Only works on Amazon Fire OS
            console.log('MESSAGE -> TIME: ' + event.payload.timeStamp);
            break;

        case 'error':
            console.log('ERROR -> MSG:' + event.msg);
            break;

        default:
            console.log('EVENT -> Unknown, an event was received and we do not know what it is');
            break;
      }
    },

    // handle APNS notifications for iOS
    successIosHandler: function (result) {
      console.log('result = ' + result);
    },

    onNotificationAPN : function (e) {
      if (e.alert) {
        console.log('push-notification: ' + e.alert);
        navigator.notification.alert(e.alert);
      }

      if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
      }

      if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber("successIosHandler", e.badge);
      }
    },

    registerPush: function () {

      navigator.notification.activityStart('Registering Device ' + device.uuid);
      setTimeout(function () {
          if (device.platform == 'android' || device.platform == 'Android') {
            pushConfig = {
              "senderID":"680823599239", //AIzaSyBqowOyiEWd41TcXAuaaThtENCWGNGbcK4",
              "ecb":"onNotificationGCM"
            };
          } else {
            pushConfig = {
              "badge":"true",
              "sound":"true",
              "alert":"true",
              "ecb":"onNotificationAPN"
            };
          }
          try {
            window.plugins.pushNotification.unregister(
              function(e) {
                //unRegister Success!!!
                navigator.notification.alert('unRegister Success');
              },
              function(e) {
                //unRegister Failed!!!

              });
          }catch(err) {
            //Handle errors here
            navigator.notification.alert(err.message);
          }

        window.plugins.pushNotification.register(
          function (result) {
            navigator.notification.alert('unRegister Success');
            navigator.notification.alert(result);
          },
          function (error) {
              navigator.notification.alert('unRegister Failed');
          },
          pushConfig);
          navigator.notification.activityStop();
      }, 3000);

  }

};
