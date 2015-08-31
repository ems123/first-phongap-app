myFirstApp.controller('mainController', function($scope, $route){



});

myFirstApp.controller('registerController', function($scope, $route){
  $scope.chooseTrue = true;
  $scope.providerView = false;
  $scope.providerView2 = false;
  $scope.UserView = false;
  

  $scope.providerSelected = function () {

    $scope.providerView = true;
    $scope.chooseTrue = false;
  };




});


myFirstApp.controller('loginController', function($scope, $route){



});
