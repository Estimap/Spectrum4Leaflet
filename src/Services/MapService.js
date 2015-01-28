/** 
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