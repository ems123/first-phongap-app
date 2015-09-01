myFirstApp.controller('mainController', function($scope, $route, $window){

  $scope.openSite = function () {
    $window.open('https://labwise.in', '_blank');

  };

});

myFirstApp.controller('registerController', function($scope, $route, $window){

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


    if(!($scope.pname && $scope.email && $scope.mobile && $scope.passwd)) {
      alert('Please enter valid details');
      return;
    }
    var payload = {};
    payload.email = email;
    payload.mobile = mobile;
    payload.name = $scope.pname;
    payload.passwd = $scope.passwd;
    payload.services = [];
    $scope.lab ? payload.services.push('LAB') : '';
    $scope.rmp ? payload.services.push( 'RMP') : '';
    $scope.nurse ? payload.services.push('NURSE') : '';
    $scope.physio ? payload.services.push('PHYSIO') : '';
    $scope.food ? payload.services.push( 'FOOD' ) : '';

    console.log(payload);

  }

  $scope.saveUser = function () {
    alert('user saved');

  }




});


myFirstApp.controller('loginController', function($scope, $route){

  $scope.logon = function () {
    alert('logged ub !!');

  }





});
