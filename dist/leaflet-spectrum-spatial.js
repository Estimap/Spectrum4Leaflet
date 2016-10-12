/**
 * Leaflet namespace
 * @namespace L
 */

/**
 * Leaflet reference systems namespace
 * @namespace L.CRS
 */

/**
 * Spectrum spatial for leaftlet namespace
 * @namespace
 */
L.SpectrumSpatial = {
  Version: '0.4.0',

  /**
   * Spectrum's services
   * @namespace
   */
  Services: {},

  /**
   * Spectrum's services
   * @namespace
   */
  Layers: {},

  /**
   * Controls
   * @namespace
   */
  Controls: {},

  /**
   * Defaults values
   * @namespace
   * @property {string} [proxyUrl=undefined] Proxy url for all services
   * @property {boolean} [alwaysUseProxy=false] All queries will be using proxy
   * @property {boolean} [forceGet=true] Every time use get request (not JSONP)
   * @property {boolean} [encodeUrlForProxy=false] If true proxy params will be url encoded
   */
  Defaults: {

    proxyUrl: undefined,

    alwaysUseProxy: false,

    forceGet: true,

    encodeUrlForProxy: false
  },

  /**
   * Projections
   * @namespace
   */
  Projections: {},

  /**
   * Environment values
   * @namespace
   */
  Support: {
    CORS: ('withCredentials' in new XMLHttpRequest())
  }
};

