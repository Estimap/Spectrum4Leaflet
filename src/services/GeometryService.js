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
    
    _createRequest:function(requestName, requestParams,additionalParams, callback,context,options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/geometry/v1" xmlns:v11="http://www.mapinfo.com/midev/service/geometries/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
				          '<S:Header/>' + 
				          '<S:Body>' + 
					          '<v1:{requestName} {id} {locale} {responseSrsName} {additionalParams} >' +
						          '{requestParams}' +
						      '</v1:{requestName}>' + 
						  '</S:Body>' + 
					  '</S:Envelope>';	
	    message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.responseSrsName, 'responseSrsName');
		message = L.Util.template(message, { requestName:requestName,requestParams:requestParams, additionalParams:additionalParams  });
	    this.startSoap(message, callback, context);	
    },
	
	
	/**
    * Measure options
    * @typedef {Object} L.SpectrumSpatial.Services.GeometryService.MeasureOptions
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
    * @param {L.SpectrumSpatial.Services.GeometryService.MeasureOptions} [options] Options
    */
    area: function(geometry, areaUnit, callback, context, options){
	    options = options || {};
	    var paramsmessage = "{areaUnit} {computationType}";
		paramsmessage = this.applyParamToXml(paramsmessage, options.computationType, 'computationType');
		paramsmessage = this.applyParamToXml(paramsmessage, areaUnit, 'areaUnit');
		this._createRequest('AreaRequest', geometry,paramsmessage, callback,context,options);	
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
	    var paramsmessage = '{resolution}';
	    var argumentsmessage = '<v1:Distance {uom} >{distance}</v1:Distance>{geometry}';
	   
	    paramsmessage = this.applyParamToXml(paramsmessage, options.resolution, 'resolution'); 
	    argumentsmessage = this.applyParamToXml(argumentsmessage, options.units, 'uom');
		argumentsmessage = argumentsmessage.replace('{distance}', distance).replace('{geometry}', geometry);
	    
	    this._createRequest('BufferRequest', argumentsmessage,paramsmessage, callback,context,options);	
    },
    
    /**
    * Returns a boolean value indicating whether the first supplied geometry contains the second supplied geometry. The result is true if every point of the second geometry exists in the first geometry (even if the second geometry is just part or all of the boundary of the first geometry).
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    contains: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    this._createRequest('ContainsRequest', firstGeometry+secondGeometry,'', callback,context,options);	
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
	    this._createRequest('ConvexHullRequest', geometry,'', callback,context,options);	
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
	    this._createRequest('CoordSysTransformRequest', geometry,'', callback,context,options);
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
	    this._createRequest('CoordSysTransformsRequest', geometries,'', callback,context,options);	
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
	    this._createRequest('DifferenceRequest', firstGeometry+secondGeometry,'', callback,context,options);	
    },
    
    /**
    * Returns the distance between the two supplied geometries using the supplied computation type and distance units. Specifically, the distance between two closest points of the two geometries is determined.
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {string} distanceUnit The distance units to use
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.MeasureOptions} [options] Options
    */
    distance: function(firstGeometry,secondGeometry, distanceUnit, callback, context, options){
	    options = options || {};
	    var paramsmessage = "{distanceUnit} {computationType}";
		paramsmessage = this.applyParamToXml(paramsmessage, options.computationType, 'computationType');
		paramsmessage = this.applyParamToXml(paramsmessage, distanceUnit, 'distanceUnit');
	    this._createRequest('DistanceRequest', firstGeometry+secondGeometry,paramsmessage, callback,context,options);	
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
	    this._createRequest('EnvelopeRequest', geometry,'', callback,context,options);		
    },
    
    /**
    * Returns a boolean value indicating whether the envelopes of the supplied geometries intersect. The result will be true if the envelopes share at least one point in common. This point can be on a boundary.
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    envelopesIntersect: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    this._createRequest('EnvelopesIntersectRequest', firstGeometry+secondGeometry,'', callback,context,options);	
    },
    
    /**
    * Returns an equivalent srsName for the given codeSpace.
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    equivalentSrsName: function(srsName,codeSpace, callback, context, options){
	    options = options || {};
	    var paramsmessage = "{srsName} {codeSpace}";
		paramsmessage = this.applyParamToXml(paramsmessage, srsName, 'srsName');
		paramsmessage = this.applyParamToXml(paramsmessage, codeSpace, 'codeSpace');
	    this._createRequest('EquivalentSrsNameRequest', '',paramsmessage, callback,context,options);	
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
	    this._createRequest('GetCentroidRequest', geometry,'', callback,context,options);	
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
	    this._createRequest('IntersectionRequest', firstGeometry+secondGeometry,'', callback,context,options);	
    },
    
    /**
    * Returns a boolean value indicating whether the supplied geometries intersect. The result will be true if the geometries share at least one point in common. This point can be on a boundary.
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    intersects: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    this._createRequest('IntersectsRequest', firstGeometry+secondGeometry,'', callback,context,options);	
    },
    
    /**
    * Returns a boolean value indicating whether the supplied geometry is valid according to the geometry type
    * @param {string} geometry String xml representation of geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    isGeometryValid: function(geometry, callback, context, options){
	    options = options || {};
	    this._createRequest('IsGeometryValidRequest', geometry,'', callback,context,options);	
    },
    
    /**
    * Returns a boolean value indicating whether the supplied coordinate system is supported by the service.
    * @param {string} srsName Spatial reference code
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    isSupportedCoordSys: function(srsName, callback, context, options){
	    options = options || {};
	    var paramsmessage = '{srsName}';
	    paramsmessage  = this.applyParamToXml(paramsmessage, srsName, 'srsName'); 
	    this._createRequest('IsSupportedCoordSysRequest', '',paramsmessage, callback,context,options);	
    },
    
    /**
    * Returns the length of the supplied geometry using the supplied computation type and length unit. The lengths of points are zero.
    * @param {string} geometry String xml representation of geometry
    * @param {string} lengthUnit Length units
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.MeasureOptions} [options] Options
    */
    length: function(geometry, lengthUnit, callback, context, options){
	    options = options || {};
	    var paramsmessage = "{lengthUnit} {computationType}";
		paramsmessage = this.applyParamToXml(paramsmessage, options.computationType, 'computationType');
		paramsmessage = this.applyParamToXml(paramsmessage, lengthUnit, 'lengthUnit');
	    this._createRequest('LengthRequest', geometry,paramsmessage, callback,context,options);	
    },
    
    /**
    * Returns a listing of all available code spaces for all supported coordinate systems.
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    listCodeSpacesRequest: function(callback, context, options){
	    options = options || {};
	    this._createRequest('ListCodeSpacesRequest', '','', callback,context,options);	
    },
    
    /**
    * Returns a listing of all available coordinate systems in the supplied code space.
    * @param {string} geometry String xml representation of geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    listCoordSysByCodeSpace: function(codeSpace, callback, context, options){
	    options = options || {};
	    var paramsmessage = "{codeSpace}";
		paramsmessage = this.applyParamToXml(paramsmessage, codeSpace, 'codeSpace');
	    this._createRequest('ListCoordSysByCodeSpaceRequest', '',paramsmessage, callback,context,options);	
    },
    
    /**
    * Returns the perimeter of the supplied geometry, using the supplied computation type and length unit. The perimeters of points and lines are zero.
    * @param {string} geometry String xml representation of geometry
    * @param {string} lengthUnit Length units
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.MeasureOptions} [options] Options
    */
    perimeter: function(geometry, lengthUnit, callback, context, options){
	    options = options || {};
	    var paramsmessage = "{lengthUnit} {computationType}";
		paramsmessage = this.applyParamToXml(paramsmessage, options.computationType, 'computationType');
		paramsmessage = this.applyParamToXml(paramsmessage, lengthUnit, 'lengthUnit');
	    this._createRequest('PerimeterRequest', geometry,paramsmessage, callback,context,options);	
    },
    
    /**
    * Returns the symmetrical difference of the two supplied geometries. The symmetric difference is that part of both geometries that do not intersect.
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    symDifference: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    this._createRequest('SymDifferenceRequest', firstGeometry+secondGeometry,'', callback,context,options);	
    },
    
    /**
    * Returns a geometry that is the amalgamation (i.e. the merging together or joining) of the supplied geometries.
    * @param {string} geometries String xml representation of unioned geometries
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    union: function(geometries, callback, context, options){
	    options = options || {};
	    this._createRequest('UnionRequest', geometries,'', callback,context,options);	
    },
    
    /**
    * Returns a boolean value indicating whether the first geometry is within the second geometry. The result is true if every point of the first geometry exists in the second geometry, and their interiors have at least 1 point in common. (e.g. The boundary of a polygon is not within the polygon.)
    * @param {string} firstGeometry String xml representation of first geometry
    * @param {string} secondGeometry String xml representation of second geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.GeometryService.DefaultOptions} [options] Options
    */
    within: function(firstGeometry,secondGeometry, callback, context, options){
	    options = options || {};
	    this._createRequest('WithinRequest', firstGeometry+secondGeometry,'', callback,context,options);	
    }

});

L.SpectrumSpatial.Services.geometryService = function(url,options){
  return new L.SpectrumSpatial.Services.GeometryService(url,options);
};