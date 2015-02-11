/**
 * Leaflet namespace
 * @namespace L
 */



/**
* Spectrum spatial for leaftlet namespace
* @namespace
*/
L.SpectrumSpatial = {
  Version: '0.1.0',
  
  /**
  * Spectrum's services
  * @namespace
  */
  Services: {},
  
  /**
  * Spectrum's services
  * @namespace
  */
  Layers:{},
  
  /**
  * Controls
  * @namespace
  */
  Controls:{},
  
  /**
  * Environment values
  * @namespace
  */
  Support: {
    CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
  }
};

if(typeof window !== 'undefined' && window.L){
  window.L.SpectrumSpatial = L.SpectrumSpatial;
};/**
* Usefull utils
* @namespace
*/
L.SpectrumSpatial.Utils = {
	
	/**
	 * Function compares two object. If object A "greater" then object B returns 1, if on the contrary -1, if equal 0
	 * @function CompareFunction
	 * @param {Object} a Object A
	 * @param {Object} b Object B
	 * @returns {number} 
	 */
	
	/**
	* Object array's sorting function (by specified property name)
	* @param {string} property Property name
	* @param {string=} [order=asc] Sorting order. Can be "asc" for ascending order or "desc" descending order.
	* @returns {CompareFunction}
    */
    sortByProperty :  function(property, order) {
	    var sortOrder = (order === "desc") ? -1:1;
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    };
	},
	
	/**
	* Object array's sorting function (by specified function name)
	* @param {string} funcname Function name
	* @param {string=} [order=asc] Sorting order. Can be "asc" for ascending order or "desc" descending order.
	* @returns {CompareFunction}
    */
	sortByFuncResult :  function(funcname, order) {
	    var sortOrder = (order === "desc") ? -1:1;
	    return function (a,b) {
	        var result = (a[funcname]() < b[funcname]()) ? -1 : (a[funcname]() > b[funcname]()) ? 1 : 0;
	        return result * sortOrder;
	    };
	}
	
};;(function(){
	var callbacks = 0;
	
	window._Spectrum4LeafletCallbacks = {};
	
	/**
	* @classdesc Simple Wraper on XMLHttpRequest, has simple get and post functions
	* @constructor
	*/
	L.SpectrumSpatial.Request = {
	
	    /**
		 * Callback function for {Spectrum4Leaflet.Request}
		 *
		 * @callback Request.Callback
		 * @param {Object} error Error object, with fieds code and message
		 * @param {Object} response Response
		 */
	
	
	    /**
	    * Creates XMLHttpRequest and binds callbacks
	    * @private
	    * @returns {XMLHttpRequest}
	    */
		_createRequest: function (callback, context){
		    var httpRequest = new XMLHttpRequest();
		
		    httpRequest.onerror = function(e) {
		      callback.call(context, {
		        error: {
		          code: 500,
		          message: 'XMLHttpRequest error'
		        }
		      }, null);
		    };
		
		    httpRequest.onreadystatechange = function(){
		      var response;
		      var error;
		
		      if (httpRequest.readyState === 4) {
		        try {
		          var contentType = this.getResponseHeader('content-type');
		          if (contentType == 'application/json'){
			          response = JSON.parse(httpRequest.responseText);
		          }
		          else{
			          response = httpRequest.response;
		          }   
		        } catch(e) {
		          response = null;
		          error = {
		            code: 500,
		            message: 'Could not parse response as JSON.'
		          };
		        }
		
		        if (!error && response.error) {
		          error = response.error;
		          response = null;
		        }
		
		        callback.call(context, error, response);
		      }
		    };
		
		    return httpRequest;
	    },
	    
	    /**
	    * Runs get request
	    * @param {string} url Url for request
	    * @param {string} login Login 
	    * @param {string} password Password 
	    * @param {Request.Callback} callback function, when request is done
	    * @param {Object} context Context for callback
	    * @returns {XMLHttpRequest}
	    */
	    get: function(url, login, password, callback, context){
	        var httpRequest = this._createRequest(callback,context);
		    httpRequest.open('GET', url , true, login, password);
	        httpRequest.send(null);
	        return httpRequest;
	    },
	    
	    /**
	    * Runs get request by JSONP pattern 
	    * @param {string} url Url for request
	    * @param {string} callbackSeparator Special character to separate callback param from query param
	    * @param {Request.Callback} callback function, when request is done
	    * @param {Object} context Context for callback
	    * @returns {XMLHttpRequest}
	    */
	    jsonp: function(url, callbackSeparator, callback,context){
		    var callbackId = 'c' + callbacks;
	
	        var script = L.DomUtil.create('script', null, document.body);
	        script.type = 'text/javascript';
	        script.src = url + callbackSeparator + 'callback=window._Spectrum4LeafletCallbacks.' + callbackId;
	        script.id = callbackId;
	
	        window._Spectrum4LeafletCallbacks[callbackId] = function(response){
	          if(window._Spectrum4LeafletCallbacks[callbackId] !== true){
	            var error;
	            var responseType = Object.prototype.toString.call(response);
	
	            if(!(responseType === '[object Object]' || responseType === '[object Array]')){
	              error = {
	                error: {
	                  code: 500,
	                  message: 'Expected array or object as JSONP response'
	                }
	              };
	              response = null;
	            }
	
	            if (!error && response.error) {
	              error = response;
	              response = null;
	            }
	
	            callback.call(context, error, response);
	            window._Spectrum4LeafletCallbacks[callbackId] = true;
	          }
	        };
	
	        callbacks++;
	
	        return {
	          id: callbackId,
	          url: script.src,
	          abort: function(){
	            window._Spectrum4LeafletCallbacks._callback[callbackId]({
	              code: 0,
	              message: 'Request aborted.'
	            });
	          }
	        };
	    },
	    
	    /**
	    * Runs post request
	    * @param {string} url Url for request
	    * @param {object} postdata Data to send in request body
	    * @param {string} posttype Type of post data 
	    * @param {string} responseType Type of returned data (only for XHR2)
	    * @param {string} login Login 
	    * @param {string} password Password 
	    * @param {Request.Callback} Callback function, when request is done
	    * @param {object} context Context for callback
	    * @returns {XMLHttpRequest}
	    */
	    post: function(url, postdata, posttype, responseType, login, password, callback,context){
	        var httpRequest = this._createRequest(callback,context);
	        httpRequest.open('POST', url, true, login, password);
	        httpRequest.setRequestHeader('Content-Type', posttype);
	        
	        if (responseType){
		        httpRequest.responseType = responseType;
	        }
	        
	        httpRequest.send(postdata);
	        return httpRequest;
	    }
	};
})();

