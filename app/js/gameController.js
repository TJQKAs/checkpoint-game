checkpointApp.controller('GameController', function(DatabaseDataFactory){

  var self = this;
  var ref = DatabaseDataFactory;
  self.authData = ref.getAuth();
  var userLink = 'users/' + self.authData.uid

  // if (self.authData) {
  //   var userId = self.authData.uid


    self.startGame = function() {
      console.log(self.checkpoints)
      console.log(self.nextCheckpoint)
      ref.child(userLink).update({checkpoints: self.checkpoints});

    };

    ref.on('value', function(dataSnapshot){

      ref.child('checkpoints').once('value', function(snapshot) {
        self.checkpoints = snapshot.val();
      })

      for (var key in self.checkpoints) {
        var val = self.checkpoints[key];
        if (val.located === false) {
          self.nextCheckpoint = val
          break
        }
      }

    });

});
