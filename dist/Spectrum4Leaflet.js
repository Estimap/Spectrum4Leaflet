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
  * Defaults values
  * @namespace
  * @property {string} [proxyUrl=undefined] Proxy url for all services
  * @property {boolean} [alwaysUseProxy=false] All queries will be using proxy
  * @property {boolean} [forceGet=true] Every time use get request (not JSONP)
  * @property {boolean} [encodeUrlForProxy=false] If true proxy params will be url encoded
  */
  Defaults:{
	  
	  proxyUrl:undefined,
	  
	  alwaysUseProxy:false,
	  
      forceGet : true,
      
      encodeUrlForProxy:false
  },
  
  /**
  * Projections
  * @namespace
  */
  Projection:{},
  
  /**
  * Environment values
  * @namespace
  */
  Support: {
    CORS: ('withCredentials' in new XMLHttpRequest())
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
	},
	
	/**
	* Find all child elements with specified name in parent 
	* @param {Object} parent Parent html element
	* @param {name} name Name of the element to find
	* @returns {Array.<HTMLElement>}
    */
	getElementsByName: function(parent,name){
		var result = [];
		if (!parent.childNodes){
			return result;
		}
		for (var i=0; i<parent.childNodes.length;i++){
			var node = parent.childNodes[i];
			if (node.childNodes && node.childNodes.length>0){
				result = result.concat(L.SpectrumSpatial.Utils.getElementsByName(node,name));
			}
			if (node.name && node.name===name){
				result.push(node);
			}
		}
		return result;
	},
	
	/**
	* Merges two objects properties from source to destination
	* @param {Object} dest Destination object (wiil be returned)
	* @param {Object} src Source object 
	* @returns {Object}
    */
	merge:function(dest,src){
		if (src){					
			for (var i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},
	
	/**
	* Converts pixel's distance to distance in meters for point
	* @param {L.Map} map Map
	* @param {number} distanceInPixels Distance in pixels
	* @param {Object} [point] point, if is undefined  map.getCenter() used 
	* @returns {Object}
    */
	countPixelDistance:function(map,distanceInPixels, point){
		if (!point){
			point = map.getCenter();
		}

		var pointC = map.latLngToContainerPoint(point); 
		var pointX = [pointC.x + distanceInPixels, pointC.y]; 
		var pointY = [pointC.x, pointC.y + distanceInPixels]; 
		
		var latLngC = map.containerPointToLatLng(pointC);
		var latLngX = map.containerPointToLatLng(pointX);
		var latLngY = map.containerPointToLatLng(pointY);
		
		var distanceX = latLngC.distanceTo(latLngX);
		var distanceY = latLngC.distanceTo(latLngY);
		
		return Math.max(distanceX,distanceY);
	}
	
};;if (!this.proj4){
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
};;L.CRS.EPSG41001 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:41001',
	projection: L.SpectrumSpatial.Projection.SimpleMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * L.SpectrumSpatial.Projection.SimpleMercator.R);
		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});;(function(){
    var callbacks = 0;
    
    window._Spectrum4LeafletCallbacks = {};
    
    /**
    * @classdesc Simple Wraper on XMLHttpRequest, has simple get and post functions
    * @constructor
    */
    L.SpectrumSpatial.Request = {
    
        /**
         * Callback function for {L.SpectrumSpatial.Request}
         *
         * @callback L.SpectrumSpatial.Request.Callback
         * @param {Object} error Error object, with fieds code and message
         * @param {Object} response Response
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
                  if (contentType.indexOf('application/json') !== -1 ){
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
        * Request get options
        * @typedef {Object} L.SpectrumSpatial.Request.GetOptions
        * @property {string} [login]  Login
        * @property {string} [password]  Password
        * @property {string} [responseType] Type of response (only for XHR2)
        */
        
        /**
        * Runs get request
        * @param {string} url Url for request
        * @param {Request.Callback} callback function, when request is done
        * @param {Object} [context] Context for callback
        * @param {L.SpectrumSpatial.Request.GetOptions} [options] Options 
        * @returns {XMLHttpRequest}
        */
        get: function(url, callback, context, options){
            options = options || {};
            var httpRequest = this._createRequest(callback,context);
            httpRequest.open('GET', url , true, options.login, options.password);
            if (options.responseType){
                httpRequest.responseType = options.responseType;
            }
            httpRequest.send(null);
            return httpRequest;
        },
        
        /**
        * Runs get request by JSONP pattern 
        * @param {string} url Url for request
        * @param {string} callbackSeparator Special character to separate callback param from query param
        * @param {Request.Callback} callback function, when request is done
        * @param {Object} context Context for callback
        * @param {string} [callbackSeparator] Special character to separate callback param from query param
        * @returns {XMLHttpRequest}
        */
        jsonp: function(url, callback, context, callbackSeparator){
            var callbackId = 'c' + callbacks;
    
            if (!callbackSeparator){
                callbackSeparator='';
            }
    
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
        * Request post options
        * @typedef {Object} L.SpectrumSpatial.Request.PostOptions
        * @property {string} [login]  Login
        * @property {string} [password]  Password
        * @property {Object} [postData] Data to post
        * @property {string} [postType=application/json] Type of post data
        * @property {string} [responseType] Type of response (only for XHR2)
        */
        
        /**
        * Runs post request
        * @param {string} url Url for request
        * @param {Request.Callback} Callback function, when request is done
        * @param {object} context Context for callback
        * @param {L.SpectrumSpatial.Request.PostOptions} [options] Options for function
        * @returns {XMLHttpRequest}
        */
        post: function(url, callback, context, options ){       
            options = options || {};        
            if (!options.postType){
                options.postType = 'application/json';
            }

            var httpRequest = this._createRequest(callback,context);
            httpRequest.open('POST', url, true, options.login, options.password);
            
            httpRequest.setRequestHeader('Content-Type', options.postType);
            
            if (options.responseType){
                httpRequest.responseType = options.responseType;
            }
            
            httpRequest.send(options.postData);
            return httpRequest;
        }
    };
})();

;L.SpectrumSpatial.Services.Operation = L.Class.extend(
/** @lends L.SpectrumSpatial.Services.Operation.prototype */
{ 

  /**
  * Operation's options class
  * @typedef {Object}  L.SpectrumSpatial.Services.Operation.Options
  * @property {string} name Name of operation
  * @property {Object} getParams Params for get request
  * @property {Object} postParams Params for post request
  * @property {boolean} forcePost Is true if opertaion should use post request
  * @property {string} paramsSeparator Separator for get params in url
  * @property {string} queryStartCharacter Character from which query begins 
  * @property {string} postType Type of post data. Default is 'application/json'
  * @property {string} responseType Type of response data. Used for post response with image (only for XHR2)
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
  * @param {L.SpectrumSpatial.Services.Operation.Options} options Additional options of operation
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
  * @typedef {Object} L.SpectrumSpatial.Services.Service.Options
  * @property {string} [url] - Url of service
  * @property {string} [proxyUrl] - proxy url 
  * @property {boolean} [alwaysUseProxy=false] use proxy for get requests
  * @property {boolean} [forceGet=true] If true always use get request and do not use JSONP, if false and browser do not support CORS JSONP request will be executed
  * @property {boolean} [encodeUrlForProxy=false] - if true encode query url for using with proxy
  */


  options: {

  },

  /**
  * @class Base service class
  * @augments {L.Class} 
  * @constructs 
  * @param {string} url Url of service
  * @param {L.SpectrumSpatial.Services.Service.Options} [options] Additional options of service
  */
  initialize: function (url, options) {
      options =  {
	      alwaysUseProxy: L.SpectrumSpatial.Defaults.alwaysUseProxy,
	      forceGet : L.SpectrumSpatial.Defaults.forceGet,
	      encodeUrlForProxy: L.SpectrumSpatial.Defaults.encodeUrlForProxy,
	      url : url
	  };
       
      if ((options.proxyUrl===undefined) & (L.SpectrumSpatial.Defaults.proxyUrl!==undefined)){
	      options.proxyUrl = L.SpectrumSpatial.Defaults.proxyUrl;
      }
      
      L.Util.setOptions(this, options);
  },
  
  /**
  * Starts request to service
  * @returns {XMLHttpRequest}
  */
  startRequest: function(operation, callback,context){
      var urlWithQuery = this.getUrl(operation);
      var queryOptions = { 
	                            postData: operation.getPostData(), 
	                            postType: operation.getPostType(),
	                            responseType: operation.getResponseType(),
	                            login: this.options.login,
	                            password: this.options.password
	                        };
	  if (operation.isPostOperation()){
	      if (this.options.proxyUrl){
		      urlWithQuery = this.options.proxyUrl + this.checkEncodeUrl(urlWithQuery) ;
	      }      
		  return L.SpectrumSpatial.Request.post(urlWithQuery, 	                                       
		                                        callback, 
		                                        context,
		                                        queryOptions);
	  }
	  else{
	      if ((this.options.alwaysUseProxy)|(this.options.proxyUrl!== undefined)){
		      urlWithQuery = this.options.proxyUrl + this.checkEncodeUrl(urlWithQuery) ;
		      return L.SpectrumSpatial.Request.get(urlWithQuery, callback, context, queryOptions );
	      }
		  return ( this.options.forceGet | L.SpectrumSpatial.Support.CORS ) ? 
		             L.SpectrumSpatial.Request.get(urlWithQuery, callback, context, queryOptions):
		             L.SpectrumSpatial.Request.jsonp(urlWithQuery, callback, context, '?');
	  }
  },
  
  /**
  * Returns full url query for service
  * @param {L.SpectrumSpatial.Services.Operation} operation
  * @returns {string}
  */
  getUrl: function(operation){
      var urlQuery = this.clearParam(operation.getUrlQuery());     
	  var separator = (this.options.url.slice(-1) === '/') ? '' : '/';  
	  return this.options.url + separator +  urlQuery;
  },
  
  /**
  * Clears parameter from '/' at first or last letter
  * @param {string} param
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
  * @param {string} url
  * @returns {string}
  */
  checkEncodeUrl:function(url){
	  return  this.options.encodeUrlForProxy ? encodeURIComponent(url) : url;
  },
  
  
  needAuthorization:function(){
	  return (this.options.login!== undefined);
  }
  
});

L.SpectrumSpatial.Services.service = function(url,options){
  return new L.SpectrumSpatial.Services.Service(url,options);
};;/** 
* @class Spectrum Spatial Map Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.MapService
* @param {string} url Url of service
* @param {L.SpectrumSpatial.Services.Service.Options} [options] Additional options of service
*/
L.SpectrumSpatial.Services.MapService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.MapService# */
{     
    /**
    * Render options
	* @typedef {Object} L.SpectrumSpatial.Services.MapService.RenderOptions
    * @property {string} mapName Name of map to render
    * @property {string} [imageType=png] Type of image ( png, jpg etc.) 
    * @property {number} width Width of rendered image
    * @property {number} height Height of rendered image
    * @property {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    * @property {number} cx Center x coordinate 
    * @property {number} cy Center y coordinate 
    * @property {number} scale Scale
    * @property {number} zoom Zoom
    * @property {string} srs Reference system code
    * @property {number} [resolution] Resolution
    * @property {string} [locale] Locale
    * @property {string} [rd] The type of rendering to perform ( s (speed) or q (quality))
    * @property {string} [bc] The background color to use for the map image (RRGGBB)
    * @property {number} [bo] The opacity of the background color
    * @property {Object} [additionalParams] Additional parameters for post query
	*/
	
	/**
    * Legend options
	* @typedef {Object} L.SpectrumSpatial.Services.MapService.LegendOptions
    * @property {string} mapName Name of map for legend 
    * @property {number} width Width of the individual legend swatch in pixels
    * @property {number} height Height of the individual legend swatch in pixels
    * @property {string} [imageType=png] Type of image ( png, jpg etc.)
    * @property {boolean} [inlineSwatch=true] Determines if the swatch images are returned as data or URL to the image location on the server
    * @property {number} [resolution] Resolution
    * @property {string} [locale] Locale
    * @property {Object} [postData] If specified runs post request to render legend
	*/
	
	/**
    * Legend's swatch options
	* @typedef {Object} L.SpectrumSpatial.Services.MapService.SwatchOptions
    * @property {string} mapName Name of map for legend 
    * @property {number} legendIndex The legend to get the swatch from in the named map
    * @property {number} rowIndex The swatch location (row) within the legend
    * @property {number} width Width of the individual legend swatch in pixels
    * @property {number} height Height of the individual legend swatch in pixels
    * @property {string} [imageType=png] Type of image ( png, jpg etc.)
    * @property {number} [resolution] Resolution
    * @property {string} [locale] Locale
	*/

    /**
    * Lists all named layers which map service contains
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] Locale of response 
    */
    listNamedLayers : function(callback, context, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('layers.json');
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describes specified layer
    * @param {string} layerName name of layer
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] Locale of response 
    */
    describeNamedLayer : function(layerName, callback, context, locale){  
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
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] Locale of response 
    */
    listNamedMaps : function(callback, context, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('maps.json');
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describes specified map
    * @param {string} mapName name of map
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] Locale of response 
    */
    describeNamedMap : function(mapName, callback, context, locale ){  
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
    
    
    _createRenderOperation:function (options){
       
        var mapName = this.clearParam(options.mapName);
        if (mapName !== ''){
	        mapName = '/'+mapName;
        }
        
        if (!options.imageType){
	        options.imageType = 'png';
        }
        
	    var operation = new L.SpectrumSpatial.Services.Operation('maps'+ mapName+'/image.' + options.imageType , { responseType: 'arraybuffer' } );
	    operation.options.getParams.w = options.width;
	    operation.options.getParams.h = options.height;
	    if (options.bounds){
		    operation.options.getParams.b= options.bounds.join(',')+ ',' + options.srs;
	    }
	    else{
		    operation.options.getParams.c= options.cx+ ',' +options.cy + ',' + options.srs;
	    }
	    
	    if (options.scale){
		    operation.options.getParams.s = options.scale;
	    }
	    
	    if (options.zoom){
		    operation.options.getParams.z = options.zoom;
	    }
	    
	    this._addResolutionAndLocale(operation, options.resolution, options.locale);
	    
	    if (options.rd){
		    operation.options.getParams.rd = options.rd;
	    }
	    
	    if (options.bc){
		    operation.options.getParams.bc = options.bc;
	    }
	    
	    if (options.bo){
		    operation.options.getParams.bc = options.bc;
	    }
	    
	    if (options.additionalParams){
		    operation.options.postParams = options.additionalParams;
	    }
	    
	    return operation;	    
    },
 
    _addResolutionAndLocale: function(operation,resolution, locale){
	    if (resolution){
		    operation.options.getParams.r = resolution;
	    }
	    
	    if (locale){
		    operation.options.getParams.l = locale;
	    }
    },
    
    /**
    * Runs rendering map 
    * @param {L.SpectrumSpatial.Services.MapService.RenderOptions} options Render options
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    renderMap: function(options, callback, context){
	    var operation = this._createRenderOperation(options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns url of image for get request
    * @param {L.SpectrumSpatial.Services.MapService.RenderOptions} options Render options
    * @returns {string}
    */
    getUrlRenderMap: function(options){
	    var operation = this._createRenderOperation(options);
	    return (this.options.alwaysUseProxy ? this.options.proxyUrl : '') +  this.checkEncodeUrl(this.getUrl(operation));
    },
        
    /**
    * Runs legend request
    * @param {L.SpectrumSpatial.Services.MapService.LegendOptions} options Options for legend
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    getLegendForMap: function(options, callback, context){
	    if (!options.imageType){
		    options.imageType = 'png';
	    }
	    var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ this.clearParam(options.mapName)+'/legends.json');
	    
	    operation.options.getParams.w = options.width;
	    operation.options.getParams.h = options.height;
	    operation.options.getParams.t = options.imageType;
	    this._addResolutionAndLocale(operation,options.resolution,options.locale);
	    
	    // I WANT TO KILL PB DEVELOPERS FOR THIS '?' IN QUERY
	    
	    if (options.inlineSwatch!== undefined ){
		    operation.options.getParams['?inlineSwatch'] = options.inlineSwatch;
	    }
	    if (options.postData){
		    operation.options.postParams = options.postData;
		    operation.options.responseType =  'arraybuffer';
	    }
	    this.startRequest(operation, callback, context);
    },
    
    _createSwatchOperation: function(options){
	    if (!options.imageType){
		    options.imageType = 'png';
	    }
	    var operation = new L.SpectrumSpatial.Services.Operation('maps/'+ this.clearParam(options.mapName)+
	                                                            '/legends/'+options.legendIndex + 
	                                                             '/rows/' + options.rowIndex + 
	                                                             '/swatch/' + options.width + 'x' + options.height + '.' + options.imageType);
	                                                             
	    this._addResolutionAndLocale(operation,options.resolution,options.locale);
	    return operation;
    },
    
    /**
    * Runs request for an individual swatch for a layer of a named map
    * @param {L.SpectrumSpatial.Services.MapService.SwatchOptions} options Options for swatch
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    getSwatchForLayer: function(options, callback, context){
	    this.startRequest( this._createSwatchOperation(options), callback, context);
    },
    
    /**
    * Returns an individual swatch for a layer of a named map
    * @param {L.SpectrumSpatial.Services.MapService.SwatchOptions} options Options for swatch
    * @returns {string}
    */
    getUrlSwatchForLayer: function(options){
	    return this.getUrl(this._createSwatchOperation(options));
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
    * @param {string} [imageType=png] Specifies the response image format. Must be png, gif, or jpeg.
    */
    getTileUrl: function(mapName,level,x,y,imageType){
	    if (!imageType){
		    imageType='png';
	    }
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        return (this.options.alwaysUseProxy ? this.options.proxyUrl : '') +  this.checkEncodeUrl(this.getUrl(operation));
    },
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [imageType=png] Specifies the response image format. Must be png, gif, or jpeg.
    */
    getTile: function(mapName, level, x, y, callback, context, imageType){
	    if (!imageType){
		    imageType='png';
	    }
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
	    return new L.SpectrumSpatial.Services.Operation(mapName+'/'+level+'/' + x + ':' + y + '/tile.' + imageType, { responseType: 'arraybuffer' }  );
    }
    
    
});

L.SpectrumSpatial.Services.tileService = function(url,options){
  return new L.SpectrumSpatial.Services.TileService(url,options);
};;/** 
* @class Spectrum Spatial Feature Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.FeatureService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.FeatureService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.FeatureService# */
{
    /**
    * List all Available Tables
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] The locale in which to return the table information.
    */
    tableList : function(callback, context,locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables.json');
        if (locale){
		    operation.options.getParams.l = locale;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Total number of all Available Tables
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] The locale in which to return the table information.
    */
    count : function(callback, context,locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/count');
        if (locale){
		    operation.options.getParams.l = locale;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Count features operation options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.FeatureCountOptions
    * @property {string} [q] The query method to perform. This must be searchAtPoint 
    * @property {string} [point] The point used as the starting location for the search. For example: point=-75.651157,45.374245,EPSG:4326
    * @property {string} [tolerance] The distance to search around the point. By default the tolerance is 300 meters
    * @property {string} [geometryAttributeName] The geometry definition attribute from the table that should be used for processing the spatial query. This attribute is only required for tables that contain more than one geometry attribute definition.
    * @property {string} [l] The locale in which to return the table information
	*/
    
    /**
    * Number of Features in a Table
    * @param {string} tableName The name of the table to return feature metadata
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.FeatureCountOptions} [options] Additional options
    */
    featureCount : function(tableName, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features/count',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describe a Table's Metadata
    * @param {string} tableName The name of the table to return metadata
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] The locale in which to return the table information.
    */
    describe : function(tableName, callback, context, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/metadata.json');
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Insert a Feature into a Table
    * @param {string} tableName The name of the table to insert the features
    * @param {Object} features Features to insert
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {integer} [commitInterval] The number of inserts that will be processed in a transaction
    */
    insert : function(tableName, features, callback, context, commitInterval){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.action = 'insert';
        if (commitInterval){
	        operation.options.getParams.commitInterval = commitInterval;
        }
        operation.options.postParams = features;
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * SearchAtPoint function's options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.SearchAtPointOptions
    * @property {string} [attributes] The attribute names of the table to be returned in the response.
    * @property {string} [orderBy] The attribute name and direction to order the returned results
    * @property {string} [tolerance] The distance to search around the point. By default the tolerance is 300 meters
    * @property {string} [geometryAttributeName] The geometry definition attribute from the table that should be used for processing the spatial query  
    * @property {string} [page] The page number to return   
    * @property {string} [pageLength] The number of features returned on each page 
    * @property {string} [l] The locale in which to return the table information
	*/
    
    /**
    * Search a Table for Features at a Point
    * @param {string} tableName The name of the table to insert the features
    * @param {Object} point Point. example { x:'1',y:'1'}
    * @param {string} srs Reference system code. Example 'EPSG:4326'
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.SearchAtPointOptions} [options] Additional options
    */
    searchAtPoint : function(tableName, point, srs, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = 'searchAtPoint';
        operation.options.getParams.point = point.x + ',' + point.y + ',' + srs;
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * SearchNearest function's options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.SearchNearestOptions
    * @property {string} [attributes] The attribute names of the table to be returned in the response.
    * @property {string} [orderBy] The attribute name and direction to order the returned results
    * @property {string} [withinDistance] The distance to search around the geometry. By default the search distance is 300 meters
    * @property {string} [distanceAttributeName] The name of the distance attribute to be returned in the response.
    * @property {string} [geometryAttributeName] The geometry definition attribute from the table that should be used for processing the spatial query  
    * @property {string} [page] The page number to return   
    * @property {string} [pageLength] The number of features returned on each page 
    * @property {string} [l] The locale in which to return the table information
    * @property {string} [maxFeatures] The total number of features returned in the response. By default this value is 1000 features
	*/
    
    /**
    * Search a Table for Features Nearest to a Geometry
    * @param {string} tableName The name of the table to insert the features
    * @param {Object} geometry Geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.SearchNearestOptions} [options] Additional options
    */
    searchNearest : function(tableName, geometry, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = 'searchNearest';
        operation.options.getParams.geometry = JSON.stringify(geometry);
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Search for Features by ID
    * @param {string} tableName The name of the table to insert the features
    * @param {string} id Identifier
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [attributes] The attribute names of the feature to be returned in the response
    * @param {string} [locale] The locale in which to return the table information
    */
    searchId : function(tableName, id, callback, context, attributes, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json' + 
															     ((attributes) ? (';attributes='+attributes) : '' ) +
															     ((locale) ? (';l='+locale) : '' ) +
																 '/'+ id );
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * SearchSQL function's options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.SearchSQLOptions
    * @property {string} [page] The page number to return   
    * @property {string} [pageLength] The number of features returned on each page 
    * @property {string} [l] The locale in which to return the table information
	*/
    
    /**
    * Search for Features Using SQL Queries
    * @param {string} query The query to perform in SQL format.
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.SearchSQLOptions} [options] Additional options
    */
    searchSQL : function( query , callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = query;
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Update Features by Primary Key
    * @param {string} tableName The name of the table for which you are updating features
    * @param {Object} features Features to update
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {integer} [commitInterval] The number of inserts that will be processed in a transaction
    */
    update : function(tableName, features, callback, context, commitInterval){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.action = 'update';
        if (commitInterval){
	        operation.options.getParams.commitInterval = commitInterval;
        }
        operation.options.postParams = features;
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Update Features Using SQL
    * @param {string} query SQL query
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {Object} [boundParams] Bound parameters
    * @param {string} [locale] The locale in which to return the table information
    */
    updateSQL : function(query, callback, context, boundParams, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.update = query;
        if (locale){
	        operation.options.getParams.l = locale;
        }
        if (boundParams){
	        operation.options.postParams = boundParams;
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    
});

L.SpectrumSpatial.Services.featureService = function(url,options){
  return new L.SpectrumSpatial.Services.FeatureService(url,options);
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

	    if (this.options.zIndex==='auto'){
		    var maxZIndex = 0;
		    for (var i in map._layers){
			    var layer = map._layers[i];
			    if (layer.getZIndex){
				    var z = layer.getZIndex();
				    if (maxZIndex<z){
					    maxZIndex = z;
				    }
			    }
		    }
		    this.options.zIndex = maxZIndex+1;
	    }
	    
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
	
	getOpacity: function () {
		return this.options.opacity;
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
	    
	    var renderOptions = {
		    mapName : this._mapName ,
		    imageType : this.options.imageType,
		    width: size.x,
		    height: size.y,
		    bounds :[ nw.x, nw.y, se.x,se.y ],
		    srs:this._srs.code,
		    additionalParams : this._postData
	    };
		
		if ((this._postData!==undefined)|(this._service.needAuthorization())){
			this._service.renderMap(
							                renderOptions,
							                this._postLoad,
							                {
								                context: this, 
								                image: newImage, 
								                bounds:bounds, 
								                counter:this._requestCounter
								            });
		}
		else{
		    newImage.onload = L.bind(this._afterLoad, this, { image: newImage, bounds:bounds, counter:this._requestCounter});
			newImage.src = this._service.getUrlRenderMap(renderOptions);              
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
    * @property {string} imageType tile image type 
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
		crossOrigin: false,
		imageType: 'png'
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

		if (this.options.crossOrigin) {
			tile.crossOrigin = '';
		}

		/*
		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
		 http://www.w3.org/TR/WCAG20-TECHS/H67
		*/
		tile.alt = '';
		tile.onerror = L.bind(this._tileOnError, this, done, tile);
		
		if (this._service.needAuthorization()){
			this._service.getTile(this._mapName,
		                          this._getZoomForUrl()+1,
		                          coords.x + 1,
		                          (this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y) + 1,
		                          this._postLoad,
		                          { context : this, image: tile , done : done },
		                          this.options.imageType);
		}
		else{
			tile.onload = L.bind(this._tileOnLoad, this, done, tile);		   
		    tile.src = this.getTileUrl(coords);
		}
		


		return tile;
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
	    
	    this.context._tileOnLoad.call(this.context, this.done, this.tile);
	},

	getTileUrl: function (coords) {
		return this._service.getTileUrl(
		                          this._mapName,
		                          this._getZoomForUrl()+1,
		                          coords.x + 1,
		                          (this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y) + 1  ,
		                          this.options.imageType);
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
/** @lends L.SpectrumSpatial.Controls.Layers.prototype */	

    className: 'leaflet-ss-control-layers',
    
    /**
    * Layers control options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Layers.Options
    * @property {string} [position] Control position in map
    * @property {boolean} [cssOff] If is true, control rednders without css class ( usefull when you draw outside of the map)
    * @property {boolean} [autoZIndex] If true, Zindexes to overlays will be set automaticly 
    * @property {boolean} [zIndexControls] If true zIndex controls is enabled
    * @property {boolean} [opacityControls] If true opacity controls is enabled
    * @property {boolean} [legendControls] If true legend controls is enabled
    * @property {L.SpectrumSpatial.Controls.Legend.Options} [legendOptions] Options for legend (if legend controls is enabled)
    * @property {Object} [legendContainer] DOM element, if we want to draw legend outside of layers control
    * @property {boolean} [inverseOrder=false] If true, upper layer in control is upper on map ( max Z index)
    */
    
	options : {
		zIndexControls:true,
		opacityControls:true,
		legendControls:true,
		legendOptions : {},
		legendContainer :null,
		inverseOrder:false
	},
	
	/**
	* @class Layers control
	* @augments {L.Control} 
	* @constructs L.SpectrumSpatial.Controls.Layers
	* @param {Object} baseLayers Object which contans base layers ( { "title":layer } )
	* @param {Object} overlays Object which contans overlays layers ( { "title":layer } )
	* @param {L.SpectrumSpatial.Controls.Layers.Options} [options] Options
	*/
	initialize: function (baseLayers, overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		if (!this.options.legendOptions){
			this.options.legendOptions = {  };
		}
		if (this.options.legendOptions.cssOff === undefined){
			this.options.legendOptions.cssOff = true;
		}
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
	
	addTo: function (map, outsideContainer) {
		this.remove();
		this._map = map;

        
		var container = this._container = this.onAdd(map);
		
		if (outsideContainer){
            outsideContainer.appendChild(container);
		}
		else{
			L.DomUtil.addClass(container, 'leaflet-control');
			var pos = this.getPosition();
			var corner = map._controlCorners[pos];

			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}	
		}

		return this;
	},
	
	_addLayer: function (layer, name, overlay) {
		layer.on('add remove', this._onLayerChange, this);

		if (overlay && this.options.autoZIndex && layer.setZIndex) {
			this._maxZIndex++;
			layer.setZIndex(this._maxZIndex);
		}
		
		if (overlay && !this.options.autoZIndex){
			if (layer.getZIndex){
				var z = layer.getZIndex();
				if (this._minZIndex>z){
					this._minZIndex = z;
				}
				if (this._maxZIndex<z){
					this._maxZIndex = z;
				}
			}
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
		
		overlays.sort(L.SpectrumSpatial.Utils.sortByProperty('z',(this.options.inverseOrder)? "desc" :  "asc" ));
		
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
		
		var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', this.className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent.on(container, {
					mouseenter: this._expand,
					mouseleave: this._collapse
				}, this);
			}

			var link = this._layersLink = L.DomUtil.create('a', 'leaflet-control-layers-toggle' , container);
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

		this._baseLayersList = L.DomUtil.create('div', this.className + '-base', form);
		this._separator = L.DomUtil.create('div', this.className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', this.className + '-overlay', form);

		container.appendChild(form);
	},
	
	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-ss-cell leaflet-ss-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},
	
    _addItem: function (obj) {
	    var layerItem = L.DomUtil.create('div','leaflet-ss-rowcontainer');
	    var row = L.DomUtil.create('div','leaflet-ss-row',layerItem);
	    var checked = this._map.hasLayer(obj.layer);
	    var input;
	    

		if (obj.overlay) {
			input = L.DomUtil.create('input', 'leaflet-ss-cell leaflet-control-layers-selector');
			input.name = 'visibilityInput';
			input.type = 'checkbox';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('visibilityInput', checked);
		}
		input.layerId = L.stamp(obj.layer);
		L.DomEvent.on(input, 'click', this._onVisibilityChanged, this);

		var name = L.DomUtil.create('span','leaflet-ss-cell leaflet-ss-control-layers-title');
		name.innerHTML = ' ' + obj.name;
        
		row.appendChild(input);
		
		if (obj.overlay) {
			
			if (this.options.zIndexControls){
				row.appendChild(this._createZIndexButton('up', obj.layer, input.layerId ));
				row.appendChild(this._createZIndexButton('down', obj.layer, input.layerId ));
			}  
			
            if (this.options.legendControls){
	            var legend = L.DomUtil.create('div','leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-legend');
				legend.layerId = input.layerId;
				L.DomEvent.on(legend, 'click', this._onLegendClick, this);
				row.appendChild(legend);	
				if (this.options.legendContainer){
					obj.legendContainer = this.options.legendContainer;
				}
				else{
					obj.legendContainer = document.createElement('div','leaflet-ss-row');
			        layerItem.appendChild(obj.legendContainer);
				}
            }
			if (this.options.opacityControls){
				var opacity = L.DomUtil.create('input','leaflet-ss-cell leaflet-ss-control-layers-input');
				opacity.type = 'text';
				opacity.name = 'opacityInput';
				opacity.value = (obj.layer.getOpacity)? obj.layer.getOpacity(): this.options.opacity;
				opacity.layerId = L.stamp(obj.layer);
				L.DomEvent.on(opacity, 'input', this._onOpacityChanged, this);
				row.appendChild(opacity);
			}
		}

		row.appendChild(name);
		
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(layerItem);
		
        obj.container = layerItem;
		return layerItem;
	},
	
	_createZIndexButton:function(displayDirection, layer, layerId ){
		var className = 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-' + displayDirection;
		var realDirection = ((displayDirection === 'up' & this.options.inverseOrder) | 
		                     (displayDirection === 'down' & !this.options.inverseOrder)) ? 'up':'down';
		var clickFunction = ( realDirection ==='up' ) ? this._onUpClick : this._onDownClick;
		var disableIndex = ( realDirection ==='up' )?  this._maxZIndex:this._minZIndex;
		var btn = L.DomUtil.create('div', className);
		btn.layerId = layerId;
		L.DomEvent.on(btn, 'click', clickFunction , this);
		if (layer.getZIndex()=== disableIndex){
			L.DomUtil.addClass(btn, 'leaflet-ss-disabled');
		}
		
		return btn;
	},
	
	_onLegendClick: function(e) {
		var layerId = e.currentTarget.layerId;
		var lo = this._layers[layerId];
		var legend;
		if (!this.options.legendContainer) {
			if (lo.legendContainer.hasChildNodes()){
				L.DomUtil.empty(lo.legendContainer);
			}
			else{
			    legend = new L.SpectrumSpatial.Controls.Legend(lo.layer._service,lo.layer._mapName,this.options.legendOptions);
			    legend.addTo(this._map , this.options.legendContainer ? this.options.legendContainer : lo.legendContainer);				
			}		
		}
		else{			
		    legend = new L.SpectrumSpatial.Controls.Legend(lo.layer._service,lo.layer._mapName,this.options.legendOptions);
			legend.addTo(this._map , this.options.legendContainer ? this.options.legendContainer : lo.legendContainer);
		}
	},
	
	_onDownClick: function(e) {
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
	
	_onUpClick: function(e) {
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
		var inputs = L.SpectrumSpatial.Utils.getElementsByName(this._container,'visibilityInput');   //document.getElementsByName('visibilityInput'),
		var   input, layer, hasLayer;
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
		var inputs =L.SpectrumSpatial.Utils.getElementsByName(this._container,'opacityInput'); //document.getElementsByName('opacityInput');
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
	},
	
	_expand: function () {
		L.DomUtil.addClass(this._container, this.className + '-expanded');
	},

	_collapse: function () {
		L.DomUtil.removeClass(this._container, this.className + '-expanded');
	}
	
});

L.SpectrumSpatial.Controls.layers = function(baselayers, overlays,options){
	return new L.SpectrumSpatial.Controls.Layers(baselayers, overlays,options);
};;L.SpectrumSpatial.Controls.Legend = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Legend.prototype */	
	
	className: 'leaflet-ss-control-legend',
	
	/**
    * Legend's options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Legend.Options
    * @property {string} position Control position in map
    * @property {boolean} hasCartographic If is false, cartographic legend will be ignored
    * @property {boolean} cssOff If is true, control rednders without css class ( usefull when you draw outside of the map)
    * @property {number} width Width of the individual legend swatch in pixels
    * @property {number} height Height of the individual legend swatch in pixels
    * @property {string} [imageType=png] Type of image ( png, jpg etc.)
    * @property {boolean} [inlineSwatch=true] Determines if the swatch images are returned as data or URL to the image location on the server
    * @property {number} [resolution] Resolution
    * @property {string} [locale] Locale
    * @property {Object} [postData] If specified runs post request to render legend
    */
	
	options: {
		position: 'bottomright',
		width:16,
		height:16,
		imageType:'png',
		hasCartographic:true
	},

	/**
	* @class Legend control
	* @augments {L.Control} 
	* @constructs L.SpectrumSpatial.Controls.Legend
	* @param {L.SpectrumSpatial.Services.MapService} service Map service for legend
	* @param {string} mapName Map's name for legend
	* @param {L.SpectrumSpatial.Controls.Legend.Options} [options] Options
	*/
	initialize: function (service, mapName, options) {
		L.setOptions(this, options);
        this._service = service;
        this.options.mapName = mapName;
	},

	/**
	* Adds control to map
	* @param {L.Map} map Map for control
	* @param {Object} [outsideContainer] DOM element, if specified control renders in it, not in map
	*/
	addTo: function (map, outsideContainer) {
		this.remove();
		this._map = map;

        
		var container = this._container = this.onAdd(map);
		
		if (outsideContainer){
			L.DomUtil.empty(outsideContainer);
            outsideContainer.appendChild(container);
		}
		else{
			L.DomUtil.addClass(container, 'leaflet-control');
			var pos = this.getPosition();
			var corner = map._controlCorners[pos];
	
			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}	
		}

		return this;
	},
	
	onAdd: function () {
		this._initLayout();
		this._requestLegend();
		return this._container;
	},
	
	_requestLegend: function(){
		this._service.getLegendForMap(this.options,this._legendCallback, this);
		L.DomUtil.empty(this._legendList);
		var waitImage = L.DomUtil.create('div','leaflet-ss-wait');
		this._legendList.appendChild(waitImage);
	},
	
	_legendCallback: function(error,response){
		if (!error){
			this._legend = response.LegendResponse;	
			this._update();
		}
	},
	
		
	_update: function () {
		if (!this._container) { return this; }
        if (!this._legend) { return this; }
        
		L.DomUtil.empty(this._legendList);

        for(var i in this._legend){
	        obj = this._legend[i];
	        
	        if ((!this.options.hasCartographic) && (obj.type === 'CARTOGRAPHIC')) {
		        continue;
	        }
	        
	        var layerBlock = L.DomUtil.create('div','leaflet-ss-control-legend-layer');
	        var title = L.DomUtil.create('div','leaflet-ss-row leaflet-ss-control-legend-title');
	        title.innerHTML = obj.title;
	        layerBlock.appendChild(title);
	        
	        for (var j in obj.rows){
		        row = obj.rows[j];
		        var divRow = L.DomUtil.create('div', 'leaflet-ss-row');
		        var swatchDiv = L.DomUtil.create('div', 'leaflet-ss-cell');
		        var swatch = L.DomUtil.create('img','',swatchDiv);
		        swatch.src = row.swatch;
		        var description = L.DomUtil.create('div', 'leaflet-ss-cell');
		        description.innerHTML = row.description;
		        divRow.appendChild(swatchDiv);
		        divRow.appendChild(description);
		        layerBlock.appendChild(divRow);
	        }
	        this._legendList.appendChild(layerBlock);
        }        
		return this;
	},
	
	
	_initLayout: function () {
		var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
		this._legendList = L.DomUtil.create('div', this.className + '-list', container);
	},
});

L.SpectrumSpatial.Controls.legend = function(service, mapName, options){
	return new L.SpectrumSpatial.Controls.Legend(service, mapName, options);
};;L.SpectrumSpatial.Controls.Feature = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Feature.prototype */	
	
	className: 'leaflet-ss-control-feature',
	
	/**
    * Feature control options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Feature.Options
    * @property {number} [pixelTolerance=0] Tolerance in pixels on map
    * @property {Array.<string>} [hideTypes] Array of column's types which should be hided
    * @property {boolean} [showIfEmpty] If true - shows popup every time on response (even response has no features)
    * @property {boolean} [useDefaultProjection] Use EPSG:4326 coordinates in spatial queries
    */
	
	options: {
		pixelTolerance:0,
		hideTypes: ['Geometry','Style'],
		showIfEmpty:false,
		useDefaultProjection: true
	},
	
	/**
    * Type to describe feature layer to control
    * @typedef {Object} L.SpectrumSpatial.Controls.Feature.FeatureLayer
    * @property {string} tableName Name of the table in feature service
    * @property {string} title Title of table
    * @property {L.SpectrumSpatial.Services.FeatureService.SearchAtPointOptions} options Options to query
    */
	
	/**
	* @class Feature control
	* @augments {L.Control} 
	* @constructs L.SpectrumSpatial.Controls.Feature
	* @param {L.SpectrumSpatial.Services.FeatureService} service Feature service 
	* @param {Array.<L.SpectrumSpatial.Controls.Feature.FeatureLayer>} featureLayers Described feature layers
	* @param {L.SpectrumSpatial.Controls.Feature.Options} [options] Options
	*/
	initialize: function (service, featureLayers, options) {
		L.setOptions(this, options);
        this._service = service;
        this._featureLayers = featureLayers;
	},
	
	
	/**
	* Adds control to map
	* @param {L.Map} map Map for control
	*/
	addTo: function (map) {
		this.remove();
		this._map = map;

        
		var container = this._container = this.onAdd(map);
		
		L.DomUtil.addClass(container, 'leaflet-control');
		var pos = this.getPosition();
		var corner = map._controlCorners[pos];

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}	
		
		return this;
	},
	
	onAdd: function () {
		var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
		this._featureInfo = L.DomUtil.create('div','leaflet-ss-control-feature-info');
		L.DomEvent.on(this._featureInfo , 'click', this._onFeatureInfoClick, this);
		container.appendChild(this._featureInfo );
		return this._container;
	},
	
	_onFeatureInfoClick: function(e){
		this.setActive(!this._active);
		L.DomEvent.stopPropagation(e);
	},
	
	_getFeatureInfo:function(e){
		if (!this._waitImage){
			this._waitImage = L.DomUtil.create('div','leaflet-ss-wait');
		}
		this._featureInfo.style.display="none";
		this._container.appendChild(this._waitImage);
		
		var queryCollector= { position: e.latlng, all: this._featureLayers.length, requested: [], hasFeatures:false };
		var point =  e.layerPoint;
		var crs = map.options.crs.code;
		
		if (this.options.useDefaultProjection){
			crs =  'EPSG:4326';
			point =  { x: e.latlng.lng, y:e.latlng.lat } ;
		}
		var tolerance;
		if (this.options.pixelTolerance!==0){
			tolerance = Math.round(L.SpectrumSpatial.Utils.countPixelDistance(this._map,this.options.pixelTolerance,e.latlng));
		}
		
		
		for (var i in this._featureLayers){
			var featureLayer = this._featureLayers[i];
			var options = L.SpectrumSpatial.Utils.merge({},featureLayer.options);
			
			if ((featureLayer.options.tolerance===undefined) & (tolerance!==undefined)){
				options.tolerance =  tolerance + ' m';
			}
		
			this._service.searchAtPoint(featureLayer.tableName, 
			                             point,
			                             crs,
			                            this._serviceCallback, 
			                            { context:this, collector: queryCollector, layerSettings: featureLayer}, options);
		}
		
	},
	
	
	
	_serviceCallback:function(error,response){
		
		var collector = this.collector;
		
		if ((response.features) && (response.features.length>0)){
			collector.hasFeatures = true;
		}
		
		collector.requested.push({ layerSettings:this.layerSettings, data: response });
		
		if (collector.all === collector.requested.length){
			this.context._queryEnded.call(this.context,collector);
		}
	},
	
	_queryEnded:function(collector){
	    this._featureInfo.style.display="block";
		this._container.removeChild(this._waitImage);
		
		this._clearPopup();
		
		
		if (!(this.options.showIfEmpty | collector.hasFeatures)){
			return;
		}
		
		this._popup = L.popup()
		    .setLatLng(collector.position)
		    .setContent(this.getPopupHtmlContent(collector.requested))
		    .openOn(this._map);
	},
	
	getPopupHtmlContent:function(requestedData){
		var content ='';
		for(var i=0; i< requestedData.length;i++){
			var featureLayer = requestedData[i];
			
			if (!((featureLayer.data.features) && (featureLayer.data.features.length>0))){
				continue;
			}
			
			content += L.Util.template('<b>{title}</b><br/>',featureLayer.layerSettings);
			content+= '<table><thead><tr>';
			
			var visibleColumns = [];
			
			for(var j in featureLayer.data.Metadata){
				var column = featureLayer.data.Metadata[j];
				if ( this.options.hideTypes.indexOf(column.type)===-1){
					visibleColumns.push(column.name);
					content+= L.Util.template('<th>{name}</th>',column);
				}
			}
			content+= '</tr></thead><tbody>';
			for(var k in featureLayer.data.features){
				var feature = featureLayer.data.features[k];
				content+= '<tr>';
				
				for(var c in visibleColumns){
					var cName = visibleColumns[c];
					content+= '<td>' + feature.properties[cName] + '</td>';
				}
				
				content+= '</tr>';
			}
			content+= '</tbody></table>';
			
		}
		
		
		return content;
	},
	
	_clearPopup: function(){
		if (this._popup){
			this._map.closePopup(this._popup);
			delete this._popup;
		}
	},
	
	setActive:function(isActive){
		this._active = isActive;
		//@TODO Add active class to DOM object
		if (isActive){
			this._map.on('click', this._getFeatureInfo, this);
			L.DomUtil.addClass(this._featureInfo , 'leaflet-ss-control-feature-activated');
		}
		else{
			this._clearPopup();
			this._map.off('click', this._getFeatureInfo, this);
			L.DomUtil.removeClass(this._featureInfo , 'leaflet-ss-control-feature-activated');
		}
		
	}
});

L.SpectrumSpatial.Controls.feature = function(service, featureLayers, options){
	return new L.SpectrumSpatial.Controls.Feature(service, featureLayers, options);
};