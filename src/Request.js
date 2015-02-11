(function(){
	var callbacks = 0;
	
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
		 * @param {Object} error Error object, with fieds code and message
		 * @param {Object} response Response
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
			          response = httpRequest.response;
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
	    * Runs get request
	    * @param {string} url Url for request
	    * @param {Request.Callback} callback function, when request is done
	    * @param {Object} [context] Context for callback
	    * @param {string} [login] Login 
	    * @param {string} [password] Password 
	    * @returns {XMLHttpRequest}
	    */
	    get: function(url, callback, context, login, password){
	        var httpRequest = this._createRequest(callback,context);
		    httpRequest.open('GET', url , true, login, password);
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
	    jsonp: function(url, callback, context, callbackSeparator){
		    var callbackId = 'c' + callbacks;
	
	        if (!callbackSeparator){
		        callbackSeparator='';
	        }
	
	        var script = L.DomUtil.create('script', null, document.body);
	        script.type = 'text/javascript';
	        script.src = url + callbackSeparator + 'callback=window._Spectrum4LeafletCallbacks.' + callbackId;
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
	    post: function(url, callback, context, options ){	    
		    options = options || {};	    
		    if (!options.postType){
			    options.postType = 'application/json';
		    }

	        var httpRequest = this._createRequest(callback,context);
	        httpRequest.open('POST', url, true, options.login, options.password);
	        httpRequest.setRequestHeader('Content-Type', options.postType);
	        
	        if (options.responseType){
		        httpRequest.responseType = options.responseType;
	        }
	        
	        httpRequest.send(options.postData);
	        return httpRequest;
	    }
	};
})();

