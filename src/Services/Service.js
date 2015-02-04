Spectrum4Leaflet.Services.Service = L.Class.extend(
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
  
});