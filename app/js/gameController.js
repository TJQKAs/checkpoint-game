checkpointApp.controller('GameController', function(DatabaseDataFactory){

  var self = this;
  var ref = DatabaseDataFactory;

  self.checkpoints = ref.child('checkpoints')

});