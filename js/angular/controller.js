myFirstApp.controller('mainController', function($scope, $route, $window){

  $scope.openSite = function () {
    $window.open('https://labwise.in', '_blank');

  };

});

myFirstApp.controller('registerController', function($scope, $route){
  $scope.chooseTrue = true;
  $scope.providerView = false;
  $scope.providerView2 = false;
  $scope.userView = false;


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
    $scope.providerView = false;
    $scope.chooseTrue = false;
    $scope.providerView2 = true;


  };

  $scope.saveProvider = function () {
    alert('saving' + $scope.lab + $scope.pname + $scope.email)
  }




});


myFirstApp.controller('loginController', function($scope, $route){



});