if(typeof window !== 'undefined' && window.L) {
  window.L.SpectrumSpatial = L.SpectrumSpatial;
}
;/**
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
    
};;/**
* Xml utils
* @namespace
*/
L.SpectrumSpatial.Utils.Xml = {
	
	/**
	* Checking xml namespace, if null return '', if does not have ':', adds it
	* @param {string} ns Namespace
	* @returns {string}
	*/
	checkNs : function(ns){
	   	if ((!ns) || (ns==='')){
			ns = '';
		}
		else{
			if (ns.slice(-1)!==':'){
				ns +=':';
			}			
		}
		return ns;
	},
	
	/**
	* Serializes point to xml string
	* @param {Object} point Point to serialize
	* @param {string} [ns] namespace
	* @returns {string}
	*/
	fromPoint : function(point, ns){
		ns = L.SpectrumSpatial.Utils.Xml.checkNs(ns);
		return L.Util.template('<{ns}Pos><{ns}X>{x}</{ns}X><{ns}Y>{y}</{ns}Y></{ns}Pos>', { x: point.x, y:point.y, ns:ns });
	},
	
	/**
	* Serializes envelope to xml string
	* @param {Object} envelope Envelope to serialize
	* @param {string} [ns] namespace
	* @returns {string}
	*/
	fromEnvelope: function(envelope,ns){
		return L.SpectrumSpatial.Utils.Xml.fromPoint(envelope.min,ns)+
			   L.SpectrumSpatial.Utils.Xml.fromPoint(envelope.max,ns);
	},
	
	/**
	* Serializes geometry to xml string
	* @param {Object} geometry Geometry to serialize
	* @param {string} type Type of geometry
	* @param {string} srsName Spatial reference of geometry
	* @param {string} ns1 namespace for geometry
	* @param {string} ns2 namespace for geometry elements
	* @param {string} [geometryNodeName=Geometry] Name of root element
	* @returns {string}
	*/
	fromGeometry: function(geometry, type, srsName, ns1,ns2, geometryNodeName){
		var data;
		ns1 = L.SpectrumSpatial.Utils.Xml.checkNs(ns1);
		ns2 = L.SpectrumSpatial.Utils.Xml.checkNs(ns2);
		if (!geometryNodeName){
			geometryNodeName = 'Geometry';
		}
		switch(type){
			case 'Point':
			data = L.SpectrumSpatial.Utils.Xml.fromPoint(geometry,ns2);
			break;
			case 'Envelope':
			data = L.SpectrumSpatial.Utils.Xml.fromEnvelope(geometry,ns2);
			break;
		}		
		return L.Util.template('<{ns1}{nodeName} xsi:type="{ns2}{type}" srsName="{srsName}">{data}</{ns1}{nodeName}>', 
								{   
									ns1:ns1, 
									ns2:ns2, 
									type:type, 
									data:data, 
									srsName:srsName,
									nodeName: geometryNodeName
								});
	}
};;/*
*   @description Mercator projection (like 3395, but have "big" bounds [-20037508.34279, -20037508.34279], [20037508.34279, 20037508.34279] )
*   @name L.SpectrumSpatial.Projections.Mercator 
*   @memberof L.SpectrumSpatial.Projections
*   @static
*/
L.SpectrumSpatial.Projections.Mercator =  {

    R: 6378137,
    
	R_MINOR: 6356752.314245179,

	bounds: L.bounds([-20037508.34279, -20037508.34279], [20037508.34279, 20037508.34279]),

	project: function (latlng) {
		var d = Math.PI / 180,
		    r = this.R,
		    y = latlng.lat * d,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    con = e * Math.sin(y);

		var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
		y = -r * Math.log(Math.max(ts, 1E-10));

		return new L.Point(latlng.lng * d * r, y);
	},

	unproject: function (point) {
		var d = 180 / Math.PI,
		    r = this.R,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    ts = Math.exp(-point.y / r),
		    phi = Math.PI / 2 - 2 * Math.atan(ts);

		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
			con = e * Math.sin(phi);
			con = Math.pow((1 - con) / (1 + con), e / 2);
			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
			phi += dphi;
		}

		return new L.LatLng(phi * d, point.x * d / r);
	}
};;/*
*   @description Projection EPSG:41001
*   @name L.CRS.EPSG41001  
*   @memberof L.CRS
*   @static
*/
L.CRS.EPSG41001 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:41001',
	projection: L.SpectrumSpatial.Projections.Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * L.SpectrumSpatial.Projections.Mercator.R);
		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});;(function() {
  var callbacks = 0;

  var requestState = {
    notInitialized: 0,
    connectionEstablished: 1,
    received: 2,
    processing: 3,
    finished: 4
  };

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
     * @param {Object} response Response
     * @param {Object} error Error object, with fieds code and message
     */

    _createRequest: function(callback, context) {
      var httpRequest = new XMLHttpRequest();

      httpRequest.onerror = function(e) {
        callback.call(context, {
          error: {
            code: 500,
            message: 'XMLHttpRequest error'
          }
        }, null);
      };

      httpRequest.onreadystatechange = function() {
        var response;
        var error;

        if(httpRequest.readyState === requestState.finished) {
          try {
            var contentType = this.getResponseHeader('content-type');
            if(contentType.indexOf('application/json') !== -1) {
              response = JSON.parse(httpRequest.responseText);
            }
            else if(contentType.indexOf('text/xml') !== -1) {
              response = httpRequest.responseXML;
            }
            else {
              response = httpRequest.response;
            }
          } catch(e) {
            response = null;
            error = {
              code: 500,
              message: 'Could not parse response as JSON.'
            };
          }

          if(!error && response.error) {
            error = response.error;
            response = null;
          }

          callback.call(context, response, error);
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
    get: function(url, callback, context, options) {
      options = options || {};
      var httpRequest = this._createRequest(callback, context);
      httpRequest.open('GET', url, true, options.login, options.password);
      if(options.responseType) {
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
    jsonp: function(url, callback, context, callbackSeparator) {
      var callbackId = 'c' + callbacks;

      if(!callbackSeparator) {
        callbackSeparator = '';
      }

      var script = L.DomUtil.create('script', null, document.body);
      script.type = 'text/javascript';
      script.src = url + callbackSeparator + 'callback=window._Spectrum4LeafletCallbacks.' + callbackId;
      script.id = callbackId;

      window._Spectrum4LeafletCallbacks[callbackId] = function(response) {
        if(window._Spectrum4LeafletCallbacks[callbackId] !== true) {
          var error;
          var responseType = Object.prototype.toString.call(response);

          if(!(responseType === '[object Object]' || responseType === '[object Array]')) {
            error = {
              error: {
                code: 500,
                message: 'Expected array or object as JSONP response'
              }
            };
            response = null;
          }

          if(!error && response.error) {
            error = response;
            response = null;
          }

          callback.call(context, response, error);
          window._Spectrum4LeafletCallbacks[callbackId] = true;
        }
      };

      callbacks++;

      return {
        id: callbackId,
        url: script.src,
        abort: function() {
          window._Spectrum4LeafletCallbacks._callback[callbackId](null, {
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
    post: function(url, callback, context, options) {
      options = options || {};
      if(!options.postType) {
        options.postType = 'application/json';
      }

      var httpRequest = this._createRequest(callback, context);
      httpRequest.open('POST', url, true, options.login, options.password);

      httpRequest.setRequestHeader('Content-Type', options.postType);

      if(options.responseType) {
        httpRequest.responseType = options.responseType;
      }

      httpRequest.send(options.postData);
      return httpRequest;
    },

    /**
     * Runs soap request
     * @param {string} url Url of service
     * @param {string} message SOAP message
     * @param {Request.Callback} Callback function, when request is done
     * @param {object} context Context for callback
     * @returns {XMLHttpRequest}
     */
    soap: function(url, message, callback, context) {
      var httpRequest = this._createRequest(callback, context);
      httpRequest.open("POST", url, true);
      httpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
      httpRequest.send(message);
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
      options = L.SpectrumSpatial.Utils.merge({
          alwaysUseProxy: L.SpectrumSpatial.Defaults.alwaysUseProxy,
          forceGet : L.SpectrumSpatial.Defaults.forceGet,
          encodeUrlForProxy: L.SpectrumSpatial.Defaults.encodeUrlForProxy,
          url : url
      }, options);
       
      if ((options.proxyUrl===undefined) & (L.SpectrumSpatial.Defaults.proxyUrl!==undefined)){
          options.proxyUrl = L.SpectrumSpatial.Defaults.proxyUrl;
      }
      
      L.Util.setOptions(this, options);
    },
    
    /**
    * Starts soap request to service
    * @param {string} message SOAP message
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @returns {XMLHttpRequest}
    */
    startSoap: function(message,callback, context){    
	    var url = this.options.url;
	    
	    if (this.options.proxyUrl){
            url = this.options.proxyUrl + this.checkEncodeUrl(url) ;
        }   
	    
	    return L.SpectrumSpatial.Request.soap(url, message.replace(/'\r\n'/g, '') , callback, context);
    },
    
    /**
    * Starts request to service
    * @param {L.SpectrumSpatial.Services.Operation} operation Operation for request
    * @param {Object} context Context for callback
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @returns {XMLHttpRequest}
    */
    startRequest: function(operation, callback,context){
      var urlWithQuery = this.getUrl(operation);
      var queryOptions = { 
                                postData: operation.getPostData().replace(/'\r\n'/g, ''), 
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
    * Applies param to xml string 
    * @param {string} message
    * @param {Object} param Param value
    * @param {string} name Param name
    * @param {boolean} isNode if parameter is xml node
    * @returns {string}
    */
    applyParamToXml: function(message, param, name, isNode){
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
    },
    
    /**
    * Encode specified url if options.encodeUrlForProxy is true
    * @param {string} url
    * @returns {string}
    */
    checkEncodeUrl:function(url){
        return  this.options.encodeUrlForProxy ? encodeURIComponent(url) : url;
    },
    
    /**
    * Returns true if login defined in options
    * @returns {boolean}
    */
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
/** @lends L.SpectrumSpatial.Services.MapService.prototype */
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
/** @lends L.SpectrumSpatial.Services.TileService.prototype */
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
/** @lends L.SpectrumSpatial.Services.FeatureService.prototype */
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
};;/** 
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
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.resourceType, 'resourceType');
		message = this.applyParamToXml(message, options.path, 'v1:Path', true);
		
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
		message = this.applyParamToXml(message, id, 'id');
		message = this.applyParamToXml(message, locale, 'locale');
		message = this.applyParamToXml(message, path, 'v1:Path', true);
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
		message = this.applyParamToXml(message, id, 'id');
		message = this.applyParamToXml(message, locale, 'locale');
		message = this.applyParamToXml(message, path, 'v1:Path', true);
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
		message = this.applyParamToXml(message, id, 'id');
		message = this.applyParamToXml(message, locale, 'locale');
		message = this.applyParamToXml(message, resourceXmlText, 'v1:Resource', true);
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
		message = this.applyParamToXml(message, id, 'id');
		message = this.applyParamToXml(message, locale, 'locale');
		message = this.applyParamToXml(message, resourceXmlText, 'v1:Resource', true);
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
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.resourceType, 'resourceType');
		message = this.applyParamToXml(message, options.path, 'v1:Path', true);
		message = this.applyParamToXml(message, contains, 'v1:Contains', true);
		
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
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.searchPath, 'v1:SearchPath', true);
		message = this.applyParamToXml(message, namedResource, 'v1:NamedResourcePath', true);
		
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
		message = this.applyParamToXml(message, options.id, 'id');
		message = this.applyParamToXml(message, options.locale, 'locale');
		message = this.applyParamToXml(message, options.searchPath, 'v1:SearchPath', true);
		message = this.applyParamToXml(message, namedResource, 'v1:NamedResourcePath', true);
		
		this.startSoap(message, callback, context);		
    }
});

L.SpectrumSpatial.Services.namedResourceService = function(url,options){
  return new L.SpectrumSpatial.Services.NamedResourceService(url,options);
};;/** 
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
};;/** 
* @class Spectrum Spatial Routing Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.RoutingService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.RoutingService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.RoutingService.prototype */
{
	
	/**
    * GetRoute function's options
    * @typedef {Object} L.SpectrumSpatial.Services.RoutingService.GetRouteOptions
    * @property {string} [intermediatePoints] String representation of intermediate point's list. For example: -74.2,40.8,-73,42,epsg:4326 
    * @property {boolean} [oip] A processing parameter that indicates if the intermediate points should be optimized 
    * @property {string} [destinationSrs] The coordinate system to return the route and resulting geometries
    * @property {string} [optimizeBy='time'] The type of optimizing to use for the route. Valid values are time or distance
    * @property {boolean} [returnDistance=true] The route directions include the distance traveled
    * @property {string} [distanceUnit='m'] The units to return distance
    * @property {boolean} [returnTime=true] The route directions include the time it takes to follow a direction
    * @property {string} [timeUnit='min'] The units to return time
    * @property {string} [language='en'] The language the travel directions should be returned, only if route directions are returned
    * @property {string} [directionsStyle='None'] The type of route directions to return
    * @property {string} [segmentGeometryStyle='None'] The format of the geometry that represents a segment of the route
    * @property {boolean} [primaryNameOnly=false] Whether to return all names for a given street in the directions or to return just the primary name for a street
    * @property {boolean} [majorRoads=false] Whether to include all roads in the calculation or just major roads
    * @property {string} [historicTrafficTimeBucket='None'] Specifies whether the routing calculation uses the historic traffic speeds
    */
	
    /**
    * The GetRoute service returns routing information for a set of two distinct points or multiple points.
    * @param {Object} startPoint The start location of the route. Example: { x : 1, y : 2 }
    * @param {Object} endPoint The end location of the route. Example: { x : 2, y : 3 }
    * @param {string} srs Reference system for start and end points
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.RoutingService.GetRouteOptions} [options] GetRoute options
    */
    getRoute : function(startPoint, endPoint, srs, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('databases/'+ this._getDbSource(options) +'.json', { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = 'route';
        
        operation.options.getParams.startPoint = startPoint.x + ',' + startPoint.y + ',' + srs;
        operation.options.getParams.endPoint = endPoint.x + ',' + endPoint.y + ',' + srs;
        
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
        this.startRequest(operation, callback, context);
    },
    
    /**
    * GetTravelBoundary function's options
    * @typedef {Object} L.SpectrumSpatial.Services.RoutingService.GetTravelBoundaryOptions
    * @property {string} [costUnit] The type of metric used to calculate the travel boundary
    * @property {number} [maxOffroadDistance] The maximum distance to allow travel off the road network using the maxOffroadDistanceUnit
    * @property {string} [maxOffroadDistanceUnit] The distance unit defining the maxOffroadDistance
    * @property {string} [destinationSrs] The coordinate system to return the travel boundary geometries
    * @property {boolean} [majorRoads=true] Whether to include all roads in the calculation or just major roads
    * @property {boolean} [returnHoles=false] Specifies whether you want to return holes, which are areas within the larger boundary that cannot be reached within the desired time or distance, based on the road network
    * @property {boolean} [returnIslands=false] Specifies whether you want to return islands, which are small areas outside the main boundary that can be reached within the desired time or distance
    * @property {number} [simplificationFactor=0.5] What percentage of the original points should be returned or upon which the resulting complexity of geometries should be based. A number between 0.0 and 1.0 where 0.0 is very simple and 1.0 means the most complex
    * @property {string} [bandingStyle='Donut'] The style of banding to be used in the result
    * @property {string} [historicTrafficTimeBucket='None'] Specifies whether the routing calculation uses the historic traffic speeds
    */
    
    /**
    * GetTravelBoundary determines a drive or walk time or distance boundary from a location.
    * @param {Object} point The start location from where to calculate the travel boundary. Example: { x : 1, y : 2 }
    * @param {string} srs Reference system
    * @param {string} costs The cost distance or time, in the cost units specified. You can also specify multiple costs by specifying the values as a comma delimited string
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.RoutingService.GetTravelBoundaryOptions} options GetTravelBoundary options
    */
    getTravelBoundary : function(point, srs, costs, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('databases/'+ this._getDbSource(options)  +'.json', { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = 'travelBoundary';
        
        operation.options.getParams.point = point.x + ',' + point.y + ',' + srs;
        operation.options.getParams.costs = costs;

        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
        this.startRequest(operation, callback, context);
    },
    
    _getDbSource: function(options){
	    if (options && options.dbsource){
		    return options.dbsource;
	    }
	    else{
		    return this.options.dbsource;
	    }
    }
       
});

L.SpectrumSpatial.Services.routingService = function(url,options){
  return new L.SpectrumSpatial.Services.RoutingService(url,options);
};;L.SpectrumSpatial.Layers.MapServiceLayer = L.Layer.extend({
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
        updateInterval: 200,
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
    initialize: function(service, mapName, postData, options) {
        this._mapName = mapName;
        this._service = service;
        this._postData = postData;
        L.setOptions(this, options);
        this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
    },

    onAdd: function(map) {
        this._map = map;
        this._srs = map.options.crs;

        map.on('moveend', this._update, this);

        if (this.options.zIndex === 'auto') {
            var maxZIndex = 0;
            for (var i in map._layers) {
                var layer = map._layers[i];
                if (layer.getZIndex) {
                    var z = layer.getZIndex();
                    if (maxZIndex < z) {
                        maxZIndex = z;
                    }
                }
            }
            this.options.zIndex = maxZIndex + 1;
        }

        if ((!this._singleImages) || (this._singleImages.length === 0)) {
            this._update();
        } else {
            this._forAllSingleImages(
                function(img) {
                    this._resetImagePosition(img);
                    this.getPane(this.options.pane).appendChild(img);
                }
            );
        }

        this._update();
    },

    onRemove: function(map) {
        map.off('moveend', this._update, this);

        this._forAllSingleImages(
            function(img) {
                if (this.options.interactive) {
                    this.removeInteractiveTarget(img);
                }
                this.getPane(this.options.pane).removeChild(img);
            }
        );

    },

    setService: function(service) {
        this._service = service;
        this._update();
        return this;
    },

    setMapName: function(mapName) {
        this._mapName = mapName;
        this._update();
        return this;
    },

    setPostData: function(postData) {
        this._postData = postData;
        this._update();
        return this;
    },

    setOpacity: function(opacity) {
        this.options.opacity = opacity;

        if (this._image) {
            this._updateOpacity();
        }
        return this;
    },

    getOpacity: function() {
        return this.options.opacity;
    },

    setStyle: function(styleOpts) {
        if (styleOpts.opacity) {
            this.setOpacity(styleOpts.opacity);
        }
        return this;
    },

    setZIndex: function(zIndex) {
        this.options.zIndex = zIndex;
        this._updateZIndex();
        return this;
    },

    getZIndex: function() {
        return this.options.zIndex;
    },

    bringToFront: function() {
        if (this._map) {
            L.DomUtil.toFront(this._image);
        }
        return this;
    },

    bringToBack: function() {
        if (this._map) {
            L.DomUtil.toBack(this._image);
        }
        return this;
    },


    getAttribution: function() {
        return this.options.attribution;
    },

    getEvents: function() {
        var events = {
            zoom: this._reset,
            viewreset: this._reset
        };

        if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },

    getBounds: function() {
        return this._bounds;
    },

    _initInteraction: function() {
        if (!this.options.interactive) {
            return;
        }
        L.DomUtil.addClass(this._image, 'leaflet-interactive');
        L.DomEvent.on(this._image, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',
            this._fireMouseEvent, this);
    },

    _fireMouseEvent: function(e, type) {
        if (this._map) {
            this._map._fireMouseEvent(this, e, type, true);
        }
    },

    _initImage: function() {
        var img = L.DomUtil.create('img', 'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
        img.onselectstart = L.Util.falseFn;
        img.onmousemove = L.Util.falseFn;
        img.style.zIndex = this.options.zIndex;
        img.alt = this.options.alt;

        if (this.options.opacity < 1) {
            L.DomUtil.setOpacity(img, this.options.opacity);
        }

        return img;
    },

    _requestCounter: 0,

    _animateZoom: function(e) {
        this._forAllSingleImages(
            function(img) {
                var scale = this._map.getZoomScale(e.zoom);
                var offset = this._map._latLngToNewLayerPoint(img.position.getNorthWest(), e.zoom, e.center);
                L.DomUtil.setTransform(img, offset, scale);
            }
        );
    },


    _reset: function() {
        this._forAllSingleImages(
            function(img) {
                this._resetImagePosition(img);
            }
        );
    },

    _resetImagePosition: function(image) {
        var bounds = new L.Bounds(
            this._map.latLngToLayerPoint(image.position.getNorthWest()),
            this._map.latLngToLayerPoint(image.position.getSouthEast()));
        var size = bounds.getSize();

        L.DomUtil.setPosition(image, bounds.min);

        image.style.width = size.x + 'px';
        image.style.height = size.y + 'px';

        return image;
    },

    _incrementRequestCounter: function(imagesCount) {
        if (!this._requestCounter) {
            this._requestCounter = {
                count: 1
            };
        } else {
            this._requestCounter.count++;
        }

        this._requestCounter.allImages = imagesCount;
        this._requestCounter.loadedImages = 0;
    },


    _update: function() {
        if (!this._map) {
            return;
        }

        if (this._map._animatingZoom) {
            return;
        }

        var zoom = this._map.getZoom();

        if (this._map._panTransition && this._map._panTransition._inProgress) {
            return;
        }

        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            return;
        }

        var params = this._buildImageParams();

        this._requestImages(params);

        this.fire('loading');

    },

    _requestImages: function(params) {
        if (!this._singleImages) {
            this._singleImages = [];
        }

        this._incrementRequestCounter(params.length);
        this.fire('loading', {
            bounds: this._map.getBounds()
        });

        for (var i = 0; i < params.length; i++) {
            var singleParam = params[i];
            singleParam.requestCount = this._requestCounter.count;

            if ((this._postData) | (this._service.needAuthorization())) {
                this._service.renderMap(
                    singleParam.params,
                    this._postLoad, {
                        context: this,
                        params: singleParam
                    });
            } else {
                singleParam.href = this._service.getUrlRenderMap(singleParam.params);
                this._renderImage(singleParam);
            }

        }
    },

    _buildImageParams: function() {
        var singleMapParamsArray = [];

        var wholeBounds = this._map.getBounds();
        var wholeSize = this._map.getSize();

        var min = wholeBounds.getSouthWest();
        var max = wholeBounds.getNorthEast();

        var newXmax = min.lng;
        var newXmin = min.lng;
        var i = 0;

        var d = (newXmin + 180) / 360;
        var sign = this._sign(d);
        sign = (sign === 0) ? 1 : sign;
        var coef = sign * Math.floor(Math.abs(d));

        while (newXmax < max.lng) {
            newXmax = 360 * (coef + i) + sign * 180;

            if (newXmax > max.lng) {
                newXmax = max.lng;
            }

            var normXMin = newXmin;
            var normXMax = newXmax;

            if ((newXmin < -180) || (newXmax > 180)) {
                var d2 = Math.floor((newXmin + 180) / 360);
                normXMin -= d2 * 360;
                normXMax -= d2 * 360;
            }

            var singleBounds = L.latLngBounds(L.latLng(min.lat, normXMin), L.latLng(max.lat, normXMax));
            var positionBounds = L.latLngBounds(L.latLng(min.lat, newXmin), L.latLng(max.lat, newXmax));
            var width = (wholeSize.x * ((newXmax - newXmin) / (max.lng - min.lng)));
            var singleSize = {
                x: width,
                y: wholeSize.y
            };
            var singleExportParams = this._buildSingleImageParams(singleBounds, singleSize);

            singleMapParamsArray.push({
                position: positionBounds,
                bounds: singleBounds,
                size: singleSize,
                params: singleExportParams
            });
            newXmin = newXmax;
            i++;
        }

        return singleMapParamsArray;
    },

    _buildSingleImageParams: function(bounds, size) {
        var ne = this._map.options.crs.project(bounds.getNorthEast());
        var sw = this._map.options.crs.project(bounds.getSouthWest());
        var sr = parseInt(this._map.options.crs.code.split(':')[1], 10);

        var top = this._map.latLngToLayerPoint(bounds._northEast);
        var bottom = this._map.latLngToLayerPoint(bounds._southWest);

        if (top.y > 0 || bottom.y < size.y) {
            size.y = bottom.y - top.y;
        }

        var params = {
            mapName: this._mapName,
            imageType: this.options.imageType,
            width: Math.round(size.x),
            height: Math.round(size.y),
            bounds: [sw.x, ne.y, ne.x, sw.y],
            srs: this._srs.code,
            additionalParams: this._postData
        };

        return params;
    },

    _renderImage: function(params) {
        var img = this._initImage();
        img.position = params.position;
        var imageParams = {
            image: img,
            mapParams: params,
            requestCount: params.requestCount
        };
        img.onload = L.bind(this._imageLoaded, this, imageParams);
        img.onerror = L.bind(this._imageFailed, this, imageParams);
        img.src = params.href;
    },

    _imageFailed: function(params) {
        this.fire('error', {
            params: params
        });

        if (params.requestCount !== this._requestCounter.count) {
            delete params.image;
            return;
        }

        this._requestCounter.loadedImages++;
    },

    _imageLoaded: function(params) {
        if (params.requestCount !== this._requestCounter.count) {
            delete params.image;
            return;
        }

        var image = this._resetImagePosition(params.image);

        var imagesToRemove = [];

        this._forAllSingleImages(
            function(img) {
                if (img.position.overlaps(image.position)) {
                    imagesToRemove.push(img);
                }
            }
        );

        this.getPane(this.options.pane).appendChild(image);
        if (this.options.interactive) {
            L.DomUtil.addClass(image, 'leaflet-interactive');
            this.addInteractiveTarget(image);
        }

        this._singleImages.push(image);

        this._requestCounter.loadedImages++;

        if (this._requestCounter.allImages === this._requestCounter.loadedImages) {
            var bounds = this._map.getBounds();
            this.fire('load', {
                bounds: bounds
            });

            this._forAllSingleImages(
                function(img) {
                    if (!img.position.overlaps(bounds)) {
                        imagesToRemove.push(img);
                    }
                }
            );
        }

        // removing useless images
        for (var i = 0; i < imagesToRemove.length; i++) {
            this._removeImage(imagesToRemove[i]);
            var index = this._singleImages.indexOf(imagesToRemove[i]);
            if (index !== -1) {
                this._singleImages.splice(index, 1);
            }
        }
    },

    _removeImage: function(img) {
        this.getPane(this.options.pane).removeChild(img);
        if (this.options.interactive) {
            this.removeInteractiveTarget(img);
        }
    },

    _forAllSingleImages: function(f) {
        if (this._singleImages) {
            for (var i = 0; i < this._singleImages.length; i++) {
                f.call(this, this._singleImages[i]);
            }
        }
    },


    _postLoad: function(response, error) {
        var uInt8Array = new Uint8Array(response);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');

        var base64 = window.btoa(data);
        this.params.href = 'data:image/png;base64,' + base64;
        this.context._renderImage(this.params);
    },

    _updateOpacity: function() {
        this._forAllSingleImages(
            function(img) {
                L.DomUtil.setOpacity(img, this.options.opacity);
            }
        );
        return this;
    },

    _updateZIndex: function() {
        this._forAllSingleImages(
            function(img) {
                img.style.zIndex = this.options.zIndex;
            }
        );
    },

    _sign: function(value) {
        if (value > 0) {
            return 1;
        } else if (value < 0) {
            return -1;
        } else {
            return 0;
        }
    }

});

L.SpectrumSpatial.Layers.mapServiceLayer = function(service, mapName, postData, options) {
    return new L.SpectrumSpatial.Layers.MapServiceLayer(service, mapName, postData, options);
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
        tile.onload = L.bind(this._tileOnLoad, this, done, tile);   
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
                   
            tile.src = this.getTileUrl(coords);
        }
        


        return tile;
    },
    
    _postLoad:function(response, error){
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
     * @property {string} [maxHeight] Max height of control
     * @property {string} [maxWidth] Max width of control
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
    options: {
        zIndexControls: true,
        opacityControls: true,
        legendControls: true,
        legendOptions: {},
        legendContainer: null,
        inverseOrder: false
    },

    /**
     * @class Layers control
     * @augments {L.Control}
     * @constructs L.SpectrumSpatial.Controls.Layers
     * @param {Object} baseLayers Object which contans base layers ( { "title":layer } )
     * @param {Object} overlays Object which contans overlays layers ( { "title":layer } )
     * @param {L.SpectrumSpatial.Controls.Layers.Options} [options] Options
     */
    initialize: function(baseLayers, overlays, options) {
        L.setOptions(this, options);

        this._layers = [];
        if(!this.options.legendOptions) {
            this.options.legendOptions = {};
        }
        if(this.options.legendOptions.cssOff === undefined) {
            this.options.legendOptions.cssOff = true;
        }
        this._minZIndex = 1;
        this._maxZIndex = 0;


        this._handlingClick = false;

        for(var i in baseLayers) {
            this._addLayer(baseLayers[i], i);
        }

        for(i in overlays) {
            this._addLayer(overlays[i], i, true);
        }
    },

    /**
     * Adds control to map
     * @memberof L.SpectrumSpatial.Controls.Layers.prototype
     * @param {L.Map} map Map for control
     * @param {Object} [outsideContainer] DOM element, if spicified control will be rendered outside of map
     */
    addTo: function(map, outsideContainer) {
        this.remove();
        this._map = map;


        var container = this._container = this.onAdd(map);

        if(outsideContainer) {
            outsideContainer.appendChild(container);
        }
        else {
            L.DomUtil.addClass(container, 'leaflet-control');
            var pos = this.getPosition();
            var corner = map._controlCorners[pos];

            if(pos.indexOf('bottom') !== -1) {
                corner.insertBefore(container, corner.firstChild);
            } else {
                corner.appendChild(container);
            }
        }

        return this;
    },

    /**
     * Callback for this._onVisibilityChanged private method
     */
    onVisibilityChanged: function() {
        return this;
    },

    /**
     * Callback for this._onOpacityChanged private method
     */
    onOpacityChanged: function() {
        return this;
    },

    _addLayer: function(layer, name, overlay) {
        layer.on('add remove', this._onLayerChange, this);

        if(overlay && this.options.autoZIndex && layer.setZIndex) {
            this._maxZIndex++;
            layer.setZIndex(this._maxZIndex);
        }

        if(overlay && !this.options.autoZIndex) {
            if(layer.getZIndex) {
                var z = layer.getZIndex();
                if(this._minZIndex > z) {
                    this._minZIndex = z;
                }
                if(this._maxZIndex < z) {
                    this._maxZIndex = z;
                }
            }
        }

        this._layers.push({
            layer: layer,
            name: name,
            overlay: overlay
        });
    },

    _update: function() {
        if(!this._container) {
            return this;
        }

        L.DomUtil.empty(this._baseLayersList);
        L.DomUtil.empty(this._overlaysList);

        var baseLayersPresent, overlaysPresent, obj, baseLayersCount = 0;

        var overlays = [];
        for(var i = 0; i < this._layers.length; i++) {
            obj = this._layers[i];
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
            baseLayersCount += !obj.overlay ? 1 : 0;
            if(!obj.overlay) {
                this._addItem(obj);
            }
            else {
                overlays.push({lo: obj, z: obj.layer.getZIndex()});
            }
        }

        overlays.sort(L.SpectrumSpatial.Utils.sortByProperty('z', (this.options.inverseOrder) ? "desc" : "asc"));

        for(i in overlays) {
            obj = overlays[i];
            this._addItem(obj.lo);
        }

        // Hide base layers section if there's only one layer.
        if(this.options.hideSingleBase) {
            baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
            this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
        }

        this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

        return this;
    },


    _initLayout: function() {
        var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);

        // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
        container.setAttribute('aria-haspopup', true);

        if(!L.Browser.touch) {
            L.DomEvent
                .disableClickPropagation(container)
                .disableScrollPropagation(container);
        } else {
            L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
        }

        var form = this._form = L.DomUtil.create('form', this.className + '-list');

        if(this.options.maxHeight) {
            this._form.style.maxHeight = this.options.maxHeight;
        }
        if(this.options.maxWidth) {
            this._form.style.maxWidth = this.options.maxWidth;
        }

        if(this.options.collapsed) {
            if(!L.Browser.android) {
                L.DomEvent.on(container, {
                    mouseenter: this._expand,
                    mouseleave: this._collapse
                }, this);
            }

            var link = this._layersLink = L.DomUtil.create('a', 'leaflet-control-layers-toggle', container);
            link.href = '#';
            link.title = 'Layers';

            if(L.Browser.touch) {
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
    _createRadioElement: function(name, checked) {
        var radioHtml = '<input type="radio" class="leaflet-ss-cell leaflet-ss-control-layers-selector" name="' +
            name + '"' + (checked ? ' checked="checked"' : '') + '/>';

        var radioFragment = document.createElement('div');
        radioFragment.innerHTML = radioHtml;

        return radioFragment.firstChild;
    },

    _addItem: function(obj) {
        var layerItem = L.DomUtil.create('div', 'leaflet-ss-rowcontainer');
        var row = L.DomUtil.create('div', 'leaflet-ss-row', layerItem);
        var checked = this._map.hasLayer(obj.layer);
        var input;


        if(obj.overlay) {
            input = L.DomUtil.create('input', 'leaflet-ss-cell leaflet-control-layers-selector');
            input.name = 'visibilityInput';
            input.type = 'checkbox';
            input.defaultChecked = checked;
        } else {
            input = this._createRadioElement('visibilityInput', checked);
        }
        input.layerId = L.stamp(obj.layer);
        L.DomEvent.on(input, 'click', this._onVisibilityChanged, this);

        var name = L.DomUtil.create('span', 'leaflet-ss-cell leaflet-ss-control-layers-title');
        name.innerHTML = ' ' + obj.name;

        row.appendChild(input);

        if(obj.overlay) {

            if(this.options.zIndexControls) {
                row.appendChild(this._createZIndexButton('up', obj.layer, input.layerId));
                row.appendChild(this._createZIndexButton('down', obj.layer, input.layerId));
            }

            if(this.options.legendControls) {
                var legend = L.DomUtil.create('div', 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-legend');
                legend.layerId = input.layerId;
                L.DomEvent.on(legend, 'click', this._onLegendClick, this);
                row.appendChild(legend);
                if(this.options.legendContainer) {
                    obj.legendContainer = this.options.legendContainer;
                }
                else {
                    obj.legendContainer = document.createElement('div', 'leaflet-ss-row');
                    layerItem.appendChild(obj.legendContainer);
                }
            }
            if(this.options.opacityControls) {
                var opacity = L.DomUtil.create('input', 'leaflet-ss-cell leaflet-ss-control-layers-input');
                opacity.type = 'text';
                opacity.name = 'opacityInput';
                opacity.value = (obj.layer.getOpacity) ? obj.layer.getOpacity() : this.options.opacity;
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

    _createZIndexButton: function(displayDirection, layer, layerId) {
        var className = 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-' + displayDirection;
        var realDirection = ((displayDirection === 'up' & this.options.inverseOrder) ||
        (displayDirection === 'down' & !this.options.inverseOrder)) ? 'up' : 'down';
        var clickFunction = (realDirection === 'up') ? this._onUpClick : this._onDownClick;
        var disableIndex = (realDirection === 'up') ? this._maxZIndex : this._minZIndex;
        var btn = L.DomUtil.create('div', className);
        btn.layerId = layerId;
        L.DomEvent.on(btn, 'click', clickFunction, this);
        if(layer.getZIndex() === disableIndex) {
            L.DomUtil.addClass(btn, 'leaflet-ss-disabled');
        }

        return btn;
    },

    _onLegendClick: function(e) {
        var layerId = e.currentTarget.layerId;
        var lo = this._getLayer(layerId);
        var legend;
        if(!this.options.legendContainer) {
            if(lo.legendContainer.hasChildNodes()) {
                L.DomUtil.empty(lo.legendContainer);
            }
            else {
                legend = new L.SpectrumSpatial.Controls.Legend(lo.layer._service, lo.layer._mapName, this.options.legendOptions);
                legend.addTo(this._map, this.options.legendContainer ? this.options.legendContainer : lo.legendContainer);
            }
        }
        else {
            legend = new L.SpectrumSpatial.Controls.Legend(lo.layer._service, lo.layer._mapName, this.options.legendOptions);
            legend.addTo(this._map, this.options.legendContainer ? this.options.legendContainer : lo.legendContainer);
        }
    },

    _onDownClick: function(e) {
        var layerId = e.currentTarget.layerId;
        var layer = this._getLayer(layerId).layer;
        var curZ = layer.getZIndex();
        var oldLayer = this._findOverlayByZ(curZ - 1);
        if(oldLayer) {
            oldLayer.layer.setZIndex(curZ);
            layer.setZIndex(curZ - 1);
            this._update();
        }
    },

    _onUpClick: function(e) {
        var layerId = e.currentTarget.layerId;
        var layer = this._getLayer(layerId).layer;
        var curZ = layer.getZIndex();
        var oldLayer = this._findOverlayByZ(curZ + 1);
        if(oldLayer) {
            oldLayer.layer.setZIndex(curZ);
            layer.setZIndex(curZ + 1);
            this._update();
        }
    },

    _findOverlayByZ: function(z) {
        for(var i = 0; i < this._layers.length; i++) {
            obj = this._layers[i];

            if(obj.overlay && obj.layer.getZIndex() === z) {
                return obj;
            }
        }
        return null;
    },

    _onVisibilityChanged: function() {
        var inputs = L.SpectrumSpatial.Utils.getElementsByName(this._container, 'visibilityInput');
        var input, layer, hasLayer;
        var addedLayers = [],
            removedLayers = [];

        this._handlingClick = true;

        for(var i = 0, len = inputs.length; i < len; i++) {
            input = inputs[i];
            layer = this._getLayer(input.layerId).layer;
            hasLayer = this._map.hasLayer(layer);

            if(input.checked && !hasLayer) {
                addedLayers.push(layer);

            } else if(!input.checked && hasLayer) {
                removedLayers.push(layer);
            }
        }

        // Bugfix issue 2318: Should remove all old layers before readding new ones
        for(i = 0; i < removedLayers.length; i++) {
            this._map.removeLayer(removedLayers[i]);
        }
        for(i = 0; i < addedLayers.length; i++) {
            this._map.addLayer(addedLayers[i]);
        }

        this.onVisibilityChanged();
        this._refocusOnMap();
        this._handlingClick = false;
    },

    _onOpacityChanged: function() {
        var inputs = L.SpectrumSpatial.Utils.getElementsByName(this._container, 'opacityInput');
        var input, layer;

        this._handlingClick = true;

        for(var i = 0, len = inputs.length; i < len; i++) {
            input = inputs[i];
            layer = this._getLayer(input.layerId).layer;
            var newOpacity = parseFloat(input.value);
            if(layer.setOpacity && !isNaN(newOpacity)) {
                layer.setOpacity(newOpacity);
            }
        }

        this.onOpacityChanged();
        this._handlingClick = false;
    },

    _expand: function() {
        L.DomUtil.addClass(this._container, this.className + '-expanded');
    },

    _collapse: function() {
        L.DomUtil.removeClass(this._container, this.className + '-expanded');
    }

});

L.SpectrumSpatial.Controls.layers = function(baselayers, overlays, options) {
    return new L.SpectrumSpatial.Controls.Layers(baselayers, overlays, options);
};
;L.SpectrumSpatial.Controls.Legend = L.Control.extend({
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
    * @property {string} [maxHeight] Max height of control
    * @property {string} [maxWidth] Max width for control, if overflow - scrolls
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
        hasCartographic:true,
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
    * @memberof L.SpectrumSpatial.Controls.Legend.prototype
    * @param {L.Map} map Map for control
    * @param {Object} [outsideContainer] DOM element, if spicified control will be rendered outside of map
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
    
    _legendCallback: function(response,error){
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
        if (this.options.maxHeight){
	        this._legendList.style.maxHeight = this.options.maxHeight;
        }
        if (this.options.maxWidth){
	        this._legendList.style.maxWidth = this.options.maxWidth;
        }
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
        pixelTolerance: 0,
        hideTypes: ['Geometry', 'Style'],
        showIfEmpty: false,
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
    initialize: function(service, featureLayers, options) {
        L.setOptions(this, options);
        this._service = service;
        this._featureLayers = featureLayers;
    },


    /**
     * Adds control to map
     * @memberof L.SpectrumSpatial.Controls.Feature.prototype
     * @param {L.Map} map Map for control
     */
    addTo: function(map) {
        this.remove();
        this._map = map;


        var container = this._container = this.onAdd(map);

        L.DomUtil.addClass(container, 'leaflet-control');
        var pos = this.getPosition();
        var corner = map._controlCorners[pos];

        if(pos.indexOf('bottom') !== -1) {
            corner.insertBefore(container, corner.firstChild);
        } else {
            corner.appendChild(container);
        }

        return this;
    },

    onAdd: function() {
        var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
        this._featureInfo = L.DomUtil.create('div', 'leaflet-ss-control-feature-info');
        L.DomEvent.on(this._featureInfo, 'click', this._onFeatureInfoClick, this);
        container.appendChild(this._featureInfo);
        return this._container;
    },

    setService: function(service) {
        this._service = service;
        return this;
    },

    setLayers: function(featureLayers) {
        this._featureLayers = featureLayers;
        return this;
    },

    setActive: function(isActive) {
        this._active = isActive;
        if(isActive) {
            this._map.on('click', this._getFeatureInfo, this);
            L.DomUtil.addClass(this._featureInfo, 'leaflet-ss-control-feature-activated');
        }
        else {
            this._clearPopup();
            this._map.off('click', this._getFeatureInfo, this);
            L.DomUtil.removeClass(this._featureInfo, 'leaflet-ss-control-feature-activated');
        }
    },

    getPopupHtmlContent: function(requestedData) {
        var content = '';

        for(var i = 0; i < requestedData.length; i++) {
            var featureLayer = requestedData[i];

            if(!((featureLayer.data.features) && (featureLayer.data.features.length > 0))) {
                continue;
            }

            content += L.Util.template('<b>{title}</b><br/>', featureLayer.layerSettings);
            content += '<table><thead><tr>';

            var visibleColumns = [];

            for(var j in featureLayer.data.Metadata) {
                var column = featureLayer.data.Metadata[j];
                if(this.options.hideTypes.indexOf(column.type) === -1) {
                    visibleColumns.push(column.name);
                    content += L.Util.template('<th>{name}</th>', column);
                }
            }
            content += '</tr></thead><tbody>';
            for(var k in featureLayer.data.features) {
                var feature = featureLayer.data.features[k];
                content += '<tr>';

                for(var c in visibleColumns) {
                    var cName = visibleColumns[c];
                    content += '<td>' + feature.properties[cName] + '</td>';
                }

                content += '</tr>';
            }
            content += '</tbody></table>';
        }

        return content;
    },

    _onFeatureInfoClick: function(e) {
        this.setActive(!this._active);
        L.DomEvent.stopPropagation(e);
    },

    _getFeatureInfo: function(e) {
        if(!this._waitImage) {
            this._waitImage = L.DomUtil.create('div', 'leaflet-ss-wait');
        }
        this._featureInfo.style.display = "none";
        this._container.appendChild(this._waitImage);

        var queryCollector = {position: e.latlng, all: this._featureLayers.length, requested: [], hasFeatures: false};
        var point = e.layerPoint;
        var crs = map.options.crs.code;

        if(this.options.useDefaultProjection) {
            crs = 'EPSG:4326';
            point = {x: e.latlng.lng, y: e.latlng.lat};
        }
        var tolerance;
        if(this.options.pixelTolerance !== 0) {
            tolerance = Math.round(L.SpectrumSpatial.Utils.countPixelDistance(this._map, this.options.pixelTolerance, e.latlng));
        }


        for(var i = 0; i < this._featureLayers.length; i++) {
            var featureLayer = this._featureLayers[i];
            featureLayer.options = featureLayer.options || {};
            var options = L.SpectrumSpatial.Utils.merge({}, featureLayer.options);

            if((featureLayer.options.tolerance === undefined) && (tolerance !== undefined)) {
                options.tolerance = tolerance + ' m';
            }

            this._service.searchAtPoint(featureLayer.tableName,
                point,
                crs,
                this._serviceCallback,
                {context: this, collector: queryCollector, layerSettings: featureLayer}, options);
        }
    },


    _serviceCallback: function(response, error) {
        var collector = this.collector;

        if((response.features) && (response.features.length > 0)) {
            collector.hasFeatures = true;
        }

        collector.requested.push({layerSettings: this.layerSettings, data: response});

        if(collector.all === collector.requested.length) {
            this.context._queryEnded.call(this.context, collector);
        }
    },

    _queryEnded: function(collector) {
        this._featureInfo.style.display = "block";
        this._container.removeChild(this._waitImage);

        this._clearPopup();


        if(!(this.options.showIfEmpty || collector.hasFeatures)) {
            return;
        }

        this._popup = L.popup()
            .setLatLng(collector.position)
            .setContent(this.getPopupHtmlContent(collector.requested))
            .openOn(this._map);
    },

    _clearPopup: function() {
        if(this._popup) {
            this._map.closePopup(this._popup);
            delete this._popup;
        }
    }
});

L.SpectrumSpatial.Controls.feature = function(service, featureLayers, options) {
    return new L.SpectrumSpatial.Controls.Feature(service, featureLayers, options);
};
;L.SpectrumSpatial.Controls.Resources = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Resources.prototype */ 
    
    className: 'leaflet-ss-control-resources',
    
    /**
    * Resources options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Resources.Options
    * @property {Object} [onItemClick] On item click. like  function(resource) { resource.name; resource.type; resource.path }
    * @property {Object} [onItemClickContext] Context for on item click function
    * @property {string} [maxHeight] Max height for control, if overflow - scrolls
    * @property {string} [maxWidth] Max width for control, if overflow - scrolls
    * @property {boolean} [cssOff] If is true, control rednders without css class ( usefull when you draw outside of the map)
    * @property {string} [path] Path to resource
    * @property {string} [resourceType] Type of resources to show
    * @property {string} [locale] Locale
    */
    
    options: {
        position: 'bottomleft',
    },

    /**
    * @class Resources control
    * @augments {L.Control} 
    * @constructs L.SpectrumSpatial.Controls.Resources
    * @param {L.SpectrumSpatial.Services.NamedResourceService} service Named resource service
    * @param {L.SpectrumSpatial.Controls.Resources.Options} [options] Options
    */
    initialize: function (service, options) {
        L.setOptions(this, options);
        this._service = service;
    },

    /**
    * Adds control to map
    * @memberof L.SpectrumSpatial.Controls.Resources.prototype
    * @param {L.Map} map Map for control
    * @param {Object} [outsideContainer] DOM element, if spicified control will be rendered outside of map
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
        this._requestResources();
        return this._container;
    },
    
    _requestResources: function(){
        this._service.listNamedResources(this._resourceCallback, this, this.options);
        L.DomUtil.empty(this._resourcesList);
        var waitImage = L.DomUtil.create('div','leaflet-ss-wait');
        this._resourcesList.appendChild(waitImage);
    },
    
    _resourceCallback: function(response,error){
        if (!error){
	        
	        // @TODO REWORK. TOO UGLY CODE
	        var resources= { childs:[] };
	        var listNode = response.firstChild.firstChild.firstChild;
	        for (var i in listNode.childNodes){
		        var nrNode = listNode.childNodes[i];
		        
		        if (!nrNode.firstChild){
			        continue;
		        }
		        path = this._service.clearParam(nrNode.firstChild.innerHTML || nrNode.firstChild.textContent);
		        var resource = { 
							        type:  (nrNode.attributes && nrNode.attributes.resourceType)? nrNode.attributes.resourceType.value : undefined,
							        path : path
						        };	
						        
				var pathComponents = resource.path.split('/');
				
				this._addOrFind(resources, resource, pathComponents);
				       
	        }
	        
            this._resources = resources; 
            this._update();
        }
    },
    
    _addOrFind: function(parent, resource, components){
	    var name = components[0];
	    var finded;
	    for (var i in parent.childs){
		    var child = parent.childs[i];
		    
		    if (child.name === name){
			    finded = child;
			    break;
		    }
	    }
	    if (components.length>1){
		    if (!finded){
			    finded = { name: name, childs:[] };
			    parent.childs.push(finded);
		    }
		    components.splice(0, 1);
		    this._addOrFind(finded, resource, components);
	    }else{
		    parent.childs.push( { name: name, type: resource.type, path:resource.path }  );
	    }
	    
    },
    
         
    _update: function () {
        if (!this._container) { return this; }
        if (!this._resources) { return this; }
        
        L.DomUtil.empty(this._resourcesList);
        var mainNode = this._createResourceNode(this._resources.childs);
        L.DomUtil.addClass(mainNode, 'leaflet-ss-control-resources-mainnode');
        this._resourcesList.appendChild(mainNode);     
        return this;
    },
    
    _createResourceNode:function(childs, collapsed){
	    var node = L.DomUtil.create('div','leaflet-ss-control-resources-node');
	    if (collapsed){
		    L.DomUtil.addClass(node, 'leaflet-ss-control-resources-node-collapsed');
	    }
	    for (var i in childs){
		    var child = childs[i];
		    var row = L.DomUtil.create('div', 'leaflet-ss-row');
		    node.appendChild(row);
		    
		    var item;
		    
		    if (child.childs){
			    var innerRow = L.DomUtil.create('div', 'leaflet-ss-row');
			    var inner = this._createResourceNode(child.childs,true);
			    innerRow.appendChild(inner);
			    node.appendChild(innerRow);
			    
			    var expand = L.DomUtil.create('div', 'leaflet-ss-cell leaflet-ss-control-resources-directory');
			    expand.expanded = false;
			    expand.inner = inner;
			    L.DomEvent.on(expand, 'click', this._onExpand , this);
			    row.appendChild(expand);
			    
			    item = L.DomUtil.create('div', 'leaflet-ss-cell');
		        
		    }
		    else{
			    item = L.DomUtil.create('a', 'leaflet-ss-cell leaflet-ss-control-resources-item{');
			    item.href='#';
			    item.resource = child;
			    L.DomEvent.on(item, 'click', this._onClick , this);
		    }
            item.innerHTML = child.name;
		    row.appendChild(item);		    
	    }
	    return node;
    },
    
    _onClick:function(e){
	    if (this.options.onItemClick){
		    this.options.onItemClick.call(this.options.onItemClickContext, e.currentTarget.resource);
	    }
	},
    
    _onExpand:function(e){
	    if (e.currentTarget.expanded){
		    L.DomUtil.addClass(e.currentTarget.inner, 'leaflet-ss-control-resources-node-collapsed');
		    L.DomUtil.removeClass(e.currentTarget, 'leaflet-ss-control-resources-directory-expanded');
	    }
	    else{
		    L.DomUtil.removeClass(e.currentTarget.inner, 'leaflet-ss-control-resources-node-collapsed');
		    L.DomUtil.addClass(e.currentTarget, 'leaflet-ss-control-resources-directory-expanded');
	    }
	    
	    e.currentTarget.expanded = !e.currentTarget.expanded;
    },
    
    
    _initLayout: function () {
        var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
        this._resourcesList = L.DomUtil.create('div', this.className + '-list', container);
        if (this.options.maxHeight){
	        this._resourcesList.style.maxHeight = this.options.maxHeight;
        }
        if (this.options.maxWidth){
	        this._resourcesList.style.maxWidth = this.options.maxWidth;
        }
    },
});

L.SpectrumSpatial.Controls.resources = function(service , options){
    return new L.SpectrumSpatial.Controls.Resources(service, options);
};