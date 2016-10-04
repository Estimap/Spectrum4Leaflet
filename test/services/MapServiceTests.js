(function() {
  var returnJsonData = null;
  var service = new L.SpectrumSpatial.Services.MapService('http://MappingService/');

  var callback = function(response, error) {
    returnJsonData = response;
  };


  QUnit.test('Services.MapService.listNamedLayers test', function(assert) {
    var done = assert.async();
    service.listNamedLayers(callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.listNamedLayersResponse.namedLayersList[0],
        '/Samples/NamedLayers/WorldFeatureLayer',
        'Server should return /Samples/NamedLayers/WorldFeatureLayer ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.MapService.describeNamedLayer test', function(assert) {
    var done = assert.async();
    service.describeNamedLayer('/Samples/NamedLayers/LayerWithTableRangeTheme', callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.layerDescription.name,
        '/Samples/NamedLayers/LayerWithTableRangeTheme',
        'Server should return Samples/NamedLayers/LayerWithTableRangeTheme ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.MapService.describeNamedLayers test', function(assert) {
    var done = assert.async();
    service.describeNamedLayers(['/Samples/one', '/Samples/two'], callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.layers.length,
        2,
        'Server should return 2 layer infos ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.MapService.listNamedMaps test', function(assert) {
    var done = assert.async();
    service.listNamedMaps(callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.Maps.length,
        3,
        'Server should return 3 maps ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.MapService.describeNamedMap test', function(assert) {
    var done = assert.async();
    service.describeNamedMap('/Samples/NamedMaps/WorldMap', callback, {}, 'en_US');

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.MapDescription.Name,
        '/Samples/NamedMaps/WorldMap',
        'Server should return /Samples/NamedMaps/WorldMap ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.MapService.describeNamedMaps test', function(assert) {
    var done = assert.async();
    service.describeNamedMaps(['/CountriesWithShapeTable', '/MapWithLayer', '/DoesNotExist'], callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.maps.length,
        2,
        'Server should return 2 maps infos ');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.MapService.getLegendForMap test', function(assert) {
    var done = assert.async();
    var legendOptions = {
      mapName: '/Samples/NamedMaps/MapWithLayer',
      width: 32,
      height: 32,
      imageType: 'gif',
      inlineSwatch: false
    };
    service.getLegendForMap(legendOptions, callback, {});

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.layerName,
        'World Capitals',
        'Server should return legend info ');
      done();
    }, servicetimeout);
  });
  
  QUnit.test('Services.MapService.getUrlSwatchForLayer tests', function(assert) {
    var swatchOptions = {
      mapName: '/Samples/NamedMaps/WorldMap',
      width: 32,
      height: 32,
      imageType: 'png',
      legendIndex: 0,
      rowIndex: 0,
      resolution: 96
    };
    assert.equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/legends/0/rows/0/swatch/32x32.png;r=96',
      service.getUrlSwatchForLayer(swatchOptions),
      'getUrlSwatchForLayer');
  });
  QUnit.test('Services.MapService.getUrlRenderMap tests', function(assert) {
    var renderOptions = {
      mapName: 'Samples/NamedMaps/WorldMap',
      imageType: 'png',
      width: 640,
      height: 480,
      cx: -2.5,
      cy: 38.5,
      zoom: '500 mi',
      srs: 'epsg:4326',
      resolution: 96,
      locale: 'en_US'
    };
    assert.equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;c=-2.5%2C38.5%2Cepsg%3A4326;z=500%20mi;r=96;l=en_US',
      service.getUrlRenderMap(renderOptions),
      'getUrlRenderMapByCenterZoom');

    renderOptions.zoom = null;
    renderOptions.scale = 10000000;

    assert.equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;c=-2.5%2C38.5%2Cepsg%3A4326;s=10000000;r=96;l=en_US',
      service.getUrlRenderMap(renderOptions),
      'getUrlRenderMapByCenterScale');

    renderOptions.scale = null;
    renderOptions.cx = null;
    renderOptions.cy = null;
    renderOptions.bounds = [-10, -10, 10, 10];
    renderOptions.resolution = 72;

    assert.equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;b=-10%2C-10%2C10%2C10%2Cepsg%3A4326;r=72;l=en_US',
      service.getUrlRenderMap(renderOptions),
      'getUrlRenderMapByCenterZoom');
  });
})();
