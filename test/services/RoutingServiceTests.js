(function() {
  var returnJsonData = null;
  var service = new L.SpectrumSpatial.Services.RoutingService('http://RoutingService/', {dbsource: 'usroutedatabase'});

  var callback = function(response, error) {
    returnJsonData = response;
  };


  QUnit.test('Services.RoutingService.GetRoute test', function(assert) {
    var done = assert.async();
    service.getRoute(
      {x: -73.97, y: 40.79},
      {x: -73.98, y: 40.74},
      'epsg:4326',
      callback, {}
    );

    assert.expect(1);

    setTimeout(function() {
      assert.equal(returnJsonData.time,
        7.67,
        'Time is 7.67');
      done();
    }, servicetimeout);
  });

  QUnit.test('Services.RoutingService.GetTravelBoundary test', function(assert) {
    var done = assert.async();
    service.getTravelBoundary(
      {x: -77.092609, y: 38.871256},
      'epsg:4326',
      '5',
      callback, {},
      {costUnit: 'm'}
    );

    assert.expect(1);


    setTimeout(function() {
      assert.equal(returnJsonData.travelBoundary.costs[0].cost,
        5,
        'Cost is 5');
      done();
    }, servicetimeout);
  });
})();
