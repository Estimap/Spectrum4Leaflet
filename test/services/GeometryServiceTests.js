(function() {
  var returnXmlData = null;
  var service = new L.SpectrumSpatial.Services.GeometryService('http://GeometryService/');
  var envelope = {
    min: {x: -79.3456, y: 45.987},
    max: {x: -78.3456, y: 46.987}
  };
  var geometryXmlText = L.SpectrumSpatial.Utils.Xml.fromGeometry(envelope, 'Envelope', 'epsg:4326', 'v1', 'v11')

  var callback = function(response, error) {
    returnXmlData = response;
  };


  QUnit.test('Services.GeometryService.buffer test', function(assert) {
    var done = assert.async();
    service.buffer(geometryXmlText, 10, callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'BufferResponse',
        'Server should return BufferResponse');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.GeometryService.area test', function(assert) {
    var done = assert.async();
    service.area(geometryXmlText, 'meters', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'AreaResponse',
        'Server should return AreaResponse');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.GeometryService.area test', function(assert) {
    var done = assert.async();
    service.area(geometryXmlText, 'meters', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'AreaResponse',
        'Server should return AreaResponse');
      done();
    }, servicetimeout);
  });

})();

