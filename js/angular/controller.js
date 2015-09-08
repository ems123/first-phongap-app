labwiseApp.controller('mainController', ['$scope', '$route', '$window','$location', 'userService', function($scope, $route, $window, $location, userService ){


  $scope.showWhyWeb = false;

  var user = userService.getUser();

  $scope.isUserLoggedIn = false;

  if(user.isLoggedIn) {
    console.log("User is logged in..")
    $scope.isUserLoggedIn = true;
    if(user.userType === 'user') {
      $location.path('/user-area');
    } else if (user.userType === 'sp') {
      $location.path('/provider-area');
    }
  }

  $scope.openSite = function () {
    $window.open('http://labwise.in', '_blank');
  };

  $scope.whyWeb = function () {
    $scope.showWhyWeb = true;
  }

  $scope.gotitWeb = function () {
    $scope.showWhyWeb = false;

  }

  $scope.whyLogin = function () {
    $scope.showWhyLogin = true;
  }

  $scope.gotitLogin = function () {
    $scope.showWhyLogin = false;

  }

  $scope.whyRegister = function () {
    $scope.showWhyRegister = true;
  }

  $scope.gotitRegister = function () {
    $scope.showWhyRegister = false;

  }

}]);

labwiseApp.controller('registerController', ['$scope', '$location', '$route', '$window','userService',
  function($scope, $location, $route, $window, userService){

    var user = userService.getUser();
    if(user.isLoggedIn) {

      console.log("already logged in..");
      if(user.userType === 'user') {
        $location.path('/user-area');
      } else if(user.userType === 'sp') {
        $location.path('/provider-area');
      }
    }

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
    $scope.pharmacy ? payload.services.push( 'PHARMACY' ) : '';
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


labwiseApp.controller('loginController', ['$scope', '$location', '$route', '$window','userService',
  function($scope, $location, $route, $window, userService){

  var user = userService.getUser();
  if(user.isLoggedIn) {

    console.log("already logged in..");
    if(user.userType === 'user') {
      $location.path('/user-area');
    } else if(user.userType === 'sp') {
      $location.path('/provider-area');
    }
  }

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


labwiseApp.controller('providerController', function($scope, $route, $window){

  $scope.proceed = function () {
    $window.open('http://labwise.in', '_blank');

  }

});


labwiseApp.controller('userController', ['$scope', '$route', '$window', 'userService', function($scope, $route, $window, userService){


  $scope.service_list = [
    {id:1, name:'LAB'},
    {id:2, name:'PHARMACY'},
    {id:3, name:'RMP'},
    {id:4, name:'NURSE'},
    {id:5, name:'PHYSIO'},
    {id:6, name:'Hi-FOOD'}

  ];
  $scope.service_name = $scope.service_list[2];

  $scope.isLoggedIn = false;
  $scope.quickBook = false;
  $scope.getHiBits = false;
  $scope.labServiceSelected = false;
  $scope.pharmacyServiceSelected = false;
  $scope.isUpdateUserAddress = false;
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

  $scope.updateMyAddress = function () {

    $scope.isUpdateUserAddress = true;
    console.log('update address:' + $scope.isUpdateUserAddress );

    return;
  }

  $scope.updateAddress = function () {
    console.log($scope.address);
    console.log($scope.pincode);
    $scope.isUpdateUserAddress = false;
    return;

  }

  $scope.cancelUpdateAddress = function () {
    $scope.isUpdateUserAddress = false;
    return;

  }

  $scope.serviceSelected = function (value) {
    console.log(value);
    if(value.name == "LAB") {
      $scope.labServiceSelected = true;
      $scope.pharmacyServiceSelected = false;
    } else if (value.name == "PHARMACY") {
      $scope.labServiceSelected = false;
      $scope.pharmacyServiceSelected = true;

    } else {
      $scope.labServiceSelected = false;
      $scope.pharmacyServiceSelected = false;
    }

    return;
  }

  $scope.upload = function(el) {
    //console.log(el.files);
    $scope.prescription_file = el.files[0];
    /*
    r = new FileReader();
    r.onloadend = function(e){
      var data = e.target.result;
      console.log(data);
      //send you binary data via $http or $resource or do anything else with it
    }
    r.readAsText($scope.prescription_file);*/
  };

  $scope.submitQuickBook = function() {

    var orderInfo = [];
    if($scope.service_name.name == 'PHARMACY' ) {

      if($scope.prescription_text == undefined && $scope.prescription_file == undefined) {
        alert('Please upload presscription or enter medicine name.');
        return;
      }
      var pharamacy = {};
      pharamacy.prescription_text = $scope.prescription_text ? $scope.prescription_text:'';
      pharamacy.prescription_file = $scope.prescription_file ? $scope.prescription_file:'';
      orderInfo.push({"phamracy":pharamacy});

    } else if($scope.service_name.name == 'LAB' ) {
      if($scope.lab_test == undefined) {
        alert('Please enter test name.');
        return;
      }
      var lab = {};
      lab.lab_test = $scope.lab_test ? $scope.lab_test : '';
      orderInfo.push({"lab":lab});
    }


    //create the order

    var contactInfo = {};
    contactInfo.address = $scope.address ? $scope.address :user.address.address;
    contactInfo.pincode = $scope.pincode ? $scope.pincode : user.address.pincode;
    contactInfo.mobile =  $scope.mobile ? $scope.mobile : user.mobile;
    contactInfo.email = user.email;

    orderInfo.push({"contactInfo":contactInfo});
    console.log($scope.service_name.name + ' ' + user.oID + ' ' + orderInfo );

    $scope.lPromise  = userService.createOrder($scope.service_name.name, user.oID, orderInfo);
    $scope.lPromise.then(function(o) {
        //success callback
        //console.log('After createOrder ' + JSON.stringify(o));

        alert('You request has been submitted ');
        $scope.quickBook = false;

        //$location.path('/user-area');
      }, function(r) {
          //error callback
        console.log('createOrder failed ' + JSON.stringify(r));
        alert('createOrder Failed : ' + r.msg);
        //$scope.errMsg = r.msg;
        //on failure reset the captcha widget as it can't be re-used

      }, function(s) {
        $scope.lMessage = s;
      }).finally(function() {

      });


  }

  $scope.showHiBitsForm = function(){
    $scope.getHiBits = true;
    return;
  }

  $scope.getHiBitsForm = function () {

    return;
  }

}]);
