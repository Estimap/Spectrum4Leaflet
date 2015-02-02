Spectrum4Leaflet.Layers.MapServiceLayer =  L.Class.extend({

    includes: L.Mixin.Events,

    options: {
        pane: 'overlayPane',
		opacity: 1,
		alt: '',
		interactive: false,
		imageType: "png"
	},

	initialize: function (serviceUrl, mapName, options) { 
		this._serviceUrl = serviceUrl;
		this._mapName = mapName;
		this._service = new Spectrum4Leaflet.Services.MapService(serviceUrl);
		this.on('load',this._reset,this);
		L.setOptions(this, options);
	},
	
	onAdd: function (map) {	
	    //this._layerAdd({ e: { target : map} });
	    this._map = map;
	    this._bounds = map.getBounds();
	    this._size = map.getSize();
	    this._srs = map.options.crs;
	    
	    var nw = this._srs.project(this._bounds.getNorthWest());
	    var se = this._srs.project(this._bounds.getSouthEast());
	    
	    this._url = this._service.getUrlRenderMapByBounds(this._mapName ,  this.options.imageType ,this._size.x,this._size.y,[ nw.x, nw.y, se.x,se.y ], this._srs.code);
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}
		
		map.on('moveend', this._update, this);
		
		this._zoomAnimated = map._zoomAnimated;

	

		if (this.getAttribution && this._map.attributionControl) {
			this._map.attributionControl.addAttribution(this.getAttribution());
		}

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}
 
		this.getPane(this.options.pane).appendChild(this._image);
		this._initInteraction();
		
	},

	onRemove: function () {
		L.DomUtil.remove(this._image);
	},
	
 	addTo: function(map){      
        map.addLayer(this);
        return this;
    },

	remove: function () {
		return this.removeFrom(this._map || this._mapToAdd);
	},

	removeFrom: function (obj) {
		if (obj) {
			obj.removeLayer(this);
		}
		return this;
	},
	
/*
	_layerAdd: function (e) {
		var map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		this.onAdd(map);

		if (this.getAttribution && this._map.attributionControl) {
			this._map.attributionControl.addAttribution(this.getAttribution());
		}

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	},
*/

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

	setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
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
	
	getPane: function (name) {
		return this._map._panes[name];
	},

	_initImage: function () {
		var img = this._image = L.DomUtil.create('img',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		img.onselectstart = L.Util.falseFn;
		img.onmousemove = L.Util.falseFn;

		img.onload = L.bind(this.fire, this, 'load');
		img.src = this._url;
		img.alt = this.options.alt;
	},

	_animateZoom: function (e) {
		var bounds = new L.Bounds(
			this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center));

		var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

		this.setTransform(this._image, offset, e.scale);
	},
	
	setTransform: function (el, offset, scale) {
		var pos = offset || new L.Point(0, 0);

		el.style[L.DomUtil.TRANSFORM] =
			'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
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
	   this._bounds = this._map.getBounds();
	   var nw = this._srs.project(this._bounds.getNorthWest());
	   var se = this._srs.project(this._bounds.getSouthEast());
	   this._size = this._map.getSize();	
	   this.setUrl(this._service.getUrlRenderMapByBounds(this._mapName , this.options.imageType ,this._size.x,this._size.y,[ nw.x, nw.y, se.x,se.y ], this._srs.code));
	   //this._reset();
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}	
	
});

