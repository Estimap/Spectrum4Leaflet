/**
 * Spectrum for leaftlet namespace
 * @namespace
 */
var Spectrum4Leaflet = {
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
  * Environment values
  * @namespace
  */
  Support: {
    CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
  }
};

if(typeof window !== 'undefined' && window.L){
  window.L.spectrum4L = Spectrum4Leaflet;
};/**
@classdesc Usefull utils
@constructor
*/
Spectrum4Leaflet.Util = {
    
};;(function(){
	var callbacks = 0;
	
	window._Spectrum4LeafletCallbacks = {};
	
	/**
	@classdesc Simple Wraper on XMLHttpRequest, has simple get and post functions
	@constructor
	*/
	Spectrum4Leaflet.Request = {
	
	    /**
		 * Callback function for {Spectrum4Leaflet.Request}
		 *
		 * @callback Request.Callback
		 * @param {Object} error Error object, with fieds code and message
		 * @param {Object} response Response
		 */
	
	
	    /**
	    Creates XMLHttpRequest and binds callbacks
	    @private
	    @returns {XMLHttpRequest}
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
			          response = httpRequest.responseText;
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
	    Runs get request
	    @param {string} url Url for request
	    @param {string} login Login 
	    @param {string} password Password 
	    @param {Request.Callback} Callback function, when request is done
	    @param {Object} context Context for callback
	    @returns {XMLHttpRequest}
	    */
	    get: function(url, login, password, callback, context){
	        var httpRequest = this._createRequest(callback,context);
		    httpRequest.open('GET', url , true, login, password);
	        httpRequest.send(null);
	        return httpRequest;
	    },
	    
	    /**
	    Runs get request by JSONP pattern 
	    @param {string} url Url for request
	    @param {Request.Callback} Callback function, when request is done
	    @param {Object} context Context for callback
	    @returns {XMLHttpRequest}
	    */
	    jsonp: function(url, callbackSeparator, callback,context){
		    var callbackId = 'c' + callbacks;
	
	        var script = L.DomUtil.create('script', null, document.body);
	        script.type = 'text/javascript';
	        script.src = url + callbackSeparator + "callback=window._Spectrum4LeafletCallbacks." + callbackId;
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
	    Runs post request
	    @param {string} url Url for request
	    @param {object} postdata Data to send in request body
	    @param {string} posttype Type of post data 
	    @param {string} login Login 
	    @param {string} password Password 
	    @param {Request.Callback} Callback function, when request is done
	    @param {object} context Context for callback
	    @returns {XMLHttpRequest}
	    */
	    post: function(url, postdata, posttype, login, password, callback,context){
	        var httpRequest = this._createRequest(callback,context);
	        httpRequest.open('POST', url, true, login, password);
	        httpRequest.setRequestHeader('Content-Type', posttype);
	        httpRequest.send(postdata);
	        return httpRequest;
	    }
	};
})();

;Spectrum4Leaflet.Services.Operation = L.Class.extend(
/** @lends Spectrum4Leaflet.Services.Operation.prototype */
{ 

  /**
  * Operation's options class
  * @typedef {Object}  Services.Service.Options
  * @property {string} name Name of operation
  * @property {Object} getParams Params for get request
  * @property {Object} postParams Params for post request
  * @property {boolean} forcePost Is true if opertaion should use post request
  * @property {string} paramsSeparator Separator for get params in url
  * @property {string} postType Type of post data. Default is "application/json"
  */

  /**
  @property {Options}  options 
  */
  options: {
      forcePost :false,
      paramsSeparator: ";",
      queryStartCharacter:";",
      postType : "application/json"
  },

  /**
  @classdesc Service operation class
  @constructs
  @param {string} name Name of operation
  @param {Options} options Additional options of operation
  */
  initialize: function(name,options) {
      this.options.getParams = {};
      this.options.postParams = {};
      options = options || {};
      options.name=name;
      L.setOptions(this, options);
  },
  
  /**
  Builds query for url by name and getParams of operation
  @returns {string}
  */
  getUrlQuery: function(){
      
      var keyValueArray = [];
  
      var params =  this.options.getParams;
      
	  for (var key in params){
          if(params.hasOwnProperty(key)){
             var param = params[key];
             
             keyValueArray.push(key + "=" + encodeURIComponent(param));
          }
      }
      var query = this.options.name;
      
      if (keyValueArray.length>0){
	      query+= this.options.queryStartCharacter + keyValueArray.join(this.options.paramsSeparator);
      }
      
      return query;
      
  },
  
  /**
  Creates string representation of postParams
  @returns {string}
  */
  getPostData: function(){
	  return JSON.stringify(this.options.postParams);
  },
  
  /**
  Creates string representation of postParams
  @returns {string}
  */
  getPostType: function(){
	  return this.options.postType;
  },
  
  /**
  Check if operation should use only post request
  @returns {boolean}
  */
  isPostOperation:function(){
	  return (Object.keys(this.options.postParams).length!==0) | this.options.forcePost;
  }
  
});;Spectrum4Leaflet.Services.Service = L.Class.extend(
/** @lends Spectrum4Leaflet.Services.Service.prototype */
{ 

  /**
  * Service's options class
  * @typedef {Object} Services.Service.Options
  * @property {string} url - Url of service
  * @property {string} proxyUrl - proxy url 
  * @property {string} alwaysUseProxy - use proxy for get requests
  * @property {string} forceGet - always do not use jsonp
  */

  /**
  @property {Services.Service.Options}  options 
  */
  options: {
      alwaysUseProxy:false,
      forceGet : false
  },

  /**
  @classdesc Base service class
  @constructs
  @param {string} url Url of service
  @param {Services.Service.Options} options Additional options of service
  */
  initialize: function (url, options) {
      options = options || {};
      options.url = url;
      L.Util.setOptions(this, options);
  },
  
  /**
  Starts request to service
  @returns {XMLHttpRequest}
  */
  startRequest: function(operation, callback,context){
      var urlWithQuery = this.getUrl(operation);
	  if (operation.isPostOperation()){
	      if (this.options.proxyUrl){
		      urlWithQuery = this.options.proxyUrl + "?" + urlWithQuery;
	      }
		  return Spectrum4Leaflet.Request.post(urlWithQuery, 
		                                       operation.getPostData(), 
		                                       operation.getPostType(),
		                                       this.options.login,
		                                       this.options.password,  
		                                       callback, 
		                                       context);
	  }
	  else{
	      if (this.options.alwaysUseProxy){
		      urlWithQuery = this.options.proxyUrl + "?" + urlWithQuery;
		      return Spectrum4Leaflet.Request.get(urlWithQuery, this.options.login,this.options.password, callback, context);
	      }
		  return ( this.options.forceGet | Spectrum4Leaflet.Support.CORS ) ? 
		             Spectrum4Leaflet.Request.get(urlWithQuery,this.options.login,this.options.password,  callback, context):
		             Spectrum4Leaflet.Request.jsonp(urlWithQuery,"?", callback, context);
	  }
  },
  
  /**
  Returns full url query for service
  @param {Spectrum4Leaflet.Services.Operation}
  @returns {string}
  */
  getUrl: function(operation){
      var urlQuery = this.clearParam(operation.getUrlQuery());     
	  var separator = (this.options.url.slice(-1) === "/") ? "" : "/";  
      return   this.options.url + separator +  urlQuery;
  },
  
  /**
  Clears parameter from "/" at first or last letter
  @param {string}
  @returns {string}
  */
  clearParam: function(param){
	  if (param[0]==="/"){
	      param = param.substring(1);
      }
      if (param.slice(-1) === "/") {
	      param = param.substring(0, param.length-1);
      }
      return param;
  }
  
});;/** 
@classdesc Spectrum Spatial Map Service wrapper
@class
@augments {Spectrum4Leaflet.Services.Service} 
*/
Spectrum4Leaflet.Services.MapService = Spectrum4Leaflet.Services.Service.extend(
/** @lends Spectrum4Leaflet.Services.MapService.prototype */
{     
    /**
    Lists all named layers which map service contains
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    listNamedLayers : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified layer
    @param {string} layerName name of layer
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedLayer : function(layerName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers/"+ this.clearParam(layerName) + ".json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified layers
    @param {Array.<string>} layerNames Array of layer's names
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedLayers : function(layerNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json", {  paramsSeparator : "&", queryStartCharacter : "?" } );
        
        var layersString = layerNames.join(",");
        if (layersString.length<1000){
	        operation.options.getParams.q = "describe";
	        operation.options.getParams.layers = layersString;
        } 
        else{
	        operation.options.postParams = { "Layers" : layerNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Lists all named maps which map service contains
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    listNamedMaps : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified map
    @param {string} mapName name of map
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedMap : function(mapName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+ ".json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified maps
    @param {Array.<string>} mapNames Array of map's names
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedMaps : function(mapNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json", { paramsSeparator : "&", queryStartCharacter : "?" } );
        
        var mapsString = mapNames.join(",");
        if (mapsString.length<1000){
	        operation.options.getParams.q = "describe";
	        operation.options.getParams.maps = mapsString;
        } 
        else{
	        operation.options.postParams = { "Maps" : mapNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    /**
    @private
    */
    _createRenderOperation:function (mapName, imageType,width,height,bounds,cx,cy,scale,zoom,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+"/image."+imageType);
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    if (bounds){
		    operation.options.getParams.b= bounds.join(",")+ "," + srs;
	    }
	    else{
		    operation.options.getParams.c= cx+ "," +cy + "," + srs;
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
    @private
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
    Runs rendering  map by bounds request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @param {Object} additionalParams Additional parameters for post query
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    renderMapByBounds: function(mapName, imageType,width,height,bounds,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, bounds,null,null,null,null,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns url of image (redered map by bounds) for get request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @returns {string}
    */
    getUrlRenderMapByBounds: function(mapName, imageType,width,height,bounds,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, bounds,null,null,null,null,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    Runs rendering  map by center and scale request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} scale Scale
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @param {Object} additionalParams Additional parameters for post query
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    renderMapByCenterScale: function(mapName, imageType,width,height,cx,cy,scale,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,scale,null,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns url of image (map by center and scale)  for get request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} scale Scale
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @returns {string}
    */
    getUrlRenderMapByCenterScale: function(mapName, imageType,width,height,cx,cy,scale,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,scale,null,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    Runs rendering  map by center and zoom request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} zoom Zoom
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @param {Object} additionalParams Additional parameters for post query
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    renderMapByCenterZoom: function(mapName, imageType,width,height,cx,cy,zoom,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,null,zoom,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns url of image (map by center and zoom)  for get request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} zoom Zoom
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @returns {string}
    */
    getUrlRenderMapByCenterZoom: function(mapName, imageType,width,height,cx,cy,zoom,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,null,zoom,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    Runs legend request
    @param {string} mapName The name of the map to return the legend.
    @param {number} width Width of the individual legend swatch in pixels
    @param {number} height Height of the individual legend swatch in pixels
    @param {string} imageType The type of images to return for the legend swatches(e.g., gif, png, etc)
    @param {boolean} inlineSwatch Determines if the swatch images are returned as data or URL to the image location on the server
    @param {number} resolution The DPI resolution of the legend swatches as an integer.
    @param {string} locale Locale
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    getLegendForMap: function(mapName ,width, height, imageType, inlineSwatch, resolution,locale,callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+"/legend.json");
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.t = imageType;
	    this._addResolutionAndLocale(operation,resolution,locale);
	    
	    // I WANT TO KILL PB DEVELOPERS FOR THIS "?" IN QUERY
	    if (inlineSwatch!==null){
		    operation.options.getParams["?inlineSwatch"] = inlineSwatch;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Runs request for an individual swatch for a layer of a named map
    @param {string} mapName The name of the map to return the swatch
    @param {number} legendIndex The legend to get the swatch from in the named map
    @param {number} rowIndex The swatch location (row) within the legend
    @param {number} width Width of the individual legend swatch in pixels
    @param {number} height Height of the individual legend swatch in pixels
    @param {number} resolution The DPI resolution of the swatch as an integer
    @param {string} locale The locale in which to render the swatch
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    getSwatchForLayer: function(mapName,legendIndex,rowIndex,width, height, imageType,resolution, locale, callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+
	                                                            "/legends/"+legendIndex + 
	                                                             "/rows/" + rowIndex + 
	                                                             "/swatch/" + width + "x" + height + "." + imageType);
	    this._addResolutionAndLocale(operation,resolution,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns an individual swatch for a layer of a named map
    @param {string} mapName The name of the map to return the swatch
    @param {number} legendIndex The legend to get the swatch from in the named map
    @param {number} rowIndex The swatch location (row) within the legend
    @param {number} width Width of the individual legend swatch in pixels
    @param {number} height Height of the individual legend swatch in pixels
    @param {number} resolution The DPI resolution of the swatch as an integer
    @param {string} locale The locale in which to render the swatch
    @returns {string}
    */
    getUrlSwatchForLayer: function(mapName,legendIndex,rowIndex,width, height, imageType,resolution, locale){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+
	                                                            "/legends/"+legendIndex + 
	                                                             "/rows/" + rowIndex + 
	                                                             "/swatch/" + width + "x" + height + "." + imageType);
	    this._addResolutionAndLocale(operation,resolution,locale);
	    return this.getUrl(operation);
    },
    
    //??????????? strange definition in Spectrum Spatial Guide
    renderLegend: function(mapName ,width, height, imageType, resolution,locale, inlineSwatch,callback, context){
	    //var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+"/legend.json");
    }
    
});;Spectrum4Leaflet.Layers.MapServiceLayer =  L.Layer.extend({

    options: {
		opacity: 1,
		alt: '',
		interactive: false,
		imageType: "png",
		zIndex: "auto",
		updateInterval:200,
	},

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

	_setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
			this.fire('loading');
		}
		return this;
	},

	_initImage: function () {
		var img = this._image = L.DomUtil.create('img',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		img.onselectstart = L.Util.falseFn;
		img.onmousemove = L.Util.falseFn;
        img.style.zIndex = this.options.zIndex;
		img.onload = L.bind(this._afterLoad, this);
		img.alt = this.options.alt;
		
		this.getPane(this.options.pane).appendChild(img);
		this._initInteraction();
	},
	
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
	
	_afterLoad: function () {  
	
		this.fire('load');
	 
	    this._bounds = this._map.getBounds();
	    this._size = this._map.getSize();
	    
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
	
	    if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}
	
	    this._setUrl(
	           this._service.getUrlRenderMapByBounds(
	                this._mapName , 
	                this.options.imageType,
	                size.x,
	                size.y,
	                [ nw.x, nw.y, se.x,se.y ], 
	                this._srs.code));
	},
	
	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	},
	
	_updateZIndex: function(){
		this._image.style.zIndex = this.options.zIndex;
	}	
	
});

