/**
 * Spectrum for leaftlet namespace
 * @namespace
 */
var Spectrum4Leaflet = {
  Version: '0.1',
  Services: {}
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
	          response = JSON.parse(httpRequest.responseText);
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
      paramsSeparator: ";"
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
	      query+= ";" + keyValueArray.join(this.options.paramsSeparator);
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
      var separator = (this.options.url.slice(-1) === "/") ? "" : "/";
      var urlWithQuery = this.options.url + separator +  operation.getUrlQuery();
	  if (operation.isPostOperation()){
		  return Spectrum4Leaflet.Request.post(urlWithQuery, operation.getPostData(), callback, context);
	  }
	  else{
		  return Spectrum4Leaflet.Request.get(urlWithQuery, callback, context);
	  }
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
    }
  
});