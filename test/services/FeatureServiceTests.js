(function() {
  var returnJsonData = null;
  var service = new L.SpectrumSpatial.Services.FeatureService('http://FeatureService/');

  var callback = function(response, error) {
    returnJsonData = response;
  };


  QUnit.test('Services.FeatureService.tableList test', function(assert) {
    var done = assert.async();
    service.tableList(callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.Tables.length,
        2,
        'Test server has 2 tables ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.count test', function(assert) {
    var done = assert.async();
    service.count(callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.TablesTotalCount,
        2,
        'Test server has 2 tables ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.featureCount test', function(assert) {
    var done = assert.async();
    service.featureCount('/Samples/NamedTables/UK_REGNS', callback, {}, {l: 'en_US'});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.FeaturesTotalCount,
        11,
        'Table has 11 features ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.describe test', function(assert) {
    var done = assert.async();
    service.describe('/Samples/NamedTables/UK_REGNS', callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.Metadata[0].type,
        'Geometry',
        'return only geometry column');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.searchAtPoint test', function(assert) {
    var done = assert.async();
    service.searchAtPoint('/Samples/NamedTables/WorldcapTable/', {x: 1, y: 2}, 'EPSG:4326', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.type,
        'FeatureCollection',
        'return collection of features');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.searchNearest test', function(assert) {
    var done = assert.async();
    service.searchNearest('/Samples/NamedTables/WorldcapTable/', {"type": "Point"}, callback, {}, {withinDistance: '5000 mi'});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.type,
        'FeatureCollection',
        'return collection of features');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.searchId test', function(assert) {
    var done = assert.async();
    service.searchId('Samples/NamedTables/​WorldTable/', '43', callback, {}, null, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.type,
        'FeatureCollection',
        'return collection of features');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.searchSQL test', function(assert) {
    var done = assert.async();
    service.searchSQL('SELECT * FROM "/Samples/NamedTables/WorldTable" WHERE Country=\'CANADA\'', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.type,
        'FeatureCollection',
        'return collection of features');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.insert test', function(assert) {
    var done = assert.async();
    service.insert('MyTable', {"type": "FeatureCollection", "features": [{"type": "Feature", "id": "1"}]}, callback, {}, 2);

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.features[0].id,
        '1',
        'return inserted 1 feature');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.update test', function(assert) {
    var done = assert.async();
    service.update('MyTable', {"type": "FeatureCollection", "features": [{"type": "Feature", "id": "1"}]}, callback, {}, 2);

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.features[0].id,
        '1',
        'return updated 1 feature');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.FeatureService.updateSQL test', function(assert) {
    var done = assert.async();
    service.updateSQL('update MyTable set MyColumn = \'foo\'', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.updated,
        2,
        'return updated 1 feature');
      done();
    }, servicetimeout);
  });

})();
