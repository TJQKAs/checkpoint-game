checkpointApp.controller('GameController', function(DatabaseDataFactory){

  var self = this;
  var ref = DatabaseDataFactory;

  ref.on('value', function(dataSnapshot){

    ref.child('checkpoints').once('value', function(snapshot) {
      self.checkpoints = snapshot.val();
    });

    self.nextCheckpoint = self.checkpoints.find(function(element){
      return !element.located;
    })

  });

});
