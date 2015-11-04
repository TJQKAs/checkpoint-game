checkpointApp.controller('GameController', function(DatabaseDataFactory){

  var self = this;
  var ref = DatabaseDataFactory;
  // var sync = $firebaseObject(ref);

  ref.child('checkpoints').once('value', function(snapshot) {
    self.checkpoints = snapshot.val();
  });

  self.nextCheckpoint = self.checkpoints[0]

});
