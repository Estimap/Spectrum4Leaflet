/*
*   @description Projection EPSG:41001
*   @name L.CRS.EPSG41001  
*   @memberof L.CRS
*   @static
*/
L.CRS.EPSG41001 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:41001',
	projection: L.SpectrumSpatial.Projections.Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * L.SpectrumSpatial.Projections.Mercator.R);
		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});