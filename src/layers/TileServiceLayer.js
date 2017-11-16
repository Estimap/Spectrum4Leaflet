L.SpectrumSpatial.Layers.TileServiceLayer = L.TileLayer.extend({
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

    /**
    * @class TileService layer class
    * @constructs L.SpectrumSpatial.Layers.TileServiceLayer
    * @augments {L.GridLayer}
    * @param {L.SpectrumSpatial.Services.TileService} service Map Service for layer
    * @param {string} mapName Name of the tiled map to display on tile service
    * @param {L.SpectrumSpatial.Layers.TileServiceLayer.Options} options Additional options of layer
    */
    initialize: function (service, mapName, options) {
        options = options || {};
        if (!options.imageType){
            options.imageType = 'png';
        }
        if (!options.zoomOffset){
            options.zoomOffset = 1;
        }

        this._service = service;
        this._mapName = mapName;

        var tileUrl = service.getTileUrl(mapName, '{z}', '{x}', '{y}',options.imageType);

        L.TileLayer.prototype.initialize.call(this,tileUrl, options);
    },

    createTile: function (coords, done) {
        var tile = L.TileLayer.prototype.createTile.call(this,coords,done);
        if (this._service.needAuthorization()){
            this._service.getTile(this._mapName,
                                  coords.z + 1,
                                  coords.x + 1,
                                  (this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y) + 1,
                                  this._postLoad,
                                  { context : this, image: tile , done : done },
                                  this.options.imageType);
            tile.src = '';
            return tile;
        }
        else{
            return tile;
        }
    },

    setService: function (service, noRedraw) {
        this._service = service;
        return this.setUrl(this._service.getTileUrl(this._mapName, '{z}', '{x}', '{y}',options.imageType), noRedraw);
    },

    setMapName: function (mapName, noRedraw) {
        this._mapName = mapName;
        return this.setUrl(this._service.getTileUrl(this._mapName, '{z}', '{x}', '{y}',options.imageType), noRedraw);
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
        return L.TileLayer.prototype.getTileUrl.call(this,{ x: coords.x + 1, y:coords.y + 1 });
    },

});

L.SpectrumSpatial.Layers.tileServiceLayer = function(service,mapName,options){
  return new L.SpectrumSpatial.Layers.TileServiceLayer(service,mapName,options);
};
