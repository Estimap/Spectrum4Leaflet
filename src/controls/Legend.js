L.SpectrumSpatial.Controls.Legend = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Legend.prototype */ 
    
    className: 'leaflet-ss-control-legend',
    
    /**
    * Legend's options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Legend.Options 
    * @property {string} position Control position in map
    * @property {boolean} hasCartographic If is false, cartographic legend will be ignored
    * @property {boolean} cssOff If is true, control rednders without css class ( usefull when you draw outside of the map)
    * @property {number} width Width of the individual legend swatch in pixels
    * @property {number} height Height of the individual legend swatch in pixels
    * @property {string} [maxHeight] Max height of control
    * @property {string} [maxWidth] Max width for control, if overflow - scrolls
    * @property {string} [imageType=png] Type of image ( png, jpg etc.)
    * @property {boolean} [inlineSwatch=true] Determines if the swatch images are returned as data or URL to the image location on the server
    * @property {number} [resolution] Resolution
    * @property {string} [locale] Locale
    * @property {Object} [postData] If specified runs post request to render legend
    */
    
    options: {
        position: 'bottomright',
        width:16,
        height:16,
        imageType:'png',
        hasCartographic:true,
    },

    /**
    * @class Legend control
    * @augments {L.Control} 
    * @constructs L.SpectrumSpatial.Controls.Legend
    * @param {L.SpectrumSpatial.Services.MapService} service Map service for legend
    * @param {string} mapName Map's name for legend
    * @param {L.SpectrumSpatial.Controls.Legend.Options} [options] Options
    */
    initialize: function (service, mapName, options) {
        L.setOptions(this, options);
        this._service = service;
        this.options.mapName = mapName;
    },

    /**
    * Adds control to map
    * @memberof L.SpectrumSpatial.Controls.Legend.prototype
    * @param {L.Map} map Map for control
    * @param {Object} [outsideContainer] DOM element, if spicified control will be rendered outside of map
    */
    addTo: function (map, outsideContainer) {
        this.remove();
        this._map = map;

        
        var container = this._container = this.onAdd(map);
        
        if (outsideContainer){
            L.DomUtil.empty(outsideContainer);
            outsideContainer.appendChild(container);
        }
        else{
            L.DomUtil.addClass(container, 'leaflet-control');
            var pos = this.getPosition();
            var corner = map._controlCorners[pos];
    
            if (pos.indexOf('bottom') !== -1) {
                corner.insertBefore(container, corner.firstChild);
            } else {
                corner.appendChild(container);
            }   
        }

        return this;
    },
    
    onAdd: function () {
        this._initLayout();
        this._requestLegend();
        return this._container;
    },
    
    _requestLegend: function(){
        this._service.getLegendForMap(this.options,this._legendCallback, this);
        L.DomUtil.empty(this._legendList);
        var waitImage = L.DomUtil.create('div','leaflet-ss-wait');
        this._legendList.appendChild(waitImage);
    },
    
    _legendCallback: function(response,error){
        if (!error){
            this._legend = response.LegendResponse; 
            this._update();
        }
    },
    
        
    _update: function () {
        if (!this._container) { return this; }
        if (!this._legend) { return this; }
        
        L.DomUtil.empty(this._legendList);

        for(var i in this._legend){
            obj = this._legend[i];
            
            if ((!this.options.hasCartographic) && (obj.type === 'CARTOGRAPHIC')) {
                continue;
            }
            
            var layerBlock = L.DomUtil.create('div','leaflet-ss-control-legend-layer');
            var title = L.DomUtil.create('div','leaflet-ss-row leaflet-ss-control-legend-title');
            title.innerHTML = obj.title;
            layerBlock.appendChild(title);
            
            for (var j in obj.rows){
                row = obj.rows[j];
                var divRow = L.DomUtil.create('div', 'leaflet-ss-row');
                var swatchDiv = L.DomUtil.create('div', 'leaflet-ss-cell');
                var swatch = L.DomUtil.create('img','',swatchDiv);
                swatch.src = row.swatch;
                var description = L.DomUtil.create('div', 'leaflet-ss-cell');
                description.innerHTML = row.description;
                divRow.appendChild(swatchDiv);
                divRow.appendChild(description);
                layerBlock.appendChild(divRow);
            }
            this._legendList.appendChild(layerBlock);
        }        
        return this;
    },
    
    
    _initLayout: function () {
        var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
        this._legendList = L.DomUtil.create('div', this.className + '-list', container);
        if (this.options.maxHeight){
	        this._legendList.style.maxHeight = this.options.maxHeight;
        }
        if (this.options.maxWidth){
	        this._legendList.style.maxWidth = this.options.maxWidth;
        }
    },
});

L.SpectrumSpatial.Controls.legend = function(service, mapName, options){
    return new L.SpectrumSpatial.Controls.Legend(service, mapName, options);
};