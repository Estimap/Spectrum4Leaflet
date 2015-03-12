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
    
    /**
    * The request to delete a named resource from the repository. You can only delete individual resource with this operation. You cannot delete entire nodes (folders) in the repository.
    * @param {string} path Path to named resource
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [id] Request's id
    * @param {string} [locale] Locale
    */
    deleteNamedResource: function(path, callback, context, id, locale){
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:DeleteNamedResourceRequest {id} {locale}>' +
							      	'{v1:Path}'+
							      '</v1:DeleteNamedResourceRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, id, 'id');
		message = this._applyParam(message, locale, 'locale');
		message = this._applyParam(message, path, 'v1:Path', true);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * The request to import a new named resource into the repository.
    * @param {string} resourceXmlText String representation of resource xml node
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [id] Request's id
    * @param {string} [locale] Locale
    */
    addNamedResource: function(resourceXmlText, callback, context, id, locale){
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:AddNamedResourceRequest {id} {locale}>' +
							      	'{v1:Resource}'+
							      '</v1:AddNamedResourceRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, id, 'id');
		message = this._applyParam(message, locale, 'locale');
		message = this._applyParam(message, resourceXmlText, 'v1:Resource', true);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * The request to update an existing named resource in to the repository. This operation will replace the existing resource in the repository with the resource defined in the request. The resource type of the resource defined in the request, must match the resource type of the existing resource in the repository.
    * @param {string} resourceXmlText String representation of resource xml node
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [id] Request's id
    * @param {string} [locale] Locale
    */
    updateNamedResource: function(resourceXmlText, callback, context, id, locale){
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:UpdateNamedResourceRequest {id} {locale}>' +
							      	'{v1:Resource}'+
							      '</v1:UpdateNamedResourceRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, id, 'id');
		message = this._applyParam(message, locale, 'locale');
		message = this._applyParam(message, resourceXmlText, 'v1:Resource', true);
		this.startSoap(message, callback, context);		
    },
    
    /**
    * The request to search named resources in the repository. The named resource defintion files in the repository are searched for the specified string. A list of all named resources that contain the search string is returned in the response.
    * @param {string} contains Search criteria
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.NamedResourceService.ListOptions} [options] Options
    */
    searchNamedResource: function(contains, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:SearchNamedResourceRequest {id} {locale} {resourceType}>' +
							        '{v1:Path}'+
							      	'{v1:Contains}'+
							      '</v1:SearchNamedResourceRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, options.id, 'id');
		message = this._applyParam(message, options.locale, 'locale');
		message = this._applyParam(message, options.resourceType, 'resourceType');
		message = this._applyParam(message, options.path, 'v1:Path', true);
		message = this._applyParam(message, contains, 'v1:Contains', true);
		
		this.startSoap(message, callback, context);		
    },
    
    /**
    * Search references options
    * @typedef {Object} L.SpectrumSpatial.Services.NamedResourceService.SearchReferencesOptions
    * @property {string} [id] Id of request
    * @property {string} [locale] Locale
    * @property {string} [searchPath] Starting search path
    */
    
    /**
    * The request to search a named resource and return all resources that are referenced in that resource. A list of all named resources that are referenced, and all of the resources that those reference, are returned in the response.
    * @param {string} namedResource Named resource path
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.NamedResourceService.SearchReferencesOptions} [options] Options
    */
    searchReferences: function(namedResource, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:SearchReferencesRequest {id} {locale} >' +
							        '{v1:SearchPath}'+
							      	'{v1:NamedResourcePath}'+
							      '</v1:SearchReferencesRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, options.id, 'id');
		message = this._applyParam(message, options.locale, 'locale');
		message = this._applyParam(message, options.searchPath, 'v1:SearchPath', true);
		message = this._applyParam(message, namedResource, 'v1:NamedResourcePath ', true);
		
		this.startSoap(message, callback, context);		
    },
    
    /**
    * The request to search for all named resources in the repository that use the specified resource in the request. A list of all named resources that use the defined resource is returned in the response.
    * @param {string} namedResource Named resource path
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.NamedResourceService.SearchReferencesOptions} [options] Options
    */
    searchReferencedIn: function(namedResource, callback, context, options){
	    options = options || {};
	    var message = '<?xml version="1.0"?>' + 
			          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.mapinfo.com/midev/service/namedresource/v1">' +  
						   '<soapenv:Header/>' +
							   '<soapenv:Body>'+
							      '<v1:SearchReferencedInRequest {id} {locale} >' +
							        '{v1:SearchPath}'+
							      	'{v1:NamedResourcePath}'+
							      '</v1:SearchReferencedInRequest>'+
							   '</soapenv:Body>'+
					  '</soapenv:Envelope>';		
		message = this._applyParam(message, options.id, 'id');
		message = this._applyParam(message, options.locale, 'locale');
		message = this._applyParam(message, options.searchPath, 'v1:SearchPath', true);
		message = this._applyParam(message, namedResource, 'v1:NamedResourcePath ', true);
		
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