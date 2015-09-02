'use strict';
angular.module('myFirstApp')
  .service('userService', ['$q', '$log', '$timeout', '$window', 'Parse', function ($q, $log, $timeout, $window, Parse) {

    // AngularJS will instantiate a singleton by calling "new" on this function


    var user = {  //Default user object
          'isLoggedIn' : false,
          'username': '',
          'email': '',
          'mobile': '',
          'oID': '',
          'sToken': '',
          'firstName': '',
          'lastName': '',
          'userType': '',
        };
        //user = {};    //cached user info
    //Using merge for recursive copy and avoid object reference
     //angular.merge(user, _defUser);


    //Update user info from Parse API response
  function _updateLoggedInStatus() {

    var bOldStatus = user.isLoggedIn;
    user.isLoggedIn = ( (user.email.length && user.emailVerified) || (user.mobile.length && user.mobileVerified));
    if(bOldStatus === user.isLoggedIn) {
      //no status change
      return;
    }
    //user status is changed
    var userId = null;
    if(user.isLoggedIn && user.oID.length) {
      userId = user.oID;
    }

  }

   function _updateUserInfo(u, bNotify) {

     if(angular.isUndefined(bNotify)) {
       bNotify = true;
     }

     //store old stoken
     var oldSToken = user.sToken;

     user.email = u.email || '';
     user.mobile = u.mobile || '';
     user.name = u.username || '';
     user.oID = u.objectId;
     user.sToken = u.session || user.sToken;
     user.emailVerified = u.emailVerified;
     user.mobileVerified = u.mobileVerified || false;
     user.userType = u.userType;

     _updateLoggedInStatus();

     if(bNotify) {
       //_userStatusNotify();
     }
   }



    function ObjResult(sts, code, swCode, msg) {
      this.sts = sts || false;
      this.code = code || 1;
      this.msg = msg || 'Parse Error';
      this.swCode = -1;
      this.errObj = {};
      if(angular.isDefined(swCode)) {
        this.swCode = swCode;
      }
    }
    function _defResult() {
      /*Default result object*/
      return new ObjResult();
    }




    function _parseErrorResponse(o) {
      //parse error response and return in expected format
      var ret = _defResult(), err = {};

      //if you got the same object (return value from local utility function)
      //return as it is.
      if(angular.isDefined(o.sts)) {
        return o;
      }

      if(o.code) {
        ret.code = o.code;
      }
      if(angular.isString(o.result)) {
        ret.msg = o.result;
        return ret;
      }
      if(angular.isUndefined(o.error)){
        return ret;
      }

      //error message is returned as string instead of object occasionally :(
      if(angular.isObject(o.error) && o.error.message){
        ret.msg = o.error.message;
      } else if(angular.isString(o.error)){
        ret.msg = o.error;
        if(o.error.match(/^JSON:/)) {
          ret.msg = o.error.replace(/^JSON:/,'');
        }

        try {
          err = angular.fromJson(ret.msg);
          if(err && (err.details || err.message||err.status)) {
            ret.msg = (err.details || err.message || err.status);
          }
          ret.swCode = err.code || -1;
        }catch(e){}
      }

      //remove some default text.
      ret.msg = ret.msg.replace(/^Request failed with response: /,'');
      return ret;
    }

    function _signup(payload) {
      var email = payload.email || '';
      var password = payload.passwd || '';
      var mobile = payload.mobile || '';
      email = email.toLowerCase();

      var ret = _defResult(), d = $q.defer();

      //Basic validation
      if(!email.length || !password.length || !mobile.length ) {
        ret.msg = 'Invalid Input!';
        //reject via timeout for indicator to receive rejection
        $timeout(function() {
          d.reject(ret);
        }, 0);
        return d.promise;
      }

      //Perform email & mobile validation
      $timeout(function() {
        d.notify('validating');
      },0);

        var o = {
          'email' : email,
          'password': password,
          'mobile': mobile,
          'username' : payload.username,
          'city'  : payload.city,
          'area'  : payload.area,
          'pincode' : payload.pincode,
          'services' : payload.services,
          'userType' : payload.userType

        };
        Parse.save({api: 'appSignup'}, o).$promise.then(function(data){
          $log.debug('Login response ' + JSON.stringify(data));
          if(angular.isUndefined(data.result) || data.result.status !== 'success') {
            d.reject(ret);
          }
        /*Update all user info*/
        _updateUserInfo(data.result.user);
        ret.sts = true;
        d.resolve(user);
      }).catch(function(r){
        ret = _parseErrorResponse(r.data||r);
        d.reject(ret);
      }).finally(function(){
        d.reject(ret);
      }, function(s) {
        //proxy the notification
        if(angular.isString(s) && s.length) {
          d.notify(s);
        }
      });

      //always return deferred object
      return d.promise;


    }

    function _login(username, password) {
      //normalize input
      username = username || '';
      password = password || '';

      username = username.toLowerCase();  //email address should be case-insensitive here.

      var ret = _defResult(), d = $q.defer();

      //input validation
      //validation as per rule, should be done in the controller. We do
      //minimum empty check here.
      if(!username.length || !password.length) {
        ret.msg = 'Invalid input!';
        //reject via timeout for indicator to receive rejection
        $timeout(function() {
          d.reject(ret);
        }, 0);
        return d.promise;
      }

      //set progress
      //As this is before we return promise, wrap it in timeout
      $timeout(function() {
        d.notify('Logging in');
      }, 0);
      var o = {
        'username': username,
        'password': password

      };

      //send ajax form submission
      Parse.save({api: 'appLogin'}, o).$promise.then(function(data){
        $log.debug('Login response ' + JSON.stringify(data));
        if(angular.isUndefined(data.result) || data.result.status !== 'success') {
          d.reject(ret);
        }
        /*Update all user info*/
        _updateUserInfo(data.result.user);
        ret.sts = true;
        d.resolve(user);
      }).catch(function(r){
        ret = _parseErrorResponse(r.data||r);
        d.reject(ret);
      }).finally(function(){
        d.reject(ret);
      }, function(s) {
        //proxy the notification
        if(angular.isString(s) && s.length) {
          d.notify(s);
        }
      });

      //always return deferred object
      return d.promise;
    }


    return {
      isLoggedIn: function() { return user.isLoggedIn; },
      getUser: function() {return user;},
      signup: _signup,
      login: _login,


    };



  }]);
