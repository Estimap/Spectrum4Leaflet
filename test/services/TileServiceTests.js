(function() {
  var returnJsonData = null;
  var service = new L.SpectrumSpatial.Services.TileService('http://TilingService/');

  var callback = function(response, error) {
    returnJsonData = response;
  };


  QUnit.test('Services.TileService.mapList test', function(assert) {
    var done = assert.async();
    service.mapList(callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.Response.length, 4, 'Server should return 4 tiled layers ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.TileService.description test', function(assert) {
    var done = assert.async();
    service.description('/Samples/NamedTiles/WorldTile/', callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.Response.mapName, 'World', 'Server should return World description');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.TileService.getTileUrl tests', function(assert) {
    assert.equal(service.getTileUrl('Samples/NamedTiles/WorldTile/', 2, 1, 1, 'png'),
      'http://TilingService/Samples/NamedTiles/WorldTile/2/1:1/tile.png',
      'getTileUrl');

  });
})();