;L.SpectrumSpatial.Services.Operation = L.Class.extend(
/** @lends L.SpectrumSpatial.Services.Operation.prototype */
{ 

  /**
  * Operation's options class
  * @typedef {Object}  Services.Service.Options
  * @property {string} name Name of operation
  * @property {Object} getParams Params for get request
  * @property {Object} postParams Params for post request
  * @property {boolean} forcePost Is true if opertaion should use post request
  * @property {string} paramsSeparator Separator for get params in url
  * @property {string} queryStartCharacter Character from which query begins 
  * @property {string} postType Type of post data. Default is 'application/json'
  * @property {string} responseType Type of response data. Used for post response with image (only for XHR2)
  */

  /**
  * @property {Services.Service.Options}  options 
  */
  options: {
      forcePost :false,
      paramsSeparator: ';',
      queryStartCharacter:';',
      postType : 'application/json',
      responseType:null
  },

  /**
  * @class Service operation class
  * @augments {L.Class} 
  * @constructs L.SpectrumSpatial.Services.Operation
  * @param {string} name Name of operation
  * @param {Services.Service.Options} options Additional options of operation
  */
  initialize: function(name,options) {
      this.options.getParams = {};
      this.options.postParams = {};
      options = options || {};
      options.name=name;
      L.setOptions(this, options);
  },
  
  /**
  * Builds query for url by name and getParams of operation
  * @returns {string}
  */
  getUrlQuery: function(){
      
	  var keyValueArray = [];
  
      var params =  this.options.getParams;
      
	  for (var key in params){
          if(params.hasOwnProperty(key)){
             var param = params[key];
             
             keyValueArray.push(key + '=' + encodeURIComponent(param));
          }
      }
      var query = this.options.name;
      
      if (keyValueArray.length>0){
	      query+=this.options.queryStartCharacter + keyValueArray.join(this.options.paramsSeparator);
      }
      
      return query;
  },

  
  /**
  * Creates string representation of postParams
  * @returns {string}
  */
  getPostData: function(){
	  return JSON.stringify(this.options.postParams);
  },
  
  /**
  * Returns type of post data
  * @returns {string}
  */
  getPostType: function(){
	  return this.options.postType;
  },
  
  /**
  * Returns type of response type (for xhr 2)
  * @returns {string}
  */
  getResponseType: function(){
	  return this.options.responseType;
  },
  
  /**
  * Check if operation should use only post request
  * @returns {boolean}
  */
  isPostOperation:function(){
	  return (Object.keys(this.options.postParams).length!==0) | this.options.forcePost;
  }
  
});

