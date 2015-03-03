/** 
* @class Spectrum Spatial Named Resource Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.NamedResourceService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.NamedResourceService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.NamedResourceService.prototype */
{
	
	/**
    * List options
    * @typedef {Object} L.SpectrumSpatial.Services.NamedResourceService.ListOptions
    * @property {string} [id] Id of request
    * @property {string} [locale] Locale
    * @property {string} [resourceType] Type of named resource
    * @property {string} [path] Path to list
    */
    
    /**
    * Lists all named resources
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.NamedResourceService.ListOptions} [options] Options
    */
    listNamedResources: function(callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:ListNamedResourceRequest {id} {locale} {resourceType}>' +
							      	'{v1:Path}'+
							      '</v1:ListNamedResourceRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, options.id, 'id');
		message = this._applyParam(message, options.locale, 'locale');
		message = this._applyParam(message, options.resourceType, 'resourceType');
		message = this._applyParam(message, options.path, 'v1:Path', true);
		
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Reads named resource from specified path
    * @param {string} path Path to named resource
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [id] Request's id
    * @param {string} [locale] Locale
    */
    readNamedResource: function(path, callback, context, id, locale){
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:ReadNamedResourceRequest {id} {locale}>' +
							      	'{v1:Path}'+
							      '</v1:ReadNamedResourceRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, id, 'id');
		message = this._applyParam(message, locale, 'locale');
		message = this._applyParam(message, path, 'v1:Path', true);
		this.startSoap(message, callback, context);		
    },
    
    _applyParam: function(message, param, name, isNode){
	    if (isNode){
		    if (param){
			    return message.replace('{'+name+'}', L.Util.template('<{name}>{value}</{name}>', { name:name, value:param }));
		    }
		    return message.replace('{'+name+'}', '');
	    }
	    
	    
	    if (param){
		    return message.replace('{'+name+'}', name + '="' + param + '"');
	    }
	    return message.replace('{'+name+'}', '');
    }
    
    
});