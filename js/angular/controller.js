myFirstApp.controller('mainController', ['$scope', '$route', '$window','userService', function($scope, $route, $window, userService ){

  $scope.openSite = function () {
    $window.open('http://labwise.in', '_blank');

  };

}]);

myFirstApp.controller('registerController', ['$scope', '$location', '$route', '$window','userService',
  function($scope, $location, $route, $window, userService){

  $scope.chooseTrue = true;
  $scope.providerView = false;
  $scope.providerView2 = false;
  $scope.userView = false;

  $scope.word = '/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/';


  $scope.providerSelected = function () {

    $scope.providerView = true;
    $scope.chooseTrue = false;
  };

  $scope.userSelected = function () {

    $scope.providerView = false;
    $scope.chooseTrue = false;
    $scope.userView = true;
  };

  $scope.submitProvideFormView1 = function() {



    if(! ($scope.lab || $scope.nurse || $scope.rmp || $scope.physio || $scope.food) ) {
      alert('Please select at least one service');
      return;
    }

    if(!($scope.city && $scope.area && $scope.pincode) ) {
      alert('Please fill all details');
      return;
    }

    $scope.chooseTrue = false;
    $scope.providerView = false;
    $scope.providerView2 = true;

  };

  $scope.saveProvider = function () {

    console.log($scope.pname  + '&&' + $scope.email  + ' &&' + $scope.mobile  + '&&' +  $scope.passwd);

    var regex = /^1?([2-9]\d\d){2}\d{4}$/,
    regexReplace = /\D/g,
    EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if(!($scope.pname && $scope.email && $scope.mobile && $scope.passwd)) {
      alert('Please enter details');
      return;
    }

    var email = $scope.email;
    if((email.length === 0) || !EMAIL_REGEXP.test(email)) {
      alert('Please enter a valid email');
      return;
    }
    var mobile = $scope.mobile;
    mobile = mobile.replace(regexReplace, '');
    if((mobile.length !== 10) || !regex.test(mobile)) {
      alert('Please enter a valid 10 digit mobile');
      return;
    }


    var payload = {};
    payload.email = email;
    payload.mobile = mobile;
    payload.username = $scope.pname;
    payload.passwd = $scope.passwd;
    payload.services = [];
    $scope.lab ? payload.services.push('LAB') : '';
    $scope.rmp ? payload.services.push( 'RMP') : '';
    $scope.nurse ? payload.services.push('NURSE') : '';
    $scope.physio ? payload.services.push('PHYSIO') : '';
    $scope.food ? payload.services.push( 'FOOD' ) : '';
    payload.city = $scope.city;
    payload.area = $scope.area;
    payload.pincode = $scope.pincode;
    payload.userType = 'sp';

    console.log(payload);

    $scope.lPromise = userService.signup(payload);

    $scope.lPromise.then(function(u) {
        //success callback
        console.log('After signup ' + JSON.stringify(u));
        $location.path('/provider-area');
      }, function(r) {
          //error callback
        console.log('Signup failed ' + JSON.stringify(r));
        alert('Unable to Signup :' + r.msg);
        $scope.errMsg = r.msg;
        //on failure reset the captcha widget as it can't be re-used

      }, function(s) {
        $scope.lMessage = s;
      }).finally(function() {
        //google recaptcha causes input element
        //in IE not to display any updated text.
        //setting focus() seems to fix this issue

      });

  }

  $scope.saveUser = function () {

    console.log($scope.name  + '&&' + $scope.email  + ' &&' + $scope.mobile  + '&&' +  $scope.passwd);
    var regex = /^1?([2-9]\d\d){2}\d{4}$/,
    regexReplace = /\D/g,
    EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if(!($scope.name && $scope.email && $scope.mobile && $scope.passwd)) {
      alert('Please enter details');
      return;
    }

    var email = $scope.email;
    if((email.length === 0) || !EMAIL_REGEXP.test(email)) {
      alert('Please enter a valid email');
      return;
    }
    var mobile = $scope.mobile;
    mobile = mobile.replace(regexReplace, '');
    if((mobile.length !== 10) || !regex.test(mobile)) {
      alert('Please enter a valid 10 digit mobile');
      return;
    }

    var payload = {};
    payload.email = email;
    payload.mobile = mobile;
    payload.username = $scope.name;
    payload.passwd = $scope.passwd;
    payload.userType = 'user';


    console.log(payload);

    $scope.lPromise = userService.signup(payload);

    $scope.lPromise.then(function(u) {
        //success callback
        console.log('After signup ' + JSON.stringify(u));

        $location.path('/user-area');
      }, function(r) {
          //error callback
        console.log('Signup failed ' + JSON.stringify(r));
        alert('Unable to Signup :' + r.msg);
        $scope.errMsg = r.msg;
        //on failure reset the captcha widget as it can't be re-used

      }, function(s) {
        $scope.lMessage = s;
      }).finally(function() {
        //google recaptcha causes input element
        //in IE not to display any updated text.
        //setting focus() seems to fix this issue

      });

  }

}]);


