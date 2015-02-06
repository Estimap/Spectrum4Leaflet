/** 
* @class Spectrum Spatial Tile Service wrapper
* @augments Spectrum4Leaflet.Services.Service 
*/
Spectrum4Leaflet.Services.TileService = Spectrum4Leaflet.Services.Service.extend(
/** @lends Spectrum4Leaflet.Services.TileService# */
{
    /**
    * Returns the list of available named tiles for the Map Tiling Service
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    mapList : function(callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("mapList.json");
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns the metadata of a specified named tile for the Map Tiling Service
    * @param {string} mapName The name of the named tile to return the metadata for
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    description : function(mapName,callback, context){  
        var operation = new Spectrum4Leaflet.Services.Operation("/"+ this.clearParam(mapName) + "/description.json");
	    this.startRequest(operation, callback, context);
    },  
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {string} imageType Specifies the response image format. Must be png, gif, or jpeg.
    */
    getTileUrl: function(mapName,level,x,y,imageType){
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        return (this.options.alwaysUseProxy ? this.options.proxyUrl : '') +  this.checkEncodeUrl(this.getUrl(operation));
    },
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {string} imageType Specifies the response image format. Must be png, gif, or jpeg.
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    getTile: function(mapName,level,x,y,imageType, callback,context){
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        this.startRequest(operation, callback, context);
    },
    
    /**
    * @private
    */
    _createTileOperation:function(mapName,level,x,y,imageType){
        mapName = this.clearParam(mapName);
        if (mapName !== ''){
	        mapName = "/"+mapName;
        }
	    return new Spectrum4Leaflet.Services.Operation(mapName+"/"+level+"/" + x + ":" + y + "/tile." + imageType );
    }
    
    
});