L.SpectrumSpatial.Services.operation = function(name,options){
  return new L.SpectrumSpatial.Services.Operation(name,options);
};;L.SpectrumSpatial.Services.Service = L.Class.extend(
/** @lends L.SpectrumSpatial.Services.Service.prototype */
{ 

  /**
  * Service's options class
  * @typedef {Object} Services.Service.Options
  * @property {string} url - Url of service
  * @property {string} proxyUrl - proxy url 
  * @property {boolean} alwaysUseProxy - use proxy for get requests
  * @property {boolean} forceGet - always do not use jsonp
  * @property {boolean} encodeUrlForProxy - if true encode query url for using with proxy
  */

  /**
  * @property {Services.Service.Options}  options 
  */
  options: {
      alwaysUseProxy:false,
      forceGet : false,
      encodeUrlForProxy:false
  },

  /**
  * @class Base service class
  * @augments {L.Class} 
  * @constructs 
  * @param {string} url Url of service
  * @param {Services.Service.Options} options Additional options of service
  */
  initialize: function (url, options) {
      options = options || {};
      options.url = url;
      L.Util.setOptions(this, options);
  },
  
  /**
  * Starts request to service
  * @returns {XMLHttpRequest}
  */
  startRequest: function(operation, callback,context){
      var urlWithQuery = this.getUrl(operation);
	  if (operation.isPostOperation()){
	      if (this.options.proxyUrl){
		      urlWithQuery = this.options.proxyUrl + this.checkEncodeUrl(urlWithQuery) ;
	      }
		  return L.SpectrumSpatial.Request.post(urlWithQuery, 
		                                       operation.getPostData(), 
		                                       operation.getPostType(),
		                                       operation.getResponseType(),
		                                       this.options.login,
		                                       this.options.password,  		                                       
		                                       callback, 
		                                       context);
	  }
	  else{
	      if (this.options.alwaysUseProxy){
		      urlWithQuery = this.options.proxyUrl + this.checkEncodeUrl(urlWithQuery) ;
		      return L.SpectrumSpatial.Request.get(urlWithQuery, this.options.login,this.options.password, callback, context);
	      }
		  return ( this.options.forceGet | L.SpectrumSpatial.Support.CORS ) ? 
		             L.SpectrumSpatial.Request.get(urlWithQuery,this.options.login,this.options.password,  callback, context):
		             L.SpectrumSpatial.Request.jsonp(urlWithQuery,'?', callback, context);
	  }
  },
  
  /**
  * Returns full url query for service
  * @param {L.SpectrumSpatial.Services.Operation}
  * @returns {string}
  */
  getUrl: function(operation){
      var urlQuery = this.clearParam(operation.getUrlQuery());     
	  var separator = (this.options.url.slice(-1) === '/') ? '' : '/';  
	  return this.options.url + separator +  urlQuery;
  },
  
  /**
  * Clears parameter from '/' at first or last letter
  * @param {string}
  * @returns {string}
  */
  clearParam: function(param){
	  if (param[0]==='/'){
	      param = param.substring(1);
      }
      if (param.slice(-1) === '/') {
	      param = param.substring(0, param.length-1);
      }
      return param;
  },
  
  /**
  * Encode specified url if options.encodeUrlForProxy is true
  * @param {string}
  * @returns {string}
  */
  checkEncodeUrl:function(url){
	  return  this.options.encodeUrlForProxy ? encodeURIComponent(url) : url;
  }
  
});

