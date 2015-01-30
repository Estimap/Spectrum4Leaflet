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
    },
    
    describeNamedLayer : function(layerName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers/"+ layerName);
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    describeNamedLayers : function(layerNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json", { paramsSeparator : "&", queryStartCharacter : "?" } );
        
        var layersString = layerNames.join(",");
        if (layersString.length<1000){
	        operation.options.getParams.q = "describe";
	        operation.options.getParams.layers = layersString;
        } 
        else{
	        operation.options.postParams = { "Layers" : layerNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    listNamedMaps : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json");
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    describeNamedMap : function(mapName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName);
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    describeNamedMaps : function(layerNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json", { paramsSeparator : "&", queryStartCharacter : "?" } );
        
        var layersString = layerNames.join(",");
        if (layersString.length<1000){
	        operation.options.getParams.q = "describe";
	        operation.options.getParams.layers = layersString;
        } 
        else{
	        operation.options.postParams = { "Maps" : layerNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    renderMap: function(mapName, imageType,width,height,bounds,srs,resolution,locale, additionalParams, callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+"."+imageType);
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.b= bounds.toBBoxString() + "," + srs;
	    operation.options.postParams = additionalParams;
	    this.startRequest(opertaion, callback, context);
    },
    
    getUrlRenderMap: function(mapName, imageType,width,height,boundsArray,srs,resolution,locale){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+ "/image."+imageType);
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.b = boundsArray.join(",")+ "," + srs;
	    return this.getUrl(operation);
    }
    
    
  
});