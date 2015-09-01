myFirstApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
      }).
      when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController'
      }).
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
      }).
      when('/provider-area', {
        templateUrl: 'views/provider-area.html',
        controller: 'providerController'
      }).
      when('/about', {
        templateUrl: 'views/about.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
