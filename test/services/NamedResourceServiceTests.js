(function() {
  var returnXmlData = null;
  var service = new L.SpectrumSpatial.Services.NamedResourceService('http://NamedResourceService/');

  var callback = function(response, error) {
    returnXmlData = response;
  };


  QUnit.test('Services.NamedResourceService.listNamedResources test', function(assert) {
    var done = assert.async();
    service.listNamedResources(callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'list',
        'Server should return <list></list>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.readNamedResource test', function(assert) {
    var done = assert.async();
    service.readNamedResource('/Samples/NamedMaps/MapWithLayer', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Resource',
        'Server should return <Resource></Resource>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.deleteNamedResource test', function(assert) {
    var done = assert.async();
    service.deleteNamedResource('/Samples/NamedMaps/MapWithLayer', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Status',
        'Server should return <Status></Status>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.addNamedResource test', function(assert) {
    var done = assert.async();
    service.addNamedResource('<Resource></Resource>', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Status',
        'Server should return <Status></Status>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.updateNamedResource test', function(assert) {
    var done = assert.async();
    service.updateNamedResource('<Resource></Resource>', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Status',
        'Server should return <Status></Status>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.searchNamedResource test', function(assert) {
    var done = assert.async();
    service.searchNamedResource('/Samples', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Resource',
        'Server should return <Resource></Resource>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.searchReferences test', function(assert) {
    var done = assert.async();
    service.searchReferences('/Samples/NamedMaps/MapWithLayer', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Resource',
        'Server should return <Resource></Resource>');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.NamedResourceService.searchReferencedIn test', function(assert) {
    var done = assert.async();
    service.searchReferencedIn('/Samples/NamedMaps/MapWithLayer', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnXmlData.documentElement.nodeName,
        'Resource',
        'Server should return <Resource></Resource>');
      done();
    }, servicetimeout);
  });
})();
