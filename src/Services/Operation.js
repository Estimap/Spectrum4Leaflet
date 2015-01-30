Spectrum4Leaflet.Services.Operation = L.Class.extend(
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
  
});