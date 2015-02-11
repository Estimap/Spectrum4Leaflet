L.SpectrumSpatial.Controls.Layers = L.Control.Layers.extend({
	
	initialize: function (baseLayers, overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		
		this._minZIndex = 1;
		this._maxZIndex = 0;
		
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},
	
	_addLayer: function (layer, name, overlay) {
		layer.on('add remove', this._onLayerChange, this);

		if (overlay && this.options.autoZIndex && layer.setZIndex) {
			this._maxZIndex++;
			layer.setZIndex(this._maxZIndex);
		}
		
		var id = L.stamp(layer);

		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};
	},
	
	_update: function () {
		if (!this._container) { return this; }

		L.DomUtil.empty(this._baseLayersList);
		L.DomUtil.empty(this._overlaysList);

		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

        var overlays = [];
		for (i in this._layers) {
		    obj = this._layers[i];
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
			if (!obj.overlay){
				this._addItem(obj);
			}
			else{
				overlays.push({ lo : obj, z : obj.layer.getZIndex() });
			}	   
		}
		
		overlays.sort(L.SpectrumSpatial.Utils.sortByProperty('z'));
		
		for (i in overlays) {
			obj = overlays[i];
			this._addItem(obj.lo);
		}
		
		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	},
	
	
	
	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent.on(container, {
					mouseenter: this._expand,
					mouseleave: this._collapse
				}, this);
			}

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			} else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', 'leaflet-ss-control-layers' + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
	},
	
	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-ss-cell leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},
	
    _addItem: function (obj) {
	    var row = document.createElement('div');
	    var checked = this._map.hasLayer(obj.layer);
	    var input;
	    
	    row.className = 'leaflet-ss-row';

		if (obj.overlay) {
			input = document.createElement('input');
			input.name = 'visibilityInput';
			input.type = 'checkbox';
			input.className = 'leaflet-ss-cell leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('visibilityInput', checked);
		}
		input.layerId = L.stamp(obj.layer);
		L.DomEvent.on(input, 'click', this._onVisibilityChanged, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;
        name.className = 'leaflet-ss-cell leaflet-ss-control-layers-title';
        
		row.appendChild(input);
		
		if (obj.overlay) {
			var up = document.createElement('div');
			up.layerId = input.layerId;
			up.className = 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-up';
			L.DomEvent.on(up, 'click', this._onUpClick, this);
			
			var down = document.createElement('div');
			down.layerId = input.layerId;
			down.className = 'leaflet-ss-cell leaflet-ss-control-layers-btn leaflet-ss-control-layers-down';
			L.DomEvent.on(down, 'click', this._onDownClick, this);
			
			row.appendChild(up);
			row.appendChild(down);
			
			var opacity = document.createElement('input');
			opacity.type = 'textbox';
			opacity.name = 'opacityInput';
			opacity.className = 'leaflet-ss-cell leaflet-ss-control-layers-input';
			opacity.value = 1;
			opacity.layerId = L.stamp(obj.layer);
			L.DomEvent.on(opacity, 'input', this._onOpacityChanged, this);
			row.appendChild(opacity);
		}

		row.appendChild(name);
		
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(row);

		return row;
	},
	
	_onUpClick: function(e) {
		var layerId = e.currentTarget.layerId;
		var layer = this._layers[layerId].layer;
		var curZ = layer.getZIndex();
		var oldLayer = this._findOverlayByZ(curZ-1);
		if (oldLayer){
			oldLayer.layer.setZIndex(curZ);
			layer.setZIndex(curZ-1);
			this._update();
		}
	},
	
	_onDownClick: function(e) {
		var layerId = e.currentTarget.layerId;
		var layer = this._layers[layerId].layer;
		var curZ = layer.getZIndex();
		var oldLayer = this._findOverlayByZ(curZ+1);
		if (oldLayer){
			oldLayer.layer.setZIndex(curZ);
			layer.setZIndex(curZ+1);
			this._update();
		}
	},
	
	_findOverlayByZ: function(z){	
		for (var i in this._layers) {
			obj = this._layers[i];
			
			if (obj.overlay && obj.layer.getZIndex()===z ){
				return obj;
			} 
		}
		return null;
	},
	
	_onVisibilityChanged: function () {
		var inputs = document.getElementsByName('visibilityInput'),
		    input, layer, hasLayer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			layer = this._layers[input.layerId].layer;
			hasLayer = this._map.hasLayer(layer);

			if (input.checked && !hasLayer) {
				addedLayers.push(layer);

			} else if (!input.checked && hasLayer) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			this._map.removeLayer(removedLayers[i]);
		}
		for (i = 0; i < addedLayers.length; i++) {
			this._map.addLayer(addedLayers[i]);
		}

		this._handlingClick = false;

	    this._refocusOnMap();
	},
	
	_onOpacityChanged:function(){
		var inputs = document.getElementsByName('opacityInput');
		var input, layer;
		
		this._handlingClick = true;

		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			layer = this._layers[input.layerId].layer;
			var newOpacity = parseFloat(input.value);
			if (layer.setOpacity && !isNaN(newOpacity) ){
				layer.setOpacity(newOpacity);
			}
		}
		
		this._handlingClick = false;
	}
	
});