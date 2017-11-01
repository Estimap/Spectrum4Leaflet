L.SpectrumSpatial.Layers.TileServiceLayer = L.GridLayer.extend({
/** @lends L.SpectrumSpatial.Layers.TileServiceLayer.prototype */

    /**
    * TileServiceLayer options class
    * @typedef {Object} L.SpectrumSpatial.Layers.TileServiceLayer.Options
    * @property {number} maxZoom  Maximum zoom level
    * @property {number} minZoom  Minimum zoom level
    * @property {string} errorTileUrl  Url of image to display when tile loading failed
    * @property {number} zoomOffset  
    * @property {number} maxNativeZoom  
    * @property {boolean} tms  
    * @property {boolean} zoomReverse  
    * @property {boolean} detectRetina  
    * @property {boolean} crossOrigin 
    * @property {string} imageType tile image type 
    */

    options: {
        maxZoom: 18,
        minZoom: 0,
        errorTileUrl: '',
        zoomOffset: 0,
        maxNativeZoom: null, 
        tms: false,
        zoomReverse: false,
        detectRetina: false,
        crossOrigin: false,
        imageType: 'png'
    },


    /**
    * @class TileService layer class
    * @constructs L.SpectrumSpatial.Layers.TileServiceLayer
    * @augments {L.GridLayer}
    * @param {L.SpectrumSpatial.Services.TileService} service Map Service for layer
    * @param {string} mapName Name of the tiled map to display on tile service
    * @param {L.SpectrumSpatial.Layers.TileServiceLayer.Options} options Additional options of layer
    */
    initialize: function (service, mapName, options) {

        this._service = service;
        this._mapName = mapName;

        options = L.setOptions(this, options);

        // detecting retina displays, adjusting tileSize and zoom levels
        if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

            options.tileSize = Math.floor(options.tileSize / 2);
            options.zoomOffset++;

            options.minZoom = Math.max(0, options.minZoom);
            options.maxZoom--;
        }

        // for https://github.com/Leaflet/Leaflet/issues/137
        if (!L.Browser.android) {
            this.on('tileunload', this._onTileRemove);
        }
    },

    setService: function (service, noRedraw) {
        this._service = service;
        
        if (!noRedraw) {
            this.redraw();
        }
        return this;
    },
    
    setMapName: function (mapName, noRedraw) {
        this._mapName = mapName;
        
        if (!noRedraw) {
            this.redraw();
        }
        return this;
    },

    createTile: function (coords, done) {
        var tile = document.createElement('img');

        if (this.options.crossOrigin) {
            tile.crossOrigin = '';
        }

        /*
         Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
         http://www.w3.org/TR/WCAG20-TECHS/H67
        */
        tile.alt = '';
        tile.onerror = L.bind(this._tileOnError, this, done, tile);
        tile.onload = L.bind(this._tileOnLoad, this, done, tile);   
        if (this._service.needAuthorization()){
            this._service.getTile(this._mapName,
                                  this._getZoomForUrl()+1,
                                  coords.x + 1,
                                  (this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y) + 1,
                                  this._postLoad,
                                  { context : this, image: tile , done : done },
                                  this.options.imageType);
        }
        else{
                   
            tile.src = this.getTileUrl(coords);
        }
        


        return tile;
    },
    
    _postLoad:function(response, error){
        var uInt8Array = new Uint8Array(response);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--)
        {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');
    
        var base64 = window.btoa(data);
        this.image.src ='data:image/png;base64,'+base64;
    },

    getTileUrl: function (coords) {
        return this._service.getTileUrl(
                                  this._mapName,
                                  this._getZoomForUrl()+1,
                                  coords.x + 1,
                                  (this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y) + 1  ,
                                  this.options.imageType);
    },

    _tileOnLoad: function (done, tile) {
        done(null, tile);
    },

    _tileOnError: function (done, tile, e) {
        var errorUrl = this.options.errorTileUrl;
        if (errorUrl) {
            tile.src = errorUrl;
        }
        done(e, tile);
    },

    _getTileSize: function () {
        var map = this._map,
            options = this.options,
            zoom = map.getZoom() + options.zoomOffset,
            zoomN = options.maxNativeZoom;

        // increase tile size when overscaling
        return zoomN !== null && zoom > zoomN ?
                Math.round(map.getZoomScale(zoomN, zoom) * options.tileSize) :
                options.tileSize;
    },

    _onTileRemove: function (e) {
        e.tile.onload = null;
    },

    _getZoomForUrl: function () {

        var options = this.options,
            zoom = this._tileZoom;

        if (options.zoomReverse) {
            zoom = options.maxZoom - zoom;
        }

        zoom += options.zoomOffset;

        return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
    },

    // stops loading all tiles in the background layer
    _abortLoading: function () {
        var i, tile;
        for (i in this._tiles) {
			if (this._tiles[i].coords.z !== this._tileZoom) {
				tile = this._tiles[i].el;

				tile.onload = L.Util.falseFn;
				tile.onerror = L.Util.falseFn;

				if (!tile.complete) {
					tile.src = L.Util.emptyImageUrl;
					L.DomUtil.remove(tile);
				}
			}
        }
    }
});

L.SpectrumSpatial.Layers.tileServiceLayer = function(service,mapName,options){
  return new L.SpectrumSpatial.Layers.TileServiceLayer(service,mapName,options);
};