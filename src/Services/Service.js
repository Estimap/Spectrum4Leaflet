L.SpectrumSpatial.Services.Service = L.Class.extend(
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
      alwaysUseProxy: L.SpectrumSpatial.Defaults.alwaysUseProxy,
      forceGet : L.SpectrumSpatial.Defaults.forceGet,
      encodeUrlForProxy: L.SpectrumSpatial.Defaults.encodeUrlForProxy
  },

  /**
  * @class Base service class
  * @augments {L.Class} 
  * @constructs 
  * @param {string} url Url of service
  * @param {L.SpectrumSpatial.Services.Service.Options} [options] Additional options of service
  */
  initialize: function (url, options) {
      options = options || {};
      options.url = url;
      
      if ((!this.options.proxyUrl) & (L.SpectrumSpatial.Defaults.proxyUrl)){
	      this.options.proxyUrl = L.SpectrumSpatial.Defaults.proxyUrl;
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
};