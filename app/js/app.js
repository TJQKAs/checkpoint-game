var checkpointApp = angular.module("CheckpointApp", ["firebase"]);

var ref = new Firebase("https://checkpoint-game.firebaseio.com/checkpoints");
ref.set({

   0 :
    {
    id: 0,
    name: "Checkpoint One",
    position: { latitude: 51.517399, longitude: -0.07346970000000001 }
    // position: { latitude: 51.5010, longitude: -0.1416 }
    }
});
