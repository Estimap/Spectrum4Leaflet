L.CRS.EPSG41001 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:41001',
	projection: L.SpectrumSpatial.Projection.SimpleMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * L.SpectrumSpatial.Projection.SimpleMercator.R);
		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});