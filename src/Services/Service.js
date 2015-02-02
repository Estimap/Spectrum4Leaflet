Spectrum4Leaflet.Services.Service = L.Class.extend(
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
      var urlQuery = this.clearParam(operation.getUrlQuery()); 
      
	  var separator = (this.options.url.slice(-1) === "/") ? "" : "/";
	  
      return this.options.url + separator +  urlQuery;
  },
  
  /**
  Clears parameter from "/" at first letter
  @param {string}
  @returns {string}
  */
  clearParam: function(param){
	  if (param[0]==="/"){
	      return param.substring(1);
      }
      return param;
  }
  
});