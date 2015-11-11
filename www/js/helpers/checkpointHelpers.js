var isAllLocated = function(checkpoints) {
  var array =[]
  angular.forEach(checkpoints, function(value, key){
    this.push(value.located);
  }, array)
  return (array.every(function(el){ return el }) && array.length > 0)
};

var findNext = function(checkpoints) {
  var array = [];
  angular.forEach(checkpoints, function(value, key){
    if (!value.located) { this.push(value) };
  }, array);
  return array.shift();
};

var updatePlayerCheckpoints = function(playerData, currentGame) {
  angular.forEach(playerData, function(value, key){
    key['currentCheckpoints'] = value.game.currentGame.checkpoints;
  });
};
