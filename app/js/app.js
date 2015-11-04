var checkpointApp = angular.module("CheckpointApp", ["firebase"]);

var ref = new Firebase("https://checkpoint-game.firebaseio.com/checkpoints");
ref.set({

   0 :
    {
    name: "Checkpoint One",
    position: { lattitude: 51.5010, longitude: -0.1416 }
    }
});