L.SpectrumSpatial.Services.service = function(url,options){
  return new L.SpectrumSpatial.Services.Service(url,options);
};;/** 
* @class Spectrum Spatial Map Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.MapService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.MapService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.MapService# */
{     


    /**
    * Lists all named layers which map service contains
    * @param {string} locale Locale of response 
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    listNamedLayers : function(locale, callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('layers.json');
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describes specified layer
    * @param {string} layerName name of layer
    * @param {string} locale Locale of response 
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    describeNamedLayer : function(layerName, locale, callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('layers/'+ this.clearParam(layerName) + '.json');
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describes specified layers
    * @param {Array.<string>} layerNames Array of layer's names
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    describeNamedLayers : function(layerNames, callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('layers.json', {  paramsSeparator : '&', queryStartCharacter : '?' } );
        
        var layersString = layerNames.join(',');
        operation.options.getParams.q = 'describe';
        if (layersString.length<1000){
	        
	        operation.options.getParams.layers = layersString;
        } 
        else{
	        operation.options.postParams = { 'Layers' : layerNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Lists all named maps which map service contains
    * @param {string} locale Locale of response 
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    listNamedMaps : function(locale, callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('maps.json');
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describes specified map
    * @param {string} mapName name of map
    * @param {string} locale Locale of response 
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    describeNamedMap : function(mapName, locale, callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ this.clearParam(mapName)+ '.json');
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describes specified maps
    * @param {Array.<string>} mapNames Array of map's names
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    describeNamedMaps : function(mapNames, callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('maps.json', { paramsSeparator : '&', queryStartCharacter : '?' } );
        
        var mapsString = mapNames.join(',');
        if (mapsString.length<1000){
	        operation.options.getParams.q = 'describe';
	        operation.options.getParams.maps = mapsString;
        } 
        else{
	        operation.options.postParams = { 'Maps' : mapNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * @private
    */
    _createRenderOperation:function (mapName, imageType,width,height,bounds,cx,cy,scale,zoom,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
       
        mapName = this.clearParam(mapName);
        if (mapName !== ''){
	        mapName = '/'+mapName;
        }
	    var operation = new L.SpectrumSpatial.Services.Operation('maps'+ mapName+'/image.'+imageType , { responseType: 'arraybuffer' } );
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    if (bounds){
		    operation.options.getParams.b= bounds.join(',')+ ',' + srs;
	    }
	    else{
		    operation.options.getParams.c= cx+ ',' +cy + ',' + srs;
	    }
	    
	    if (scale){
		    operation.options.getParams.s = scale;
	    }
	    
	    if (zoom){
		    operation.options.getParams.z = zoom;
	    }
	    
	    this._addResolutionAndLocale(operation,resolution,locale);
	    
	    if (rd){
		    operation.options.getParams.rd = rd;
	    }
	    
	    if (bc){
		    operation.options.getParams.bc = bc;
	    }
	    
	    if (bo){
		    operation.options.getParams.bc = bc;
	    }
	    
	    if (additionalParams){
		    operation.options.postParams = additionalParams;
	    }
	    
	    return operation;	    
    },

    /**
    * @private
    */    
    _addResolutionAndLocale: function(operation,resolution, locale){
	    if (resolution){
		    operation.options.getParams.r = resolution;
	    }
	    
	    if (locale){
		    operation.options.getParams.l = locale;
	    }
    },
    
    /**
    * Runs rendering  map by bounds request
    * @param {string} mapName Name of map to render
    * @param {string} imageType Type of image ( png, jpg etc.) 
    * @param {number} width Width of rendered image
    * @param {number} height Height of rendered image
    * @param {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    * @param {string} srs Reference system code
    * @param {number} resolution Resolution
    * @param {string} locale Locale
    * @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    * @param {string} bc The background color to use for the map image (RRGGBB)
    * @param {number} bo The opacity of the background color
    * @param {Object} additionalParams Additional parameters for post query
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    renderMapByBounds: function(mapName, imageType,width,height,bounds,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, bounds,null,null,null,null,srs,resolution,locale,rd,bc,bo,additionalParams);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns url of image (redered map by bounds) for get request
    * @param {string} mapName Name of map to render
    * @param {string} imageType Type of image ( png, jpg etc.) 
    * @param {number} width Width of rendered image
    * @param {number} height Height of rendered image
    * @param {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    * @param {string} srs Reference system code
    * @param {number} resolution Resolution
    * @param {string} locale Locale
    * @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    * @param {string} bc The background color to use for the map image (RRGGBB)
    * @param {number} bo The opacity of the background color
    * @returns {string}
    */
    getUrlRenderMapByBounds: function(mapName, imageType,width,height,bounds,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, bounds,null,null,null,null,srs,resolution,locale,rd,bc,bo);
	    
	    return (this.options.alwaysUseProxy ? this.options.proxyUrl : '') +  this.checkEncodeUrl(this.getUrl(operation));
    },
    
    /**
    * Runs rendering  map by center and scale request
    * @param {string} mapName Name of map to render
    * @param {string} imageType Type of image ( png, jpg etc.) 
    * @param {number} width Width of rendered image
    * @param {number} height Height of rendered image
    * @param {number} cx Center x coordinate 
    * @param {number} cy Center y coordinate 
    * @param {number} scale Scale
    * @param {string} srs Reference system code
    * @param {number} resolution Resolution
    * @param {string} locale Locale
    * @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    * @param {string} bc The background color to use for the map image (RRGGBB)
    * @param {number} bo The opacity of the background color
    * @param {Object} additionalParams Additional parameters for post query
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    renderMapByCenterScale: function(mapName, imageType,width,height,cx,cy,scale,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,scale,null,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns url of image (map by center and scale)  for get request
    * @param {string} mapName Name of map to render
    * @param {string} imageType Type of image ( png, jpg etc.) 
    * @param {number} width Width of rendered image
    * @param {number} height Height of rendered image
    * @param {number} cx Center x coordinate 
    * @param {number} cy Center y coordinate 
    * @param {number} scale Scale
    * @param {string} srs Reference system code
    * @param {number} resolution Resolution
    * @param {string} locale Locale
    * @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    * @param {string} bc The background color to use for the map image (RRGGBB)
    * @param {number} bo The opacity of the background color
    * @returns {string}
    */
    getUrlRenderMapByCenterScale: function(mapName, imageType,width,height,cx,cy,scale,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,scale,null,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    * Runs rendering  map by center and zoom request
    * @param {string} mapName Name of map to render
    * @param {string} imageType Type of image ( png, jpg etc.) 
    * @param {number} width Width of rendered image
    * @param {number} height Height of rendered image
    * @param {number} cx Center x coordinate 
    * @param {number} cy Center y coordinate 
    * @param {number} zoom Zoom
    * @param {string} srs Reference system code
    * @param {number} resolution Resolution
    * @param {string} locale Locale
    * @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    * @param {string} bc The background color to use for the map image (RRGGBB)
    * @param {number} bo The opacity of the background color
    * @param {Object} additionalParams Additional parameters for post query
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    renderMapByCenterZoom: function(mapName, imageType,width,height,cx,cy,zoom,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,null,zoom,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns url of image (map by center and zoom)  for get request
    * @param {string} mapName Name of map to render
    * @param {string} imageType Type of image ( png, jpg etc.) 
    * @param {number} width Width of rendered image
    * @param {number} height Height of rendered image
    * @param {number} cx Center x coordinate 
    * @param {number} cy Center y coordinate 
    * @param {number} zoom Zoom
    * @param {string} srs Reference system code
    * @param {number} resolution Resolution
    * @param {string} locale Locale
    * @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    * @param {string} bc The background color to use for the map image (RRGGBB)
    * @param {number} bo The opacity of the background color
    * @returns {string}
    */
    getUrlRenderMapByCenterZoom: function(mapName, imageType,width,height,cx,cy,zoom,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,null,zoom,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    * Runs legend request
    * @param {string} mapName The name of the map to return the legend.
    * @param {number} width Width of the individual legend swatch in pixels
    * @param {number} height Height of the individual legend swatch in pixels
    * @param {string} imageType The type of images to return for the legend swatches(e.g., gif, png, etc)
    * @param {boolean} inlineSwatch Determines if the swatch images are returned as data or URL to the image location on the server
    * @param {number} resolution The DPI resolution of the legend swatches as an integer.
    * @param {string} locale Locale
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    getLegendForMap: function(mapName ,width, height, imageType, inlineSwatch, resolution,locale,callback, context){
	    var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ this.clearParam(mapName)+'/legend.json');
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.t = imageType;
	    this._addResolutionAndLocale(operation,resolution,locale);
	    
	    // I WANT TO KILL PB DEVELOPERS FOR THIS '?' IN QUERY
	    if (inlineSwatch!==null){
		    operation.options.getParams['?inlineSwatch'] = inlineSwatch;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Runs request for an individual swatch for a layer of a named map
    * @param {string} mapName The name of the map to return the swatch
    * @param {number} legendIndex The legend to get the swatch from in the named map
    * @param {number} rowIndex The swatch location (row) within the legend
    * @param {number} width Width of the individual legend swatch in pixels
    * @param {number} height Height of the individual legend swatch in pixels
    * @param {number} resolution The DPI resolution of the swatch as an integer
    * @param {string} locale The locale in which to render the swatch
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    getSwatchForLayer: function(mapName,legendIndex,rowIndex,width, height, imageType,resolution, locale, callback, context){
	    var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ this.clearParam(mapName)+
	                                                            '/legends/'+legendIndex + 
	                                                             '/rows/' + rowIndex + 
	                                                             '/swatch/' + width + 'x' + height + '.' + imageType);
	    this._addResolutionAndLocale(operation,resolution,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns an individual swatch for a layer of a named map
    * @param {string} mapName The name of the map to return the swatch
    * @param {number} legendIndex The legend to get the swatch from in the named map
    * @param {number} rowIndex The swatch location (row) within the legend
    * @param {number} width Width of the individual legend swatch in pixels
    * @param {number} height Height of the individual legend swatch in pixels
    * @param {number} resolution The DPI resolution of the swatch as an integer
    * @param {string} locale The locale in which to render the swatch
    * @returns {string}
    */
    getUrlSwatchForLayer: function(mapName,legendIndex,rowIndex,width, height, imageType,resolution, locale){
	    var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ this.clearParam(mapName)+
	                                                            '/legends/'+legendIndex + 
	                                                             '/rows/' + rowIndex + 
	                                                             '/swatch/' + width + 'x' + height + '.' + imageType);
	    this._addResolutionAndLocale(operation,resolution,locale);
	    return this.getUrl(operation);
    },
    
    //??????????? strange definition in Spectrum Spatial Guide
    renderLegend: function(mapName ,width, height, imageType, resolution,locale, inlineSwatch,callback, context){
	    //var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ mapName+'/legend.json');
    }
    
});

L.SpectrumSpatial.Services.mapService = function(url,options){
  return new L.SpectrumSpatial.Services.MapService(url,options);
};;/** 
* @class Spectrum Spatial Tile Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.TileService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.TileService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.TileService# */
{
    /**
    * Returns the list of available named tiles for the Map Tiling Service
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    mapList : function(callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('mapList.json');
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns the metadata of a specified named tile for the Map Tiling Service
    * @param {string} mapName The name of the named tile to return the metadata for
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    description : function(mapName,callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('/'+ this.clearParam(mapName) + '/description.json');
	    this.startRequest(operation, callback, context);
    },  
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {string} imageType Specifies the response image format. Must be png, gif, or jpeg.
    */
    getTileUrl: function(mapName,level,x,y,imageType){
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        return (this.options.alwaysUseProxy ? this.options.proxyUrl : '') +  this.checkEncodeUrl(this.getUrl(operation));
    },
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {string} imageType Specifies the response image format. Must be png, gif, or jpeg.
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    getTile: function(mapName,level,x,y,imageType, callback,context){
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        this.startRequest(operation, callback, context);
    },
    
    /**
    * @private
    */
    _createTileOperation:function(mapName,level,x,y,imageType){
        mapName = this.clearParam(mapName);
        if (mapName !== ''){
	        mapName = '/'+mapName;
        }
	    return new L.SpectrumSpatial.Services.Operation(mapName+'/'+level+'/' + x + ':' + y + '/tile.' + imageType );
    }
    
    
});

L.SpectrumSpatial.Services.tileService = function(url,options){
  return new L.SpectrumSpatial.Services.TileService(url,options);
};;L.SpectrumSpatial.Layers.MapServiceLayer =  L.Layer.extend({
/** @lends L.SpectrumSpatial.Layers.MapServiceLayer.prototype */


    /**
    * MapServiceLayer's options class
    * @typedef {Object} L.SpectrumSpatial.Layers.MapServiceLayer.Options
    * @property {number} opacity  Opacity of layer image (1 is default)
    * @property {string} alt  Title for layer image
    * @property {boolean} interactive  If layer is interactive
    * @property {string} imageType  Type of image ( 'png' is default )
    * @property {number} zIndex  ZIndex of layer's image ('auto' is default)
    * @property {number} updateInterval  Min update interval of the layer
    */

    /**
    * @property {L.SpectrumSpatial.Layers.MapServiceLayer.Options} options 
    */
    options: {
		opacity: 1,
		alt: '',
		interactive: false,
		imageType: 'png',
		zIndex: 'auto',
		updateInterval:200,
	},


    /**
    * @class MapService layer class
    * @augments {L.Layer}
	* @constructs L.SpectrumSpatial.Layers.MapServiceLayer
    * @param {L.SpectrumSpatial.Services.MapService} service Map Service for layer
    * @param {string} mapName Name of the map to display on map service
    * @param {Object} postData Post data to map (only if browser supports XHR2)
    * @param {L.SpectrumSpatial.Layers.MapServiceLayer.Options} options Additional options of layer
    */
	initialize: function (service, mapName, postData, options) { 
		this._mapName = mapName;
		this._service = service;
		this._postData = postData;
		L.setOptions(this, options);
	},
	
	onAdd: function (map) {	
	    this._map = map;	    		
	    this._srs = map.options.crs;
	    this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
	    map.on('moveend', this._update, this);
	    
	    this._update();
	},

	onRemove: function () {
		L.DomUtil.remove(this._image);
		delete this._image;
	},	
	
	setService:function(service){
	   	this._service = service;
	   	this._update();
	   	return this;
	},
	
	setMapName:function(mapName){
	   	this._mapName = mapName;
	   	this._update();
	   	return this;
	},
	
	setPostData:function(postData){
	   	this._postData = postData;
	   	this._update();
	   	return this;
	},
	
	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
	},

	setStyle: function (styleOpts) {
		if (styleOpts.opacity) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	},
	
	setZIndex: function(zIndex){
	    this.options.zIndex = zIndex;
		this._updateZIndex();
		return this;
	},
	
	getZIndex: function(){
		return this.options.zIndex;
	},
	
	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._image);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._image);
		}
		return this;
	},


	getAttribution: function () {
		return this.options.attribution;
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	getBounds: function () {
		return this._bounds;
	},
	
	_initInteraction: function () {
		if (!this.options.interactive) { return; }
		L.DomUtil.addClass(this._image, 'leaflet-interactive');
		L.DomEvent.on(this._image, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',
				this._fireMouseEvent, this);
	},

	_fireMouseEvent: function (e, type) {
		if (this._map) {
			this._map._fireMouseEvent(this, e, type, true);
		}
	},

	_initImage: function () {
		var img = L.DomUtil.create('img','leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
		img.onselectstart = L.Util.falseFn;
		img.onmousemove = L.Util.falseFn;
        img.style.zIndex = this.options.zIndex;
		img.alt = this.options.alt;
		
		if (this.options.opacity < 1) {
			L.DomUtil.setOpacity(img, this.options.opacity);
		}
		
		return img;
	},
	
	_requestCounter :0,
	
	_animateZoom: function (e) {
		var bounds = new L.Bounds(
			this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center));

		var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

		L.DomUtil.setTransform(this._image, offset, e.scale);
	},
	

	_reset: function () {  
		var image = this._image,
		    bounds = new L.Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		L.DomUtil.setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},
	
	
	_update:function(){
	    
	    if(this._map._animatingZoom){
	       return;
	    }
	    
	    if (this._map._panAnim && this._map._panAnim._inProgress) {
           return;
        }

	    var bounds = this._map.getBounds();
	    var size = this._map.getSize();
	    var nw = this._srs.project(bounds.getNorthWest());
	    var se = this._srs.project(bounds.getSouthEast());  
	
	    var newImage = this._initImage();
	    
	    this._requestCounter++;
	    
		
		if (this._postData){
			this._service.renderMapByBounds(
	                this._mapName , 
	                this.options.imageType,
	                size.x,
	                size.y,
	                [ nw.x, nw.y, se.x,se.y ], 
	                this._srs.code,
	                null,
	                null,
	                null,
	                null,
	                null,
	                this._postData,
	                this._postLoad,
	                { context: this, image: newImage, bounds:bounds, counter:this._requestCounter});
		}
		else{
		    newImage.onload = L.bind(this._afterLoad, this, { image: newImage, bounds:bounds, counter:this._requestCounter});
			newImage.src = 
	           this._service.getUrlRenderMapByBounds(
	                this._mapName , 
	                this.options.imageType,
	                size.x,
	                size.y,
	                [ nw.x, nw.y, se.x,se.y ], 
	                this._srs.code);
	              
		}
		this.fire('loading');
	},
	
	_afterLoad: function (params) {  
	
	    //only last request we will draw
	    if (this._requestCounter!= params.counter){
	        delete params.image;
	        return;
	    }
	
		this.fire('load');
	 
	    this._bounds = params.bounds;
	    this._size = this._map.getSize();
	    
		var image = params.image,
		    bounds = new L.Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		L.DomUtil.setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
					
		this.getPane(this.options.pane).appendChild(image);
		
		//clears old image
		if (this._image){
		    this.getPane(this.options.pane).removeChild(this._image);
		    L.DomEvent.off(this._image, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',this._fireMouseEvent, this);
		    delete this._image;
	    }
	 
	    this._image = image;	
		this._initInteraction();
	},
	
	_postLoad:function(error,response){
	    var uInt8Array = new Uint8Array(response);
	    var i = uInt8Array.length;
	    var binaryString = new Array(i);
	    while (i--)
	    {
	      binaryString[i] = String.fromCharCode(uInt8Array[i]);
	    }
	    var data = binaryString.join('');
	
	    var base64 = window.btoa(data);
	    this.image.src ='data:image/png;base64,'+base64;
	    this.context._afterLoad({ image: this.image, bounds:this.bounds, counter:this.counter});
	},
	
	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	},
	
	_updateZIndex: function(){
		if (this._image){
			this._image.style.zIndex = this.options.zIndex;
		}		
	}	
	
});

