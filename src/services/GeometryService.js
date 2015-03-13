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
    }
});

L.SpectrumSpatial.Services.geometryService = function(url,options){
  return new L.SpectrumSpatial.Services.GeometryService(url,options);
};