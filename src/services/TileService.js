/** 
* @class Spectrum Spatial Tile Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.TileService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.TileService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.TileService.prototype */
{
    /**
    * Returns the list of available named tiles for the Map Tiling Service
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    mapList : function(callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('mapList.json');
        this.startRequest(operation, callback, context);
    },
    
    /**
    * Returns the metadata of a specified named tile for the Map Tiling Service
    * @param {string} mapName The name of the named tile to return the metadata for
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    */
    description : function(mapName,callback, context){  
        var operation = new L.SpectrumSpatial.Services.Operation('/'+ this.clearParam(mapName) + '/description.json');
        this.startRequest(operation, callback, context);
    },  
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {string} [imageType=png] Specifies the response image format. Must be png, gif, or jpeg.
    */
    getTileUrl: function(mapName,level,x,y,imageType){
        if (!imageType){
            imageType='png';
        }
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        return (this.options.alwaysUseProxy ? this.options.proxyUrl : '') +  this.checkEncodeUrl(this.getUrl(operation));
    },
    
    /**
    * Returns generated map tiles from the Map Tiling Service based on the input parameters specified.
    * @param {string} mapName The name of the named tile to generate the tile from
    * @param {number} level Determines the zoom level of the tile to be returned
    * @param {number} x Specifies the column of the tile, based on the level parameter specified
    * @param {number} y Specifies the row of the tile, based on the level parameter specified
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [imageType=png] Specifies the response image format. Must be png, gif, or jpeg.
    */
    getTile: function(mapName, level, x, y, callback, context, imageType){
        if (!imageType){
            imageType='png';
        }
        var operation = this._createTileOperation(mapName,level,x,y,imageType);
        this.startRequest(operation, callback, context);
    },
    
    /**
    * @private
    */
    _createTileOperation:function(mapName,level,x,y,imageType){
        mapName = this.clearParam(mapName);
        if (mapName !== ''){
            mapName = '/'+mapName;
        }
        return new L.SpectrumSpatial.Services.Operation(mapName+'/'+level+'/' + x + ':' + y + '/tile.' + imageType, { responseType: 'arraybuffer' }  );
    }
    
    
});

L.SpectrumSpatial.Services.tileService = function(url,options){
  return new L.SpectrumSpatial.Services.TileService(url,options);
};