L.SpectrumSpatial.Layers.mapServiceLayer = function(service,mapName,postData,options){
  return new L.SpectrumSpatial.Layers.MapServiceLayer(service,mapName,postData,options);
};
;L.SpectrumSpatial.Layers.TileServiceLayer = L.GridLayer.extend({
/** @lends L.SpectrumSpatial.Layers.TileServiceLayer.prototype */

    /**
    * TileServiceLayer options class
    * @typedef {Object} L.SpectrumSpatial.Layers.TileServiceLayer.Options
    * @property {number} maxZoom  Maximum zoom level
    * @property {number} minZoom  Minimum zoom level
    * @property {string} errorTileUrl  Url of image to display when tile loading failed
    * @property {number} zoomOffset  
    * @property {number} maxNativeZoom  
    * @property {boolean} tms  
    * @property {boolean} zoomReverse  
    * @property {boolean} detectRetina  
    * @property {boolean} crossOrigin 
    */

    /**
    * @property {L.SpectrumSpatial.Layers.TileServiceLayer.Options} options 
    */
	options: {
		maxZoom: 18,
        minZoom: 0,
		errorTileUrl: '',
		zoomOffset: 0,
		maxNativeZoom: null, 
		tms: false,
		zoomReverse: false,
		detectRetina: false,
		crossOrigin: false
	},


    /**
	* @class TileService layer class
	* @constructs L.SpectrumSpatial.Layers.TileServiceLayer
    * @augments {L.GridLayer}
    * @param {L.SpectrumSpatial.Services.TileService} service Map Service for layer
    * @param {string} mapName Name of the tiled map to display on tile service
    * @param {L.SpectrumSpatial.Layers.TileServiceLayer.Options} options Additional options of layer
    */
	initialize: function (service, mapName, options) {

		this._service = service;
		this._mapName = mapName;

		options = L.setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);
			options.zoomOffset++;

			options.minZoom = Math.max(0, options.minZoom);
			options.maxZoom--;
		}

		// for https://github.com/Leaflet/Leaflet/issues/137
		if (!L.Browser.android) {
			this.on('tileunload', this._onTileRemove);
		}
	},

	setService: function (service, noRedraw) {
		this._service = service;
        
		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},
	
	setMapName: function (mapName, noRedraw) {
        this._mapName = mapName;
        
		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	createTile: function (coords, done) {
		var tile = document.createElement('img');

		tile.onload = L.bind(this._tileOnLoad, this, done, tile);
		tile.onerror = L.bind(this._tileOnError, this, done, tile);

		if (this.options.crossOrigin) {
			tile.crossOrigin = '';
		}

		/*
		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
		 http://www.w3.org/TR/WCAG20-TECHS/H67
		*/
		tile.alt = '';

		tile.src = this.getTileUrl(coords);

		return tile;
	},

	getTileUrl: function (coords) {
		return this._service.getTileUrl(
		                          this._mapName,
		                          this._getZoomForUrl()+1,
		                          coords.x + 1,
		                          (this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y) + 1  ,
		                          'png');
	},

	_tileOnLoad: function (done, tile) {
		done(null, tile);
	},

	_tileOnError: function (done, tile, e) {
		var errorUrl = this.options.errorTileUrl;
		if (errorUrl) {
			tile.src = errorUrl;
		}
		done(e, tile);
	},

	_getTileSize: function () {
		var map = this._map,
		    options = this.options,
		    zoom = map.getZoom() + options.zoomOffset,
		    zoomN = options.maxNativeZoom;

		// increase tile size when overscaling
		return zoomN !== null && zoom > zoomN ?
				Math.round(map.getZoomScale(zoomN, zoom) * options.tileSize) :
				options.tileSize;
	},

	_onTileRemove: function (e) {
		e.tile.onload = null;
	},

	_getZoomForUrl: function () {

		var options = this.options,
		    zoom = this._tileZoom;

		if (options.zoomReverse) {
			zoom = options.maxZoom - zoom;
		}

		zoom += options.zoomOffset;

		return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
	},

	// stops loading all tiles in the background layer
	_abortLoading: function () {
		var i, tile;
		for (i in this._tiles) {
			tile = this._tiles[i].el;

			tile.onload = L.Util.falseFn;
			tile.onerror = L.Util.falseFn;

			if (!tile.complete) {
				tile.src = L.Util.emptyImageUrl;
				L.DomUtil.remove(tile);
			}
		}
	}
});

