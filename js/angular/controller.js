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
    console.log('provider view 2' + $scope.providerView2);
    return;

  };

  $scope.savingUser = false;
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

    $scope.savingUser = true;

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

    $scope.savingUser = true;

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

    $scope.loggingIn = true;
    $scope.lPromise = userService.login(login, $scope.passwd);

    $scope.lPromise.then(function(u) {
        //success callback
        console.log('After login ' + JSON.stringify(u));
        $scope.loggingIn = true;

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

  $scope.sos =  [
	{
        "createdAt": "2015-09-10T10:23:58.062Z",
        "objectId": "K3gXkjUgyr",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T10:23:58.062Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T10:47:03.054Z",
        "objectId": "MZS72wL5wJ",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T10:47:03.054Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T10:35:03.104Z",
        "objectId": "QgHzk75xwi",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T10:35:03.104Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T11:25:48.183Z",
        "objectId": "TubOo8nGiH",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T11:25:48.183Z",
        "userId": "DW0yg4kHC1"
    },

	{
        "createdAt": "2015-09-10T10:50:04.670Z",
        "objectId": "ZtYzLvzorR",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T10:50:04.670Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T10:39:27.027Z",
        "objectId": "bk0GsxqcdS",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T10:39:27.027Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-08T08:22:44.740Z",
        "objectId": "bry7IuKyUH",
        "orderInfo": [
            {
                "address": "#123 Hyd"
            }
        ],
        "service": "LAB",
        "status": "New",
        "updatedAt": "2015-09-08T08:22:44.740Z",
        "userId": "jJfL2DOyC7",
        "orderInfo": [
            {
                "lab": {
                    "lab_test":"lipid_profile",
                    "date_time": '2015-09-10'
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
    },
	{
        "createdAt": "2015-09-10T11:27:07.656Z",
        "objectId": "c9z0krfl4R",
        "orderInfo": [
            {
                "pharmacy": {
                    "file_url": "http://files.parsetfss.com/184010d4-7ced-4fb3-a884-3db7b4505203/tfss-ec9d6c28-83ed-4b3a-bb55-36d7caff37cf-photo.png",
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T11:27:14.535Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-08T09:14:42.099Z",
        "objectId": "dzONIj0kVk",
        "orderInfo": [
            {
                "phamracy": {
                    "prescription_file": "",
                    "prescription_text": "tablet\nsyrup\ngel"
                }
            },
            {
                "contactInfo": {
                    "address": "lb nagar",
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-08T09:14:42.099Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T10:33:42.805Z",
        "objectId": "fmjSYaXiVr",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": ""
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T10:33:42.805Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T11:43:47.144Z",
        "objectId": "hotRWeVt32",
        "orderInfo": [
            {
                "hibits": {
                    "file_url": "http://files.parsetfss.com/184010d4-7ced-4fb3-a884-3db7b4505203/tfss-f04f1696-30b7-4cef-af77-b8046dd8459a-account_updater_services120313.pdf"
                }
            }
        ],
        "orderType": "hibits",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T11:43:53.291Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-08T09:06:11.456Z",
        "objectId": "iybLEe1k0q",
        "orderInfo": [
            {
                "prescription_file": "",
                "prescription_text": "table\nsyrup"
            },
            {
                "email": "marikanti@gmail.com",
                "mobile": "9959688806",
                "pincode": "50000"
            }
        ],
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-08T09:06:11.456Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-08T09:14:38.250Z",
        "objectId": "jE3swKcL3m",
        "orderInfo": [
            {
                "pharmacy": {
                    "file_url": "http://files.parsetfss.com/184010d4-7ced-4fb3-a884-3db7b4505203/tfss-bed0bfdf-c417-4854-a44f-39d41d7ccff4-image3A4616",
                    "prescription_text": "tablet\nsyrup\ngel"
                }
            },
            {
                "contactInfo": {
                    "address": "lb nagar",
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-08T09:14:38.250Z",
        "userId": "DW0yg4kHC1"
    },
	{
        "createdAt": "2015-09-10T09:44:25.380Z",
        "objectId": "jI3MntjcoM",
        "orderInfo": [
            {
                "pharmacy": {
                    "prescription_text": "crocin\ndecold"
                }
            },
            {
                "contactInfo": {
                    "email": "marikanti@gmail.com",
                    "mobile": "9959688806",
                    "pincode": "50000"
                }
            }
        ],
        "orderType": "service",
        "service": "PHARMACY",
        "status": "New",
        "updatedAt": "2015-09-10T09:44:25.380Z",
        "userId": "DW0yg4kHC1"
    }

];
  $scope.showOrderDetailsTrue = false;
  $scope.proceed = function () {
    $window.open('http://labwise.in', '_blank');
  }
  $scope.viewOrdes = false;
  $scope.showViewOrdersForm = function () {
    $scope.viewOrders = true;
  }
  $scope.showOrderDetails = function (soid) {
    console.log(soid);
    $scope.showOrderDetailsTrue = true;
    $scope.sso = $scope.sos[soid];
    return;
  }
  $scope.backToOrdersMenu = function () {
      $scope.showOrderDetailsTrue = false;
      return;
  }
  $scope.backToMainMenu = function () {
      $scope.viewOrders = false;
      $scope.showOrderDetailsTrue = false;
      return;
  }

  $scope.completeOrder = function () {
    $scope.orderCompleteConfirm = true;
    return;
  }

  $scope.completeOrderConfirm = function (soid) {
    alert("Order status has been updated");
    $scope.orderCompleteConfirm = false;
    return;
  }
  $scope.completeOrderCancel = function (soid) {
    $scope.orderCompleteConfirm = false;
    return;
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
    $scope.prescription_file = el.files[0];
    console.log($scope.prescription_file);
    var imageRegex = "image/(jpg|jpeg|png|bmp|gif)";
    //var regex = /^1?([2-9]\d\d){2}\d{4}$/,
    var fileTypeRegex = "application/(pdf)";
    var ImageFileSizeKB = 1024;

    if ($scope.prescription_file.type.length && !(new RegExp(imageRegex).test($scope.prescription_file.type)) && !(new RegExp(fileTypeRegex).test($scope.prescription_file.type))) {
       console.log('Invalid file type ' + $scope.prescription_file.type);
       alert("Invalid file type " + $scope.prescription_file.type +". Please upload a valid image file type (.jpg, .png, .bmp, .pdf)");

       return true;
     }

     var fileSize = Math.round(parseInt($scope.prescription_file.size));
     if(fileSize > (5120*1024)) {
       console.log('File size is above limit ' + $scope.prescription_file.size);
       alert("File size ids too large.Please upload 1 MB or less");
       return true;
     }



  };


  $scope.upload_bill = function(el) {


    $scope.bill_file = el.files[0];
    console.log($scope.bill_file);

    var imageRegex = "image/(jpg|jpeg|png|bmp|gif)";
    //var regex = /^1?([2-9]\d\d){2}\d{4}$/,
    var fileTypeRegex = "application/(pdf)";
    var ImageFileSizeKB = 1024;

    if (!(new RegExp(imageRegex).test($scope.bill_file.type)) && !(new RegExp(fileTypeRegex).test($scope.bill_file.type))) {
       console.log('Invalid file type ' + $scope.bill_file.type);
       alert("Invalid file type. Please upload a valid image file type (.jpg, .png, .bmp, .pdf)");

       return true;
     }

     var fileSize = Math.round(parseInt($scope.bill_file.size));
     if(fileSize > (5120*1024)) {
       console.log('File size is above limit ' + $scope.bill_file.size);
       alert("File size ids too large.Please upload 1 MB or less");
       return true;
     }

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
      orderInfo.push({"pharmacy":pharamacy});
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

    console.log($scope.service_name.name + ' ' + user.oID + ' ' + JSON.stringify(orderInfo) );
    $scope.lPromise  = userService.createOrder($scope.service_name.name, user.oID, orderInfo);
    $scope.lPromise.then(function(o) {

        console.log('After createOrder ' + JSON.stringify(o));
        if($scope.prescription_file) {

          $scope.lPromise = userService.uploadFile($scope.prescription_file);
          $scope.lPromise.then(function(url) {
              var serviceOrder = o.ServiceOrder;
              serviceOrder.orderInfo[0].pharmacy.file_url = url;
              console.log("updating order " + serviceOrder.objectId)
              $scope.lPromise = userService.updateOrder(serviceOrder.objectId, serviceOrder.orderInfo);
              $scope.lPromise.then(function(url) {
              }, function(r) {
                console.log('order update failed ' + JSON.stringify(r));
              },function(s) {
              }).finally(function() {
              });
              console.log('File url ' + JSON.stringify(url));
            }, function(r) {
              console.log('upload  failed ' + JSON.stringify(r));
              alert('upload Failed : ' + r.msg);
            }, function(s) {
              $scope.lMessage = s;
            }).finally(function() {
            });
        }
        alert('You request has been submitted ');
        $scope.quickBook = false;
      }, function(r) {

        console.log('createOrder failed ' + JSON.stringify(r));
        alert('createOrder Failed : ' + r.msg);
      }, function(s) {
        $scope.lMessage = s;
      }).finally(function() {
      });
  }

  $scope.showHiBitsForm = function(){
    $scope.getHiBits = true;
    return;
  }

  $scope.submitHiBitsForm = function () {

    var orderInfo = [];
    var hibits = {};
    hibits.amount = $scope.amount;
    orderInfo.push({"hibits":hibits});

    console.log($scope.service_name.name + ' ' + user.oID + ' ' + JSON.stringify(orderInfo) );
    $scope.lPromise  = userService.createOrder($scope.service_name.name, user.oID, orderInfo, 'hibits');
    $scope.lPromise.then(function(o) {
      if($scope.bill_file) {
          $scope.lPromise = userService.uploadFile($scope.bill_file);
          $scope.lPromise.then(function(url) {
              var serviceOrder = o.ServiceOrder;
              serviceOrder.orderInfo[0].hibits.file_url = url;
              console.log("updating order " + serviceOrder.objectId)
              $scope.lPromise = userService.updateOrder(serviceOrder.objectId, serviceOrder.orderInfo);
              $scope.lPromise.then(function(url) {

              }, function(r) {
              },function(s) {
              }).finally(function() {
              });

            }, function(r) {
              alert('upload Failed : ' + r.msg);
            }, function(s) {
              $scope.lMessage = s;
            }).finally(function() {
            });
        }
        alert('You request has been submitted ');
        $scope.getHiBits = false;
      }, function(r) {
        alert('createOrder Failed : ' + r.msg);
      }, function(s) {
        $scope.lMessage = s;
      }).finally(function() {
      });

    return;
  }

}]);
