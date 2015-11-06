var checkpointApp = angular.module("CheckpointApp", ["firebase"]);

var ref = new Firebase("https://checkpoint-game.firebaseio.com/games/game1/checkpoints");
ref.set({
  a: {
      id: 'a',
      name: "Checkpoint One",
      realName: "Makers Academy One",
      position: { latitude: 51.517399, longitude: -0.07346970000000001 },
      located: false,
      color: '#FFFFFF',
      mapPositionTop: 21,
      mapPositionLeft: 17,
      clue: "Dummy clue 1"
      },
  b: {
      id: 'b',
      name: "Checkpoint Two",
      realName: "Aldgate East Tube Station",
      position: { latitude: 51.5152, longitude: -0.0722 },
      located: false,
      color: '#FFFFFF',
      mapPositionTop: 70,
      mapPositionLeft: 33,
      clue: "Dummy clue 2"
      },
   c: {
      id: 'c',
      name: "Checkpoint Three",
      realName: "The Culpepepeper",
      position: { latitude: 51.516908, longitude: -0.073123 },
      located: false,
      color: '#FFFFFF',
      mapPositionTop: 50,
      mapPositionLeft: 45,
      clue: "Dummy clue 3"

      },
    d: {
      id: 'd',
      name: "Checkpoint Four",
      realName: "The Pride of Spitalfields",
      position: { latitude: 51.518854, longitude: -0.071221 },
      located: false,
      color: '#FFFFFF',
      mapPositionTop: 12,
      mapPositionLeft: 65,
      clue: "Dummy clue 4"
      },
    e: {
      id: 'e',
      name: "Checkpoint Five",
      realName: "The Ten Bells",
      position: { latitude: 51.519323, longitude: -0.074320 },
      located: false,
      color: '#FFFFFF',
      mapPositionTop: 85,
      mapPositionLeft: 80,
      clue: "Dummy clue 5"
      }
  });
