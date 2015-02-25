test( 'EPSG:41001  tests', function() {
	var latLng = { lat:55, lng:37 };
    var expect = { x :4118821, y: 7326838 };
    
    var real = L.CRS.EPSG41001.project(latLng);
    equal(expect.x, Math.round(real.x), "x==x" );
    equal(expect.y, Math.round(real.y), "y==y" );
    
    real = L.CRS.EPSG41001.unproject(expect);
    equal(latLng.lat, Math.round(real.lat), "lat==lat" );
    equal(latLng.lng, Math.round(real.lng), "lng==lng" );
});