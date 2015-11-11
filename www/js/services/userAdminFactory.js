checkpointApp.factory('UserAdminFactory', function() {

  var ref = new Firebase("https://checkpoint-game.firebaseio.com/");

  var validateUserInput = function(username, password, confirmPassword) {
    if (password.length < 8) {throw alert("Password must be over 8 characters in length")};
    if (password !== confirmPassword) {throw alert("Password does not match confirmation password")};
    ref.child('users').once('value', function(snapshot) {
      snapshot.forEach(function(user) {
        if (user.val().name === username) {throw alert("Username has already been taken")};
      });
    });
  };

  var loginUser = function(userEmail, userPassword) {
    ref.authWithPassword({
      email    : userEmail,
      password : userPassword
    }, function(error, authData) {
      if (error) {
        alert(error);
      } else {
        document.location.reload();
      }
    });
  };

  var createUser = function(username, userEmail, userPassword) {
    ref.createUser({
      email: userEmail,
      password: userPassword
    }, function(error, userData) {
      if (error) {
        alert(error);
      } else {
        var userlink = 'users/' + userData.uid;
        ref.child(userlink).set({name: username});
        loginUser(userEmail, userPassword);
      }
    });
  };

  return {
    validate: validateUserInput,
    signUp: createUser,
    login: loginUser
  };

});