checkpointApp.controller("tabCtrl", [function(){
  var self = this;

  self.tab = 'map'

  this.selectTab = function(setTab){
    self.tab = setTab;
  };

  this.isSelected = function(checkTab){
    return self.tab === checkTab;
  };

}])
