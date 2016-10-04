QUnit.test('EPSG:41001  tests', function(assert) {
  var latLng = {lat: 55, lng: 37};
  var expect = {x: 4118821, y: 7326838};

  var real = L.CRS.EPSG41001.project(latLng);
  assert.equal(expect.x, Math.round(real.x), "x==x");
  assert.equal(expect.y, Math.round(real.y), "y==y");

  real = L.CRS.EPSG41001.unproject(expect);
  assert.equal(latLng.lat, Math.round(real.lat), "lat==lat");
  assert.equal(latLng.lng, Math.round(real.lng), "lng==lng");
});
