/**
 * Spectrum for leaftlet namespace
 * @namespace
 */
var Spectrum4Leaflet = {
  Version: '0.1',
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
  @property {Options}  options 
  */
  options: {
  
  },

  /**
  @classdesc Base service class
  @constructs
  @param {string} url Url of service
  @param {Options} options Additional options of service
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
  
  getUrl: function(operation){
	  var separator = (this.options.url.slice(-1) === "/") ? "" : "/";
      return this.options.url + separator +  operation.getUrlQuery();
  }
  
});;/** 
ww
@class
@augments {Spectrum4Leaflet.Services.Service} 
*/
Spectrum4Leaflet.Services.MapService = Spectrum4Leaflet.Services.Service.extend(
{     
    /**
    Lists named layers which map service contains
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    listNamedLayers : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json");
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    describeNamedLayer : function(layerName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers/"+ layerName);
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
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
    
    listNamedMaps : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json");
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    describeNamedMap : function(mapName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName);
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    describeNamedMaps : function(layerNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json", { paramsSeparator : "&", queryStartCharacter : "?" } );
        
        var layersString = layerNames.join(",");
        if (layersString.length<1000){
	        operation.options.getParams.q = "describe";
	        operation.options.getParams.layers = layersString;
        } 
        else{
	        operation.options.postParams = { "Maps" : layerNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    renderMap: function(mapName, imageType,width,height,bounds,srs,resolution,locale, additionalParams, callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+"."+imageType);
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.b= bounds.toBBoxString() + "," + srs;
	    operation.options.postParams = additionalParams;
	    this.startRequest(opertaion, callback, context);
    },
    
    getUrlRenderMap: function(mapName, imageType,width,height,boundsArray,srs,resolution,locale){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+ "/image."+imageType);
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.b = boundsArray.join(",")+ "," + srs;
	    return this.getUrl(operation);
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
	    
	    this._url = this._service.getUrlRenderMap(this._mapName ,  this.options.imageType ,this._size.x,this._size.y,[ nw.x, nw.y, se.x,se.y ], this._srs.code);
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
	   this.setUrl(this._service.getUrlRenderMap(this._mapName , this.options.imageType ,this._size.x,this._size.y,[ nw.x, nw.y, se.x,se.y ], this._srs.code));
	   //this._reset();
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}	
	
});

