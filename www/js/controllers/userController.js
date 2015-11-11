checkpointApp.controller("UserCtrl", function(DatabaseDataFactory, UserAdminFactory, $scope, $state, $ionicPopup) {

  var ref = DatabaseDataFactory;

  $scope.authData = ref.getAuth();

  if ($scope.authData){
    var link = 'users/' + $scope.authData.uid + '/name';
    ref.child(link).once('value', function(snapshot) {
      $scope.username = snapshot.val();
    });
  }

  $scope.signupPopUp = function() {
    $ionicPopup.show({
      templateUrl: 'views/authenticate-signup.html',
      title: 'Give us ya deets!',
      subTitle: '...please',
      scope: $scope,
      buttons: [
        { text: 'Cancel' }
      ]
    });
  };

  $scope.loginPopUp = function() {
    $ionicPopup.show({
      templateUrl: 'views/authenticate-login.html',
      title: 'Give us ya deets!',
      subTitle: '...please',
      scope: $scope,
      buttons: [
        { text: 'Cancel' }
      ]
    });
  };

  $scope.createNewUser = function() {
    var userEmail = this.newEmail;
    var userPassword = this.newPassword;
    var confirmPassword = this.confirmPassword;
    var username = this.username;
    UserAdminFactory.validate(username, userPassword, confirmPassword);
    UserAdminFactory.signUp(username, userEmail, userPassword);
  };

  $scope.userLogin = function() {
    var userEmail = this.email;
    var userPassword = this.password;
    UserAdminFactory.login(userEmail, userPassword);
  };

  $scope.userLogout = function() {
    ref.unauth();
    document.location.reload();
  };

});
