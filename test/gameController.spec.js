describe('GameController', function() {

  beforeEach(module('CheckpointApp'));

  var testCheckpoints = {
    id: 1,
    name: "Buckingham Palace",
    position: { lattitude: 51.5010, longitude: -0.1416 }
  }

  beforeEach(function(){
    var ref = new Firebase("https://test-checkpoint-game.firebaseio.com/checkpoints");
    ref.set({
      id: 1,
      name: "Buckingham Palace",
      position: { lattitude: 51.5010, longitude: -0.1416 }
    });
  });

  beforeEach(function(){
    var testDataFactory = new Firebase("https://test-checkpoint-game.firebaseio.com/");
    module({
      DatabaseDataFactory: testDataFactory
    });
  });

  var ctrl;

  beforeEach(inject(function($controller){
    ctrl = $controller('GameController');
  }));

  it('initializes with the saved checkpoints', function(){
    var data;
    ctrl.checkpoints.once('value', function(snapshot){
      data = snapshot.val();
    });
    expect(data.name).toEqual("Buckingham Palace");
  });

});