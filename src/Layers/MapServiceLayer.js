Spectrum4Leaflet.Layers.MapServiceLayer =  L.Layer.extend({

    options: {
		opacity: 1,
		alt: '',
		interactive: false,
		imageType: "png",
		zIndex: "auto",
		updateInterval:200,
	},

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
	    
	    this._update();
	},

	onRemove: function () {
		L.DomUtil.remove(this._image);
	},	
	
	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
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

	_setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
			this.fire('loading');
		}
		return this;
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
	    
		
		if (this._postData){
			this._service.renderMapByBounds(
	                this._mapName , 
	                this.options.imageType,
	                size.x,
	                size.y,
	                [ nw.x, nw.y, se.x,se.y ], 
	                this._srs.code,
	                null,
	                null,
	                null,
	                null,
	                null,
	                this._postData,
	                this._postLoad,
	                { context: this, image: newImage, bounds:bounds, counter:this._requestCounter});
		}
		else{
		    newImage.onload = L.bind(this._afterLoad, this, { image: newImage, bounds:bounds, counter:this._requestCounter});
			newImage.src = 
	           this._service.getUrlRenderMapByBounds(
	                this._mapName , 
	                this.options.imageType,
	                size.x,
	                size.y,
	                [ nw.x, nw.y, se.x,se.y ], 
	                this._srs.code);
	              
		}
		this.fire('loading');
	},
	
	_postLoad:function(error,response){
	    var uInt8Array = new Uint8Array(response);
	    var i = uInt8Array.length;
	    var binaryString = new Array(i);
	    while (i--)
	    {
	      binaryString[i] = String.fromCharCode(uInt8Array[i]);
	    }
	    var data = binaryString.join('');
	
	    var base64 = window.btoa(data);
	    this.image.src ="data:image/png;base64,"+base64;
	    this.context._afterLoad({ image: this.image, bounds:this.bounds, counter:this.counter});
	},
	
	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	},
	
	_updateZIndex: function(){
		this._image.style.zIndex = this.options.zIndex;
	}	
	
});