myFirstApp.controller('loginController', ['$scope', '$location', '$route', '$window','userService',
  function($scope, $location, $route, $window, userService){

  $scope.logon = function () {

    var regex = /^1?([2-9]\d\d){2}\d{4}$/,
    regexReplace = /\D/g,
    EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if(!($scope.login && $scope.passwd)) {
      alert('Please enter details');
      return;
    }

    var login = $scope.login;
    if((login.length === 0) || !(EMAIL_REGEXP.test(login) || regex.test(login))) {
      alert('Please enter a valid email or 10 digit mobile');
      return;
    }


    $scope.lPromise = userService.login(login, $scope.passwd);

    $scope.lPromise.then(function(u) {
        //success callback
        console.log('After login ' + JSON.stringify(u));

        if(u.userType === 'user') {
          $location.path('/user-area');
        } else if(u.userType === 'sp') {
          $location.path('/provider-area');
        }


        //$location.path('/user-area');
      }, function(r) {
          //error callback
        console.log('Login failed ' + JSON.stringify(r));
        alert('Login Failed : ' + r.msg);
        //$scope.errMsg = r.msg;
        //on failure reset the captcha widget as it can't be re-used

      }, function(s) {
        $scope.lMessage = s;
      }).finally(function() {
        //google recaptcha causes input element
        //in IE not to display any updated text.
        //setting focus() seems to fix this issue

      });
  }

}]);


myFirstApp.controller('providerController', function($scope, $route, $window){

  $scope.proceed = function () {
    $window.open('http://labwise.in', '_blank');

  }

});


myFirstApp.controller('userController', ['$scope', '$route', '$window', 'userService', function($scope, $route, $window, userService){


  $scope.service_list = [
    {id:1, name:'LAB', },
    {id:2, name:'NURSE'},
    {id:3, name:'PHYSIO'},
    {id:4, name:'Hi-FOOD'}

  ];
  $scope.service_name = $scope.service_list[2];

  $scope.isLoggedIn = false;
  $scope.quickBook = false;
  $scope.labServiceSelected = false;
  var user = userService.getUser();
  $scope.isLoggedIn = user.isLoggedIn;


  $scope.quickBookForm = function() {
    $scope.quickBook = true;
    $scope.labServiceSelected = false;
    return;
  }

  $scope.proceed = function () {
    $window.open('http://labwise.in', '_blank');

  }

  $scope.serviceSelected = function (value) {
    console.log(value);
    if(value.name == "LAB") {
      $scope.labServiceSelected = true;
    } else {
      $scope.labServiceSelected = false;
    }

    return;
  }

  $scope.submitQuickBook = function() {
    alert('You booking has been received.')
    $scope.quickBook = false;

  }

}]);
