L.SpectrumSpatial.Controls.Feature = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Feature.prototype */	
	
	className: 'leaflet-ss-control-feature',
	
	/**
    * Feature control options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Feature.Options
    * @property {boolean} [useDefaultProjection] Use EPSG:4326 coordinates in spatial queries
    */
	//@TODO add options showIfempty
	options: {
		useDefaultProjection: true
	},
	
	/**
    * Type to describe feature layer to control
    * @typedef {Object} L.SpectrumSpatial.Controls.Feature.FeatureLayer
    * @property {string} tableName Name of the table in feature service
    * @property {string} title Title of table
    * @property {L.SpectrumSpatial.Services.FeatureService.SearchAtPointOptions} options Options to query
    */
	
	/**
	* @class Feature control
	* @augments {L.Control} 
	* @constructs L.SpectrumSpatial.Controls.Feature
	* @param {L.SpectrumSpatial.Services.FeatureService} service Feature service 
	* @param {Array.<L.SpectrumSpatial.Controls.Feature.FeatureLayer>} featureLayers Described feature layers
	* @param {L.SpectrumSpatial.Controls.Feature.Options} [options] Options
	*/
	initialize: function (service, featureLayers, options) {
		L.setOptions(this, options);
        this._service = service;
        this._featureLayers = featureLayers;
	},
	
	
	/**
	* Adds control to map
	* @param {L.Map} map Map for control
	*/
	addTo: function (map) {
		this.remove();
		this._map = map;

        
		var container = this._container = this.onAdd(map);
		
		L.DomUtil.addClass(container, 'leaflet-control');
		var pos = this.getPosition();
		var corner = map._controlCorners[pos];

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}	
		
		return this;
	},
	
	onAdd: function () {
		var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
		var featureInfo = L.DomUtil.create('div','leaflet-ss-control-feature-info');
		L.DomEvent.on(featureInfo, 'click', this._onFeatureInfoClick, this);
		container.appendChild(featureInfo);
		return this._container;
	},
	
	_onFeatureInfoClick: function(e){
		this.setActive(!this._active);
		L.DomEvent.stopPropagation(e);
	},
	
	_getFeatureInfo:function(e){
		//@TODO ADD WAIT
		
		var queryCollector= { position: e.latlng, all: this._featureLayers.length, requested: [] };
		var point =  e.layerPoint;
		var crs = map.options.crs.code;
		
		if (this.options.useDefaultProjection){
			crs =  'EPSG:4326';
			point =  { x: e.latlng.lng, y:e.latlng.lat } ;
		}
		
		for (var i in this._featureLayers){
			var featureLayer = this._featureLayers[i];
			this._service.searchAtPoint(featureLayer.tableName, 
			                             point,
			                             crs,
			                            this._serviceCallback, 
			                            { context:this, collector: queryCollector, layerSettings: featureLayer}, featureLayer.options);
		}
		
	},
	
	_serviceCallback:function(error,response){
		
		var collector = this.collector;
		
		collector.requested.push({ layerSettings:this.layerSettings, data: response });
		
		if (collector.all === collector.requested.length){
			this.context._queryEnded.call(this.context,collector);
		}
	},
	
	_queryEnded:function(collector){
		this._clearPopup();
		this._popup = L.popup()
		    .setLatLng(collector.position)
		    .setContent(this.getPopupHtmlContent(collector.requested))
		    .openOn(this._map);
	},
	
	getPopupHtmlContent:function(requestedData){
		var content ='';
		for(var i=0; i< requestedData.length;i++){
			var featureLayer = requestedData[i];
			content += L.Util.template('<b>{title}</b><br/>',featureLayer.layerSettings);
			content+= '<table><thead><tr>';
			
			var visibleColumns = [];
			
			for(var j in featureLayer.data.Metadata){
				var column = featureLayer.data.Metadata[j];
				if ((column.type !== 'Geometry') & (column.type!=='Style')){
					visibleColumns.push(column.name);
					content+= L.Util.template('<th>{name}</th>',column);
				}
			}
			content+= '</tr></thead><tbody>';
			for(var k in featureLayer.data.features){
				var feature = featureLayer.data.features[k];
				content+= '<tr>';
				
				for(var c in visibleColumns){
					var cName = visibleColumns[c];
					content+= '<td>' + feature.properties[cName] + '</td>';
				}
				
				content+= '</tr>';
			}
			content+= '</tbody></table>';
			
		}
		
		
		return content;
	},
	
	_clearPopup: function(){
		if (this._popup){
			this._map.closePopup(this._popup);
			delete this._popup;
		}
	},
	
	setActive:function(isActive){
		this._active = isActive;
		//@TODO Add active class to DOM object
		if (isActive){
			this._map.on('click', this._getFeatureInfo, this);
		}
		else{
			this._clearPopup();
			this._map.off('click', this._getFeatureInfo, this);
		}
		
	}
});

L.SpectrumSpatial.Controls.feature = function(service, featureLayers, options){
	return new L.SpectrumSpatial.Controls.Feature(service, featureLayers, options);
};