L.SpectrumSpatial.Layers.tileServiceLayer = function(service,mapName,options){
  return new L.SpectrumSpatial.Layers.TileServiceLayer(service,mapName,options);
};;L.SpectrumSpatial.Controls.Layers = L.Control.Layers.extend({
	
	initialize: function (baseLayers, overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		
		this._minZIndex = 1;
		this._maxZIndex = 0;
		
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},
	
	_addLayer: function (layer, name, overlay) {
		layer.on('add remove', this._onLayerChange, this);

		if (overlay && this.options.autoZIndex && layer.setZIndex) {
			this._maxZIndex++;
			layer.setZIndex(this._maxZIndex);
		}
		
		var id = L.stamp(layer);

		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};
	},
	
	_update: function () {
		if (!this._container) { return this; }

		L.DomUtil.empty(this._baseLayersList);
		L.DomUtil.empty(this._overlaysList);

		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

        var overlays = [];
		for (i in this._layers) {
		    obj = this._layers[i];
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
			if (!obj.overlay){
				this._addItem(obj);
			}
			else{
				overlays.push({ lo : obj, z : obj.layer.getZIndex() });
			}	   
		}
		
		overlays.sort(L.SpectrumSpatial.Utils.sortByProperty('z'));
		
		for (i in overlays) {
			obj = overlays[i];
			this._addItem(obj.lo);
		}
		
		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	},
	
	
	
	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent.on(container, {
					mouseenter: this._expand,
					mouseleave: this._collapse
				}, this);
			}

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			} else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', 'leaflet-ss-control-layers' + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
	},
	
	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-ss-cell leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},
	
    _addItem: function (obj) {
	    var row = document.createElement('div');
	    var checked = this._map.hasLayer(obj.layer);
	    var input;
	    
	    row.className = 'leaflet-ss-row';

		if (obj.overlay) {
			input = document.createElement('input');
			input.name = 'visibilityInput';
			input.type = 'checkbox';
			input.className = 'leaflet-ss-cell leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('visibilityInput', checked);
		}
		input.layerId = L.stamp(obj.layer);
		L.DomEvent.on(input, 'click', this._onVisibilityChanged, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;
        name.className = 'leaflet-ss-cell leaflet-ss-control-layers-title';
        
		row.appendChild(input);
		
		if (obj.overlay) {
			var up = document.createElement('div');
			up.layerId = input.layerId;
			up.className = 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-up';
			L.DomEvent.on(up, 'click', this._onUpClick, this);
			
			var down = document.createElement('div');
			down.layerId = input.layerId;
			down.className = 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-down';
			L.DomEvent.on(down, 'click', this._onDownClick, this);
			
			row.appendChild(up);
			row.appendChild(down);
			
			var opacity = document.createElement('input');
			opacity.type = 'textbox';
			opacity.name = 'opacityInput';
			opacity.className = 'leaflet-ss-cell leaflet-ss-control-layers-input';
			opacity.value = 1;
			opacity.layerId = L.stamp(obj.layer);
			L.DomEvent.on(opacity, 'input', this._onOpacityChanged, this);
			row.appendChild(opacity);
		}

		row.appendChild(name);
		
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(row);

		return row;
	},
	
	_onUpClick: function(e) {
		var layerId = e.currentTarget.layerId;
		var layer = this._layers[layerId].layer;
		var curZ = layer.getZIndex();
		var oldLayer = this._findOverlayByZ(curZ-1);
		if (oldLayer){
			oldLayer.layer.setZIndex(curZ);
			layer.setZIndex(curZ-1);
			this._update();
		}
	},
	
	_onDownClick: function(e) {
		var layerId = e.currentTarget.layerId;
		var layer = this._layers[layerId].layer;
		var curZ = layer.getZIndex();
		var oldLayer = this._findOverlayByZ(curZ+1);
		if (oldLayer){
			oldLayer.layer.setZIndex(curZ);
			layer.setZIndex(curZ+1);
			this._update();
		}
	},
	
	_findOverlayByZ: function(z){	
		for (var i in this._layers) {
			obj = this._layers[i];
			
			if (obj.overlay && obj.layer.getZIndex()===z ){
				return obj;
			} 
		}
		return null;
	},
	
	_onVisibilityChanged: function () {
		var inputs = document.getElementsByName('visibilityInput'),
		    input, layer, hasLayer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			layer = this._layers[input.layerId].layer;
			hasLayer = this._map.hasLayer(layer);

			if (input.checked && !hasLayer) {
				addedLayers.push(layer);

			} else if (!input.checked && hasLayer) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			this._map.removeLayer(removedLayers[i]);
		}
		for (i = 0; i < addedLayers.length; i++) {
			this._map.addLayer(addedLayers[i]);
		}

		this._handlingClick = false;

	    this._refocusOnMap();
	},
	
	_onOpacityChanged:function(){
		var inputs = document.getElementsByName('opacityInput');
		var input, layer;
		
		this._handlingClick = true;

		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			layer = this._layers[input.layerId].layer;
			var newOpacity = parseFloat(input.value);
			if (layer.setOpacity && !isNaN(newOpacity) ){
				layer.setOpacity(newOpacity);
			}
		}
		
		this._handlingClick = false;
	}
	
});