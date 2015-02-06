Spectrum4Leaflet.Services.Service = L.Class.extend(
/** @lends Spectrum4Leaflet.Services.Service.prototype */
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
		  return Spectrum4Leaflet.Request.post(urlWithQuery, 
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
		      return Spectrum4Leaflet.Request.get(urlWithQuery, this.options.login,this.options.password, callback, context);
	      }
		  return ( this.options.forceGet | Spectrum4Leaflet.Support.CORS ) ? 
		             Spectrum4Leaflet.Request.get(urlWithQuery,this.options.login,this.options.password,  callback, context):
		             Spectrum4Leaflet.Request.jsonp(urlWithQuery,"?", callback, context);
	  }
  },
  
  /**
  * Returns full url query for service
  * @param {Spectrum4Leaflet.Services.Operation}
  * @returns {string}
  */
  getUrl: function(operation){
      var urlQuery = this.clearParam(operation.getUrlQuery());     
	  var separator = (this.options.url.slice(-1) === "/") ? "" : "/";  
	  return this.options.url + separator +  urlQuery;
  },
  
  /**
  * Clears parameter from "/" at first or last letter
  * @param {string}
  * @returns {string}
  */
  clearParam: function(param){
	  if (param[0]==="/"){
	      param = param.substring(1);
      }
      if (param.slice(-1) === "/") {
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