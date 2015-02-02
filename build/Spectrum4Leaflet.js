/**
 * Spectrum for leaftlet namespace
 * @namespace
 */
var Spectrum4Leaflet = {
  Version: '0.1',
  
  /**
  * Spectrum's services
  * @namespace
  */
  Services: {},
  
  
  Layers:{}
};

if(typeof window !== 'undefined' && window.L){
  window.L.spectrum4L = Spectrum4Leaflet;
};/**
@classdesc Usefull utils
@constructor
*/
Spectrum4Leaflet.Util = {
    
};;/**
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
    @param {Request.Callback} Callback function, when request is done
    @param {Object} context Context for callback
    @returns {XMLHttpRequest}
    */
    get: function(url, callback, context){
        var httpRequest = this._createRequest(callback,context);
	    httpRequest.open('GET', url , true);
        httpRequest.send(null);
        return httpRequest;
    },
    
    /**
    Runs post request
    @param {string} url Url for request
    @param {object} postdata Data to send in request body
    @param {Request.Callback} Callback function, when request is done
    @param {object} context Context for callback
    @returns {XMLHttpRequest}
    */
    post: function(url, postdata, callback,context){
        var httpRequest = this._createRequest(callback,context);
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(postdata);
        return httpRequest;
    }
};;Spectrum4Leaflet.Services.Operation = L.Class.extend(
/** @lends Spectrum4Leaflet.Services.Operation.prototype */
{ 

  /**
  * Operation's options class
  * @typedef {Object}  Services.Service.Options
  * @property {string} name - Name of operation
  * @property {Object} getParams - Params for get request
  * @property {Object} postParams - Params for post request
  * @property {boolean} forcePost - Is true if opertaion should use post request
  * @property {string} paramsSeparator - Separator for get params in url
  */

  /**
  @property {Options}  options 
  */
  options: {
      name : "",
      getParams :{},
      postParams :{},
      forcePost :false,
      paramsSeparator: ";",
      queryStartCharacter:";"
  },

  /**
  @classdesc Service operation class
  @constructs
  @param {string} name Name of operation
  @param {Options} options Additional options of operation
  */
  initialize: function(name,options) {
      options = options || {};
      options.name=name;
      L.Util.setOptions(this, options);
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
             
             keyValueArray.push(key + "=" + param);
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
  */

  /**
  @property {Services.Service.Options}  options 
  */
  options: {
  
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
		  return Spectrum4Leaflet.Request.post(urlWithQuery, operation.getPostData(), callback, context);
	  }
	  else{
		  return Spectrum4Leaflet.Request.get(urlWithQuery, callback, context);
	  }
  },
  
  /**
  Returns full url query for service
  @param {Spectrum4Leaflet.Services.Operation}
  @returns {string}
  */
  getUrl: function(operation){
	  var separator = (this.options.url.slice(-1) === "/") ? "" : "/";
      return this.options.url + separator +  operation.getUrlQuery();
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
        var operation = new Spectrum4Leaflet.Services.Operation("layers/"+ layerName);
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
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json", { paramsSeparator : "&", queryStartCharacter : "?" } );
        
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
        var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName);
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
	        operation.options.getParams.layers = mapsString;
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
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+"."+imageType);
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
    @param {number} resolution The DPI resolution of the legend swatches as an integer.
    @param {string} locale Locale
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    getLegendForMap: function(mapName ,width, height, imageType, resolution,locale, inlineSwatch,callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+"/legend.json");
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.t = imageType;
	    this._addResolutionAndLocale(operation,resolution,locale);
	    
	    // I WANT TO KILL PB DEVELOPERS FOR THIS "?" IN QUERY
	    if (inlineSwatch){
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
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+
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
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+
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
    
});;Spectrum4Leaflet.Layers.MapServiceLayer =  L.Class.extend({

    includes: L.Mixin.Events,

    options: {
        pane: 'overlayPane',
		opacity: 1,
		alt: '',
		interactive: false,
		imageType: "png"
	},

	initialize: function (serviceUrl, mapName, options) { 
		this._serviceUrl = serviceUrl;
		this._mapName = mapName;
		this._service = new Spectrum4Leaflet.Services.MapService(serviceUrl);
		this.on('load',this._reset,this);
		L.setOptions(this, options);
	},
	
	onAdd: function (map) {	
	    //this._layerAdd({ e: { target : map} });
	    this._map = map;
	    this._bounds = map.getBounds();
	    this._size = map.getSize();
	    this._srs = map.options.crs;
	    
	    var nw = this._srs.project(this._bounds.getNorthWest());
	    var se = this._srs.project(this._bounds.getSouthEast());
	    
	    this._url = this._service.getUrlRenderMapByBounds(this._mapName ,  this.options.imageType ,this._size.x,this._size.y,[ nw.x, nw.y, se.x,se.y ], this._srs.code);
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}
		
		map.on('moveend', this._update, this);
		
		this._zoomAnimated = map._zoomAnimated;

	

		if (this.getAttribution && this._map.attributionControl) {
			this._map.attributionControl.addAttribution(this.getAttribution());
		}

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}
 
		this.getPane(this.options.pane).appendChild(this._image);
		this._initInteraction();
		
	},

	onRemove: function () {
		L.DomUtil.remove(this._image);
	},
	
 	addTo: function(map){      
        map.addLayer(this);
        return this;
    },

	remove: function () {
		return this.removeFrom(this._map || this._mapToAdd);
	},

	removeFrom: function (obj) {
		if (obj) {
			obj.removeLayer(this);
		}
		return this;
	},
	
/*
	_layerAdd: function (e) {
		var map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		this.onAdd(map);

		if (this.getAttribution && this._map.attributionControl) {
			this._map.attributionControl.addAttribution(this.getAttribution());
		}

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	},
*/

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

	setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
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
	
	getPane: function (name) {
		return this._map._panes[name];
	},

	_initImage: function () {
		var img = this._image = L.DomUtil.create('img',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		img.onselectstart = L.Util.falseFn;
		img.onmousemove = L.Util.falseFn;

		img.onload = L.bind(this.fire, this, 'load');
		img.src = this._url;
		img.alt = this.options.alt;
	},

	_animateZoom: function (e) {
		var bounds = new L.Bounds(
			this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center));

		var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

		this.setTransform(this._image, offset, e.scale);
	},
	
	setTransform: function (el, offset, scale) {
		var pos = offset || new L.Point(0, 0);

		el.style[L.DomUtil.TRANSFORM] =
			'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
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
	   this._bounds = this._map.getBounds();
	   var nw = this._srs.project(this._bounds.getNorthWest());
	   var se = this._srs.project(this._bounds.getSouthEast());
	   this._size = this._map.getSize();	
	   this.setUrl(this._service.getUrlRenderMapByBounds(this._mapName , this.options.imageType ,this._size.x,this._size.y,[ nw.x, nw.y, se.x,se.y ], this._srs.code));
	   //this._reset();
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}	
	
});

