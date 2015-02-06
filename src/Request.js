(function(){
	var callbacks = 0;
	
	window._Spectrum4LeafletCallbacks = {};
	
	/**
	* @classdesc Simple Wraper on XMLHttpRequest, has simple get and post functions
	* @constructor
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
	    * Creates XMLHttpRequest and binds callbacks
	    * @private
	    * @returns {XMLHttpRequest}
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
	    * @param {string} login Login 
	    * @param {string} password Password 
	    * @param {Request.Callback} Callback function, when request is done
	    * @param {Object} context Context for callback
	    * @returns {XMLHttpRequest}
	    */
	    get: function(url, login, password, callback, context){
	        var httpRequest = this._createRequest(callback,context);
		    httpRequest.open('GET', url , true, login, password);
	        httpRequest.send(null);
	        return httpRequest;
	    },
	    
	    /**
	    * Runs get request by JSONP pattern 
	    * @param {string} url Url for request
	    * @param {string} callbackSeparator Special character to separate callback param from query param
	    * @param {Request.Callback} Callback function, when request is done
	    * @param {Object} context Context for callback
	    * @returns {XMLHttpRequest}
	    */
	    jsonp: function(url, callbackSeparator, callback,context){
		    var callbackId = 'c' + callbacks;
	
	        var script = L.DomUtil.create('script', null, document.body);
	        script.type = 'text/javascript';
	        script.src = url + callbackSeparator + "callback=window._Spectrum4LeafletCallbacks." + callbackId;
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
	    * Runs post request
	    * @param {string} url Url for request
	    * @param {object} postdata Data to send in request body
	    * @param {string} posttype Type of post data 
	    * @param {string} responseType Type of returned data (only for XHR2)
	    * @param {string} login Login 
	    * @param {string} password Password 
	    * @param {Request.Callback} Callback function, when request is done
	    * @param {object} context Context for callback
	    * @returns {XMLHttpRequest}
	    */
	    post: function(url, postdata, posttype, responseType, login, password, callback,context){
	        var httpRequest = this._createRequest(callback,context);
	        httpRequest.open('POST', url, true, login, password);
	        httpRequest.setRequestHeader('Content-Type', posttype);
	        
	        if (responseType){
		        httpRequest.responseType = responseType;
	        }
	        
	        httpRequest.send(postdata);
	        return httpRequest;
	    }
	};
})();

