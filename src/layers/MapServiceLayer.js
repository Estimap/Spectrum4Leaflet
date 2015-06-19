L.SpectrumSpatial.Layers.MapServiceLayer =  L.Layer.extend({
/** @lends L.SpectrumSpatial.Layers.MapServiceLayer.prototype */


    /**
    * MapServiceLayer's options class
    * @typedef {Object} L.SpectrumSpatial.Layers.MapServiceLayer.Options
    * @property {number} opacity  Opacity of layer image (1 is default)
    * @property {string} alt  Title for layer image
    * @property {boolean} interactive  If layer is interactive
    * @property {string} imageType  Type of image ( 'png' is default )
    * @property {number} zIndex  ZIndex of layer's image ('auto' is default)
    * @property {number} updateInterval  Min update interval of the layer
    */

    options: {
        opacity: 1,
        alt: '',
        interactive: false,
        imageType: 'png',
        zIndex: 'auto',
        updateInterval:200,
    },


    /**
    * @class MapService layer class
    * @augments {L.Layer}
    * @constructs L.SpectrumSpatial.Layers.MapServiceLayer
    * @param {L.SpectrumSpatial.Services.MapService} service Map Service for layer
    * @param {string} mapName Name of the map to display on map service
    * @param {Object} postData Post data to map (only if browser supports XHR2)
    * @param {L.SpectrumSpatial.Layers.MapServiceLayer.Options} options Additional options of layer
    */
    initialize: function (service, mapName, postData, options) { 
        this._mapName = mapName;
        this._service = service;
        this._postData = postData;
        L.setOptions(this, options);
    },
    
    onAdd: function (map) { 
        this._map = map;                
        this._srs = map.options.crs;
        this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
        map.on('moveend', this._update, this);

        if (this.options.zIndex==='auto'){
            var maxZIndex = 0;
            for (var i in map._layers){
                var layer = map._layers[i];
                if (layer.getZIndex){
                    var z = layer.getZIndex();
                    if (maxZIndex<z){
                        maxZIndex = z;
                    }
                }
            }
            this.options.zIndex = maxZIndex+1;
        }
        
        this._update();
    },

    onRemove: function (map) {
        L.DomUtil.remove(this._image);
        map.off('moveend', this._update, this);
        delete this._image;
    },  
    
    setService:function(service){
        this._service = service;
        this._update();
        return this;
    },
    
    setMapName:function(mapName){
        this._mapName = mapName;
        this._update();
        return this;
    },
    
    setPostData:function(postData){
        this._postData = postData;
        this._update();
        return this;
    },
    
    setOpacity: function (opacity) {
        this.options.opacity = opacity;

        if (this._image) {
            this._updateOpacity();
        }
        return this;
    },
    
    getOpacity: function () {
        return this.options.opacity;
    },

    setStyle: function (styleOpts) {
        if (styleOpts.opacity) {
            this.setOpacity(styleOpts.opacity);
        }
        return this;
    },
    
    setZIndex: function(zIndex){
        this.options.zIndex = zIndex;
        this._updateZIndex();
        return this;
    },
    
    getZIndex: function(){
        return this.options.zIndex;
    },
    
    bringToFront: function () {
        if (this._map) {
            L.DomUtil.toFront(this._image);
        }
        return this;
    },

    bringToBack: function () {
        if (this._map) {
            L.DomUtil.toBack(this._image);
        }
        return this;
    },


    getAttribution: function () {
        return this.options.attribution;
    },

    getEvents: function () {
        var events = {
            viewreset: this._reset
        };

        if (this._zoomAnimated) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },

    getBounds: function () {
        return this._bounds;
    },
    
    _initInteraction: function () {
        if (!this.options.interactive) { return; }
        L.DomUtil.addClass(this._image, 'leaflet-interactive');
        L.DomEvent.on(this._image, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',
                this._fireMouseEvent, this);
    },

    _fireMouseEvent: function (e, type) {
        if (this._map) {
            this._map._fireMouseEvent(this, e, type, true);
        }
    },

    _initImage: function () {
        var img = L.DomUtil.create('img','leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
        img.onselectstart = L.Util.falseFn;
        img.onmousemove = L.Util.falseFn;
        img.style.zIndex = this.options.zIndex;
        img.alt = this.options.alt;
        
        if (this.options.opacity < 1) {
            L.DomUtil.setOpacity(img, this.options.opacity);
        }
        
        return img;
    },
    
    _requestCounter :0,
    
    _animateZoom: function (e) {
        var bounds = new L.Bounds(
            this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
            this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center));

        var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

        L.DomUtil.setTransform(this._image, offset, e.scale);
    },
    

    _reset: function () {  
        var image = this._image,
            bounds = new L.Bounds(
                this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
            size = bounds.getSize();

        L.DomUtil.setPosition(image, bounds.min);

        image.style.width  = size.x + 'px';
        image.style.height = size.y + 'px';
    },
    
    
    _update:function(){
        
        if(this._map._animatingZoom){
           return;
        }
        
        if (this._map._panAnim && this._map._panAnim._inProgress) {
           return;
        }

        var bounds = this._map.getBounds();
        var size = this._map.getSize();
        var nw = this._srs.project(bounds.getNorthWest());
        var se = this._srs.project(bounds.getSouthEast());  
    
        var newImage = this._initImage();
        
        this._requestCounter++;
        
        var renderOptions = {
            mapName : this._mapName ,
            imageType : this.options.imageType,
            width: size.x,
            height: size.y,
            bounds :[ nw.x, nw.y, se.x,se.y ],
            srs:this._srs.code,
            additionalParams : this._postData
        };
        
        if ((this._postData!==undefined)|(this._service.needAuthorization())){
            this._service.renderMap(
                                            renderOptions,
                                            this._postLoad,
                                            {
                                                context: this, 
                                                image: newImage, 
                                                bounds:bounds, 
                                                counter:this._requestCounter
                                            });
        }
        else{
            newImage.onload = L.bind(this._afterLoad, this, { image: newImage, bounds:bounds, counter:this._requestCounter});
            newImage.src = this._service.getUrlRenderMap(renderOptions);              
        }
        this.fire('loading');
    },
    
    _afterLoad: function (params) {  
    
        //only last request we will draw
        if (this._requestCounter!= params.counter){
            delete params.image;
            return;
        }
    
        this.fire('load');
     
        this._bounds = params.bounds;
        this._size = this._map.getSize();
        
        var image = params.image,
            bounds = new L.Bounds(
                this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
            size = bounds.getSize();

        L.DomUtil.setPosition(image, bounds.min);

        image.style.width  = size.x + 'px';
        image.style.height = size.y + 'px';
                    
        this.getPane(this.options.pane).appendChild(image);
        
        //clears old image
        if (this._image){
            this.getPane(this.options.pane).removeChild(this._image);
            L.DomEvent.off(this._image, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',this._fireMouseEvent, this);
            delete this._image;
        }
     
        this._image = image;    
        this._initInteraction();
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
        this.context._afterLoad({ image: this.image, bounds:this.bounds, counter:this.counter});
    },
    
    _updateOpacity: function () {
        L.DomUtil.setOpacity(this._image, this.options.opacity);
    },
    
    _updateZIndex: function(){
        if (this._image){
            this._image.style.zIndex = this.options.zIndex;
        }       
    }   
    
});

L.SpectrumSpatial.Layers.mapServiceLayer = function(service,mapName,postData,options){
  return new L.SpectrumSpatial.Layers.MapServiceLayer(service,mapName,postData,options);
};
