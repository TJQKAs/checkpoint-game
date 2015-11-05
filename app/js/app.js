var checkpointApp = angular.module("CheckpointApp", ["firebase"]);

var ref = new Firebase("https://checkpoint-game.firebaseio.com/checkpoints");
ref.set({
  a: {
      id: 'a',
      name: "Checkpoint One",
      realName: "Makers Academy",
      position: { latitude: 51.517399, longitude: -0.07346970000000001 },
      located: false,
      color: '#0022FF'
      },
  b: {
      id: 'b',
      name: "Checkpoint Two",
      realName: "Aldgate East",
      position: { latitude: 51.5152, longitude: -0.0722 },
      located: false,
      color: '#0022FF'
    }
});
