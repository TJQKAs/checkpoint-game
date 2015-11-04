checkpointApp.controller("UserController", function(DatabaseDataFactory) {

  var self = this;
  var ref = DatabaseDataFactory;

  self.authData = ref.getAuth();

  if (self.authData) {
    console.log("User " + self.authData.uid + " is logged in with " + self.authData.provider);
  } else {
    console.log("User is logged out");
  }

  self.userSignup = function() {
    ref.createUser({
      email    : self.newEmail,
      password : self.newPassword
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        self.email = self.newEmail;
        self.password = self.newPassword;
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
