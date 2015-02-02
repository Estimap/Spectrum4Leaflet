/** 
@classdesc Spectrum Spatial Map Service wrapper
@class
@augments {Spectrum4Leaflet.Services.Service} 
*/
Spectrum4Leaflet.Services.MapService = Spectrum4Leaflet.Services.Service.extend(
/** @lends Spectrum4Leaflet.Services.MapService.prototype */
{     
    /**
    Lists all named layers which map service contains
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    listNamedLayers : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified layer
    @param {string} layerName name of layer
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedLayer : function(layerName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers/"+ this.clearParam(layerName) + ".json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified layers
    @param {Array.<string>} layerNames Array of layer's names
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedLayers : function(layerNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("layers.json", {  paramsSeparator : "&", queryStartCharacter : "?" } );
        
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
    
    /**
    Lists all named maps which map service contains
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    listNamedMaps : function(locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified map
    @param {string} mapName name of map
    @param {string} locale Locale of response 
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedMap : function(mapName, locale, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+ ".json");
        this._addResolutionAndLocale(operation,null,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Describes specified maps
    @param {Array.<string>} mapNames Array of map's names
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    describeNamedMaps : function(mapNames, callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("maps.json", { paramsSeparator : "&", queryStartCharacter : "?" } );
        
        var mapsString = mapNames.join(",");
        if (mapsString.length<1000){
	        operation.options.getParams.q = "describe";
	        operation.options.getParams.maps = mapsString;
        } 
        else{
	        operation.options.postParams = { "Maps" : mapNames };
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    /**
    @private
    */
    _createRenderOperation:function (mapName, imageType,width,height,bounds,cx,cy,scale,zoom,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+"/image."+imageType);
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    if (bounds){
		    operation.options.getParams.b= bounds.join(",")+ "," + srs;
	    }
	    else{
		    operation.options.getParams.c= cx+ "," +cy + "," + srs;
	    }
	    
	    if (scale){
		    operation.options.getParams.s = scale;
	    }
	    
	    if (zoom){
		    operation.options.getParams.z = zoom;
	    }
	    
	    this._addResolutionAndLocale(operation,resolution,locale);
	    
	    if (rd){
		    operation.options.getParams.rd = rd;
	    }
	    
	    if (bc){
		    operation.options.getParams.bc = bc;
	    }
	    
	    if (bo){
		    operation.options.getParams.bc = bc;
	    }
	    
	    if (additionalParams){
		    operation.options.postParams = additionalParams;
	    }
	    
	    return operation;	    
    },

    /**
    @private
    */    
    _addResolutionAndLocale: function(operation,resolution, locale){
	    if (resolution){
		    operation.options.getParams.r = resolution;
	    }
	    
	    if (locale){
		    operation.options.getParams.l = locale;
	    }
    },
    
    /**
    Runs rendering  map by bounds request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @param {Object} additionalParams Additional parameters for post query
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    renderMapByBounds: function(mapName, imageType,width,height,bounds,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, bounds,null,null,null,null,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns url of image (redered map by bounds) for get request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {Array.<number>} bounds Array of geo bounds for image. [left,top,right,bottom]
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @returns {string}
    */
    getUrlRenderMapByBounds: function(mapName, imageType,width,height,bounds,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, bounds,null,null,null,null,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    Runs rendering  map by center and scale request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} scale Scale
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @param {Object} additionalParams Additional parameters for post query
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    renderMapByCenterScale: function(mapName, imageType,width,height,cx,cy,scale,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,scale,null,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns url of image (map by center and scale)  for get request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} scale Scale
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @returns {string}
    */
    getUrlRenderMapByCenterScale: function(mapName, imageType,width,height,cx,cy,scale,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,scale,null,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    Runs rendering  map by center and zoom request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} zoom Zoom
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @param {Object} additionalParams Additional parameters for post query
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    renderMapByCenterZoom: function(mapName, imageType,width,height,cx,cy,zoom,srs,resolution,locale, rd,bc,bo, additionalParams, callback, context){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,null,zoom,srs,resolution,locale,rd,bc,bo);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns url of image (map by center and zoom)  for get request
    @param {string} mapName Name of map to render
    @param {string} imageType Type of image ( png, jpg etc.) 
    @param {number} width Width of rendered image
    @param {number} height Height of rendered image
    @param {number} cx Center x coordinate 
    @param {number} cy Center y coordinate 
    @param {number} zoom Zoom
    @param {string} srs Reference system code
    @param {number} resolution Resolution
    @param {string} locale Locale
    @param {string} rd The type of rendering to perform ( s (speed) or q (quality))
    @param {string} bc The background color to use for the map image (RRGGBB)
    @param {number} bo The opacity of the background color
    @returns {string}
    */
    getUrlRenderMapByCenterZoom: function(mapName, imageType,width,height,cx,cy,zoom,srs,resolution,locale,rd,bc,bo){
	    var operation = this._createRenderOperation(mapName, imageType, width, height, null,cx,cy,null,zoom,srs,resolution,locale,rd,bc,bo);
	    return this.getUrl(operation);
    },
    
    /**
    Runs legend request
    @param {string} mapName The name of the map to return the legend.
    @param {number} width Width of the individual legend swatch in pixels
    @param {number} height Height of the individual legend swatch in pixels
    @param {string} imageType The type of images to return for the legend swatches(e.g., gif, png, etc)
    @param {boolean} inlineSwatch Determines if the swatch images are returned as data or URL to the image location on the server
    @param {number} resolution The DPI resolution of the legend swatches as an integer.
    @param {string} locale Locale
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    getLegendForMap: function(mapName ,width, height, imageType, inlineSwatch, resolution,locale,callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+"/legend.json");
	    operation.options.getParams.w = width;
	    operation.options.getParams.h = height;
	    operation.options.getParams.t = imageType;
	    this._addResolutionAndLocale(operation,resolution,locale);
	    
	    // I WANT TO KILL PB DEVELOPERS FOR THIS "?" IN QUERY
	    if (inlineSwatch!==null){
		    operation.options.getParams["?inlineSwatch"] = inlineSwatch;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Runs request for an individual swatch for a layer of a named map
    @param {string} mapName The name of the map to return the swatch
    @param {number} legendIndex The legend to get the swatch from in the named map
    @param {number} rowIndex The swatch location (row) within the legend
    @param {number} width Width of the individual legend swatch in pixels
    @param {number} height Height of the individual legend swatch in pixels
    @param {number} resolution The DPI resolution of the swatch as an integer
    @param {string} locale The locale in which to render the swatch
    @param {Request.Callback} callback Callback of the function
    @param {Object} context Context for callback
    */
    getSwatchForLayer: function(mapName,legendIndex,rowIndex,width, height, imageType,resolution, locale, callback, context){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+
	                                                            "/legends/"+legendIndex + 
	                                                             "/rows/" + rowIndex + 
	                                                             "/swatch/" + width + "x" + height + "." + imageType);
	    this._addResolutionAndLocale(operation,resolution,locale);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    Returns an individual swatch for a layer of a named map
    @param {string} mapName The name of the map to return the swatch
    @param {number} legendIndex The legend to get the swatch from in the named map
    @param {number} rowIndex The swatch location (row) within the legend
    @param {number} width Width of the individual legend swatch in pixels
    @param {number} height Height of the individual legend swatch in pixels
    @param {number} resolution The DPI resolution of the swatch as an integer
    @param {string} locale The locale in which to render the swatch
    @returns {string}
    */
    getUrlSwatchForLayer: function(mapName,legendIndex,rowIndex,width, height, imageType,resolution, locale){
	    var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ this.clearParam(mapName)+
	                                                            "/legends/"+legendIndex + 
	                                                             "/rows/" + rowIndex + 
	                                                             "/swatch/" + width + "x" + height + "." + imageType);
	    this._addResolutionAndLocale(operation,resolution,locale);
	    return this.getUrl(operation);
    },
    
    //??????????? strange definition in Spectrum Spatial Guide
    renderLegend: function(mapName ,width, height, imageType, resolution,locale, inlineSwatch,callback, context){
	    //var operation = new Spectrum4Leaflet.Services.Operation("maps/"+ mapName+"/legend.json");
    }
    
});