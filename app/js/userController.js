checkpointApp.controller("UserController", function(DatabaseDataFactory) {

  var self = this;
  var ref = DatabaseDataFactory;

  self.authData = ref.getAuth();

  if (self.authData){
    var link = 'users/' + self.authData.uid + '/name'
    ref.child(link).once('value', function(snapshot) {
        self.username = snapshot.val();
        console.log(self.username)
      });
  }

  validateUserInput = function(){
    var password = self.newPassword;
    if (password.length < 8) {throw alert("Password must be over 8 characters in length")};
    if (password !== self.confirmPassword) {throw alert("Password does not match confirmation password")};
    for (var key in self.allPlayers) {
      var val = self.allPlayers[key];
      if (val.name === self.username) {
        throw alert("Username has already been taken");
      };
    };
  };

  self.userSignup = function() {
    validateUserInput();
    ref.createUser({
      email    : self.newEmail,
      password : self.newPassword
    }, function(error, userData) {
      if (error) {
        alert(error)
      } else {
        self.email = self.newEmail;
        self.password = self.newPassword;
        var link = 'users/' + userData.uid
        ref.child(link).set({name: self.username})
        self.userLogin();
      }
    });
  };


  self.userLogin = function() {
    ref.authWithPassword({
      email    : self.email,
      password : self.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        document.location.reload();
      }
    });
  };


  self.userLogout = function() {
    ref.unauth();
    document.location.reload();
  };



});
