describe('Checkpoint Game', function() {

  beforeEach(function(){
    browser.get('http://localhost:8080');
  });

  it('has a title', function() {
    expect(browser.getTitle()).toEqual('Checkpoint Game');
  });

  describe('when NOT at checkpoint location', function(){

    it('checkpoint is red and unable to check-in', function(){
      var checkpoint = element(by.css('.checkpoint'));
      var checkinButton = element(by.css('#check-in'));
      expect(checkpoint.getCssValue('color')).toEqual('red');
      checkinButton.click();
      expect(checkpoint.getText()).toEqual('Unable to check-in, too far from next checkpoint');
    });

  });

});