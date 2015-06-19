L.SpectrumSpatial.Controls.Feature = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Feature.prototype */  
    
    className: 'leaflet-ss-control-feature',
    
    /**
    * Feature control options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Feature.Options
    * @property {number} [pixelTolerance=0] Tolerance in pixels on map
    * @property {Array.<string>} [hideTypes] Array of column's types which should be hided
    * @property {boolean} [showIfEmpty] If true - shows popup every time on response (even response has no features)
    * @property {boolean} [useDefaultProjection] Use EPSG:4326 coordinates in spatial queries
    */
    
    options: {
        pixelTolerance:0,
        hideTypes: ['Geometry','Style'],
        showIfEmpty:false,
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
    * @memberof L.SpectrumSpatial.Controls.Feature.prototype
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
        this._featureInfo = L.DomUtil.create('div','leaflet-ss-control-feature-info');
        L.DomEvent.on(this._featureInfo , 'click', this._onFeatureInfoClick, this);
        container.appendChild(this._featureInfo );
        return this._container;
    },
    
    _onFeatureInfoClick: function(e){
        this.setActive(!this._active);
        L.DomEvent.stopPropagation(e);
    },
    
    _getFeatureInfo:function(e){
        if (!this._waitImage){
            this._waitImage = L.DomUtil.create('div','leaflet-ss-wait');
        }
        this._featureInfo.style.display="none";
        this._container.appendChild(this._waitImage);
        
        var queryCollector= { position: e.latlng, all: this._featureLayers.length, requested: [], hasFeatures:false };
        var point =  e.layerPoint;
        var crs = map.options.crs.code;
        
        if (this.options.useDefaultProjection){
            crs =  'EPSG:4326';
            point =  { x: e.latlng.lng, y:e.latlng.lat } ;
        }
        var tolerance;
        if (this.options.pixelTolerance!==0){
            tolerance = Math.round(L.SpectrumSpatial.Utils.countPixelDistance(this._map,this.options.pixelTolerance,e.latlng));
        }
        
        
        for (var i in this._featureLayers){
            var featureLayer = this._featureLayers[i];
            featureLayer.options = featureLayer.options || {};
            var options = L.SpectrumSpatial.Utils.merge({},featureLayer.options);
            
            if ((featureLayer.options.tolerance===undefined) & (tolerance!==undefined)){
                options.tolerance =  tolerance + ' m';
            }
        
            this._service.searchAtPoint(featureLayer.tableName, 
                                         point,
                                         crs,
                                        this._serviceCallback, 
                                        { context:this, collector: queryCollector, layerSettings: featureLayer}, options);
        }
        
    },
    
    
    
    _serviceCallback:function(response,error){
        
        var collector = this.collector;
        
        if ((response.features) && (response.features.length>0)){
            collector.hasFeatures = true;
        }
        
        collector.requested.push({ layerSettings:this.layerSettings, data: response });
        
        if (collector.all === collector.requested.length){
            this.context._queryEnded.call(this.context,collector);
        }
    },
    
    _queryEnded:function(collector){
        this._featureInfo.style.display="block";
        this._container.removeChild(this._waitImage);
        
        this._clearPopup();
        
        
        if (!(this.options.showIfEmpty | collector.hasFeatures)){
            return;
        }
        
        this._popup = L.popup()
            .setLatLng(collector.position)
            .setContent(this.getPopupHtmlContent(collector.requested))
            .openOn(this._map);
    },
    
    getPopupHtmlContent:function(requestedData){
        var content ='';
        for(var i=0; i< requestedData.length;i++){
            var featureLayer = requestedData[i];
            
            if (!((featureLayer.data.features) && (featureLayer.data.features.length>0))){
                continue;
            }
            
            content += L.Util.template('<b>{title}</b><br/>',featureLayer.layerSettings);
            content+= '<table><thead><tr>';
            
            var visibleColumns = [];
            
            for(var j in featureLayer.data.Metadata){
                var column = featureLayer.data.Metadata[j];
                if ( this.options.hideTypes.indexOf(column.type)===-1){
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
        if (isActive){
            this._map.on('click', this._getFeatureInfo, this);
            L.DomUtil.addClass(this._featureInfo , 'leaflet-ss-control-feature-activated');
        }
        else{
            this._clearPopup();
            this._map.off('click', this._getFeatureInfo, this);
            L.DomUtil.removeClass(this._featureInfo , 'leaflet-ss-control-feature-activated');
        }
        
    }
});

L.SpectrumSpatial.Controls.feature = function(service, featureLayers, options){
    return new L.SpectrumSpatial.Controls.Feature(service, featureLayers, options);
};