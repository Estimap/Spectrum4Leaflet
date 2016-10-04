(function() {
  var returnJsonData = null;
  var service = new L.SpectrumSpatial.Services.Service('http://requesttest/');

  var callback = function(response, error) {
    returnJsonData = response;
  };


  QUnit.test('Services.Service.startRequest get test', function(assert) {
    var done = assert.async();
    var operation = new L.SpectrumSpatial.Services.Operation('');
    service.startRequest(operation, callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.test, 'success', 'Server should return {\'test\': \'success\'}');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.Service.startRequest post test', function(assert) {
    var done = assert.async();
    var operation = new L.SpectrumSpatial.Services.Operation('', {postParams: {test: 'success'}});
    service.startRequest(operation, callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.test, 'success', 'Server should return {\'test\': \'success\'}');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.Service.applyParamToXml test', function(assert) {
    var message = '<elem {id} ></elem>';
    var id = undefined;
    assert.equal(service.applyParamToXml(message, id, 'id'), '<elem  ></elem>', 'id is undefined');
    id = 'id1';
    assert.equal(service.applyParamToXml(message, id, 'id'), '<elem id="id1" ></elem>', 'id is id1');

    message = '<elem>{inner}</elem>';
    var inner = undefined;
    assert.equal(service.applyParamToXml(message, inner, 'inner', true), '<elem></elem>', 'inner is undefined');
    inner = "data";
    assert.equal(service.applyParamToXml(message, inner, 'inner', true), '<elem><inner>data</inner></elem>', 'inner has data');
  });

  QUnit.test('Services.Service.clearParam test', function(assert) {
    assert.equal(service.clearParam('/Sample/One/Two'), 'Sample/One/Two', '/***');
    assert.equal(service.clearParam('/Sample/One/Two/'), 'Sample/One/Two', '/***/');
    assert.equal(service.clearParam('Sample/One/Two/'), 'Sample/One/Two', '***/');
  });
})();
