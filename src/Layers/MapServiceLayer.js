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
		this.on('imageLoaded',this._afterLoad,this);
		L.setOptions(this, options);
	},
	
	onAdd: function (map) {	
	    this._map = map;	    		
	    this._srs = map.options.crs;
	    this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
	    
	    this._update();
	    
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}
		
		map.on('moveend', this._update, this);
		
		this.getPane(this.options.pane).appendChild(this._image);
		this._initInteraction();
		
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
		}
		return this;
	},

	_initImage: function () {
		var img = this._image = L.DomUtil.create('img',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		img.onselectstart = L.Util.falseFn;
		img.onmousemove = L.Util.falseFn;
        img.style.zIndex = this.options.zIndex;
		img.onload = L.bind(this.fire, this, 'imageLoaded');
		img.src = this._url;
		img.alt = this.options.alt;
	},
	
	_animateZoom: function (e) {
		    
	    console.log('startAnimateZoom');

		var bounds = new L.Bounds(
			this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center));

		var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

		L.DomUtil.setTransform(this._image, offset, e.scale);
	},
	

	_reset: function () {
	
	    console.log('reset');
	    
		var image = this._image,
		    bounds = new L.Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		L.DomUtil.setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},
	
	_afterLoad: function () {
	
	    console.log('afterload');
	    
	    this._bounds = this._map.getBounds();
	    this._size = this._map.getSize();
	    
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

	    
	   console.log('update');
	
	   var bounds = this._map.getBounds();
	   var size = this._map.getSize();
	   var nw = this._srs.project(bounds.getNorthWest());
	   var se = this._srs.project(bounds.getSouthEast());  
	
	   this._setUrl(
	           this._service.getUrlRenderMapByBounds(
	                this._mapName , 
	                this.options.imageType,
	                size.x,
	                size.y,
	                [ nw.x, nw.y, se.x,se.y ], 
	                this._srs.code));

	},
	
	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	},
	
	_updateZIndex: function(){
		this._image.style.zIndex = this.options.zIndex;
	}	
	
});

