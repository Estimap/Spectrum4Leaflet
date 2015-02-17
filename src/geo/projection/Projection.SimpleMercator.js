if (!this.proj4){
	this.proj4 = function(){
		console.log("Please add reference to proj4js");
	};
}


L.SpectrumSpatial.Projection.SimpleMercator =  {

	R: 6378137,
	
	epsg4326: proj4('EPSG:4326'),
	
	epsg41001:proj4('PROJCS["WGS84 / Simple Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS_1984", 6378137.0, 298.257223563]],PRIMEM["Greenwich", 0.0], UNIT["degree", 0.017453292519943295], AXIS["Longitude", EAST],  AXIS["Latitude", NORTH]], PROJECTION["Mercator_1SP"], PARAMETER["latitude_of_origin", 0.0],PARAMETER["central_meridian", 0.0],PARAMETER["scale_factor", 1.0],PARAMETER["false_easting", 0.0],PARAMETER["false_northing", 0.0], UNIT["m", 1.0],AXIS["x", EAST],AXIS["y", NORTH],AUTHORITY["EPSG","41001"]]'),

	project: function (latlng) {
		var p = proj4(L.SpectrumSpatial.Projection.SimpleMercator.epsg41001,[latlng.lng,latlng.lat]);

		return new L.Point(p[0],p[1]);
	},

	unproject: function (point) {
		var p = proj4(L.SpectrumSpatial.Projection.SimpleMercator.epsg41001,L.SpectrumSpatial.Projection.SimpleMercator.epsg4326,point);

		return new L.LatLng(p.y,p.x);
	},

	bounds: (function () {
		var d = 6378137 * Math.PI;
		return L.bounds([-d, -d], [d, d]);
	})()
};