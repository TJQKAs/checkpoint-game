checkpointApp.controller('GameController', function(DatabaseDataFactory){

  var self = this;
  var ref = DatabaseDataFactory;
  self.authData = ref.getAuth();


  // if (self.authData) {
  //   var userId = self.authData.uid

  if (self.authData) {

    var userLink = 'users/' + self.authData.uid

    self.startGame = function() {
      console.log(self.checkpoints)
      console.log(self.nextCheckpoint)
      ref.child(userLink).update({checkpoints: self.checkpoints});
    };

    ref.on('value', function(dataSnapshot){

      ref.child('games/game1/checkpoints').once('value', function(snapshot) {
        self.checkpoints = snapshot.val();
      })

      ref.child(userLink).child('checkpoints').once('value', function(snapshot) {
        self.userCheckpoints = snapshot.val();
      })

      self.nextUserCheckpoint = null;

      for (var key in self.userCheckpoints) {
        var val = self.userCheckpoints[key];
        if (val.located === false) {
          self.nextUserCheckpoint = val;
          break
        }
      }

    });

  }

});
