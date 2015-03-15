/** 
* @class Spectrum Spatial Geometry Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.GeometryService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.GeometryService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.GeometryService.prototype */
{
	/**
    * Default options
    * @typedef {Object} L.SpectrumSpatial.Services.GeometryService.DefaultOptions
    * @property {string} [id] Id of request
    * @property {string} [locale] Locale
    * @property {string} [responseSrsName] Spatial reference system's code to express the response in
    */
	
	
	/**
    * Area options
    * @typedef {Object} L.SpectrumSpatial.Services.GeometryService.AreaOptions
    * @property {string} [id] Id of request
    * @property {string} [locale] Locale
    * @property {string} [responseSrsName] Spatial reference system's code to express the response in
    * @property {number} [computationType] Resolution of returns geometry buffer (curves count)
    */
	
	
    /**
    * Returns the area of the supplied geometry using the supplied computation type and area unit. The area of a polygon is the area defined by its exterior ring minus the areas defined by its interior rings. The areas of points and lines are zero.
    * @param {string} geometry String xml representation of geometry
    * @param {string} areaUnit Buffer distance
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.AreaOptions} [options] Options
    */
    area: function(geometry, areaUnit, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:AreaRequest {id} {locale} {areaUnit} {computationType} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:AreaRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = this.applyParamToXml(message, options.computationType, 'computationType');
		message = this.applyParamToXml(message, areaUnit, 'areaUnit');
		message = message.replace('{geometry}', geometry);
		this.startSoap(message, callback, context);		
    },
	
    /**
    * Buffer options
    * @typedef {Object} L.SpectrumSpatial.Services.GeometryService.BufferOptions
    * @property {string} [id] Id of request
    * @property {string} [locale] Locale
    * @property {string} [responseSrsName] Spatial reference system's code to express the response in
    * @property {number} [resolution] Resolution of returns geometry buffer (curves count)
    * @property {string} [units] Units of distance's measure
    */
	
	
    /**
    * The request to search for all named resources in the repository that use the specified resource in the request. A list of all named resources that use the defined resource is returned in the response.
    * @param {string} geometry String xml representation of geometry
    * @param {number} distance Buffer distance
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.BufferOptions} [options] Options
    */
    buffer: function(geometry, distance, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:BufferRequest {id} {locale} {resolution} {responseSrsName} >' +
					          '<v1:Distance {uom} >{distance}</v1:Distance>'+
					          '{geometry}' +
					          '</v1:BufferRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = this.applyParamToXml(message, options.resolution, 'resolution');
		message = this.applyParamToXml(message, options.units, 'uow');
		message = message.replace('{distance}', distance);
		message = message.replace('{geometry}', geometry);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Returns the convex hull of the supplied geometry. The convex hull is the smallest convex geometry which contains the supplied geometry. A geometry is convex if the line joining any 2 points of the geometry is also contained in the geometry.
    * @param {string} geometry String xml representation of geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    convexHull: function(geometry, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:ConvexHullRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:ConvexHullRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', geometry);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Converts the supplied geometry into a new geometry using the supplied coordinate system.
    * @param {string} geometry String xml representation of geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    coordSysTransform: function(geometry, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:CoordSysTransformRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:CoordSysTransformRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', geometry);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Converts the supplied geometries into new geometries using the supplied coordinate system.
    * @param {string} geometries String xml representation of transforming geometries
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    coordSysTransforms: function(geometries, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:CoordSysTransformsRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:CoordSysTransformsRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', geometries);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Returns the geometry portions of the first geometry that are not common with the second geometry. The resulting geometry is the residue of the first geometry after the second has been removed.    
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    difference: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:DifferenceRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:DifferenceRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', firstGeometry+secondGeometry);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Returns the envelope of the supplied geometry, which is the smallest axis-oriented rectangle that contains the geometry.
    * @param {string} geometry String xml representation of geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    envelope: function(geometry, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:EnvelopeRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:EnvelopeRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', geometry);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * This operation returns the coordinates of the centroid of a geometry object
    * @param {string} geometry String xml representation of geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    getCentroid: function(geometry, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:GetCentroidRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:GetCentroidRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', geometry);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Returns the geometry that is the intersection of the supplied geometries. 
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    intersection: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			          '<S:Header/>' + 
			          '<S:Body>' + 
				          '<v1:IntersectionRequest {id} {locale} {responseSrsName} >' +
					          '{geometry}' +
					          '</v1:IntersectionRequest></S:Body></S:Envelope>';	
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = message.replace('{geometry}', firstGeometry+secondGeometry);
		this.startSoap(message, callback, context);		
    },
});

L.SpectrumSpatial.Services.geometryService = function(url,options){
  return new L.SpectrumSpatial.Services.GeometryService(url,options);
};