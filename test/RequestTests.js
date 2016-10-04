(function() {
  var returnJsonData = null;

  var callback = function(response, error) {
    returnJsonData = response;
  };

  QUnit.test('Request.get function', function(assert) {
    var done = assert.async();
    L.SpectrumSpatial.Request.get('http://requesttest/', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.test, 'success', 'Server should return {\'test\': \'success\'}');
      done();
    }, servicetimeout);
  });

  QUnit.test('Request.get with login and password function', function(assert) {
    var done = assert.async();
    L.SpectrumSpatial.Request.get('http://requesttestwithlogin/', callback, {}, {login: 'admin', password: 'admin'});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.test, 'success', 'Server should return {\'test\': \'success\'}');
      done();
    }, servicetimeout);
  });

  QUnit.test('Request.jsonp function', function(assert) {
    var done = assert.async();
    L.SpectrumSpatial.Request.jsonp('requestjsonp.js', callback, {}, '?');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.test, 'success', 'Server should return {\'test\': \'success\'}');
      done();
    }, servicetimeout);
  });

  QUnit.test('Request.post function', function(assert) {
    var done = assert.async();
    var postData = {test: 'success'};
    L.SpectrumSpatial.Request.post('http://requesttest/', callback, {}, {postData: JSON.stringify(postData), postType: 'application/json'});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.test, 'success', 'Server should return returns  {\'test\': \'success\'}');
      done();
    }, servicetimeout);
  });
})();
