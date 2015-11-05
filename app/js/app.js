var checkpointApp = angular.module("CheckpointApp", ["firebase"]);

var ref = new Firebase("https://checkpoint-game.firebaseio.com/checkpoints");
ref.set({
  0: {
      id: 0,
      name: "Checkpoint One",
      realName: "Makers Academy",
      position: { latitude: 51.517399, longitude: -0.07346970000000001 },
      located: false,
      color: '#FF0000',
      mapPositionTop: 21,
      mapPositionLeft: 17
      },
  1: {
      id: 1,
      name: "Checkpoint Two",
      realName: "Aldgate East",
      position: { latitude: 51.5152, longitude: -0.0722 },
      located: false,
      color: '#FF0000',
      mapPositionTop: 70,
      mapPositionLeft: 33
    }
});
