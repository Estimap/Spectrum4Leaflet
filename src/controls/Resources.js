L.SpectrumSpatial.Controls.Resources = L.Control.extend({
/** @lends L.SpectrumSpatial.Controls.Resources.prototype */ 
    
    className: 'leaflet-ss-control-resources',
    
    /**
    * Resources options class
    * @typedef {Object} L.SpectrumSpatial.Controls.Resources.Options
    * @property {Object} [onItemClick] On item click. like  function(resource) { resource.name; resource.type; resource.path }
    * @property {Object} [onItemClickContext] Context for on item click function
    * @property {string} [maxHeight] Max height for control, if overflow - scrolls
    * @property {string} [maxWidth] Max width for control, if overflow - scrolls
    * @property {boolean} [cssOff] If is true, control rednders without css class ( usefull when you draw outside of the map)
    * @property {string} [path] Path to resource
    * @property {string} [resourceType] Type of resources to show
    * @property {string} [locale] Locale
    */
    
    options: {
        position: 'bottomleft',
    },

    /**
    * @class Resources control
    * @augments {L.Control} 
    * @constructs L.SpectrumSpatial.Controls.Resources
    * @param {L.SpectrumSpatial.Services.NamedResourceService} service Named resource service
    * @param {L.SpectrumSpatial.Controls.Resources.Options} [options] Options
    */
    initialize: function (service, options) {
        L.setOptions(this, options);
        this._service = service;
    },

    /**
    * Adds control to map
    * @memberof L.SpectrumSpatial.Controls.Resources.prototype
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
        this._requestResources();
        return this._container;
    },
    
    _requestResources: function(){
        this._service.listNamedResources(this._resourceCallback, this, this.options);
        L.DomUtil.empty(this._resourcesList);
        var waitImage = L.DomUtil.create('div','leaflet-ss-wait');
        this._resourcesList.appendChild(waitImage);
    },
    
    _resourceCallback: function(error,response){
        if (!error){
	        
	        // @TODO REWORK. TOO UGLY CODE
	        var resources= { childs:[] };
	        var listNode = response.firstChild.firstChild.firstChild;
	        for (var i in listNode.childNodes){
		        var nrNode = listNode.childNodes[i];
		        
		        if (!nrNode.firstChild){
			        continue;
		        }
		        path = this._service.clearParam(nrNode.firstChild.innerHTML);
		        var resource = { 
							        type:  (nrNode.attributes && nrNode.attributes.resourceType)? nrNode.attributes.resourceType.value : undefined,
							        path : path
						        };	
						        
				var pathComponents = resource.path.split('/');
				
				this._addOrFind(resources, resource, pathComponents);
				       
	        }
	        
            this._resources = resources; 
            this._update();
        }
    },
    
    _addOrFind: function(parent, resource, components){
	    var name = components[0];
	    var finded;
	    for (var i in parent.childs){
		    var child = parent.childs[i];
		    
		    if (child.name === name){
			    finded = child;
			    break;
		    }
	    }
	    if (components.length>1){
		    if (!finded){
			    finded = { name: name, childs:[] };
			    parent.childs.push(finded);
		    }
		    components.splice(0, 1);
		    this._addOrFind(finded, resource, components);
	    }else{
		    parent.childs.push( { name: name, type: resource.type, path:resource.path }  );
	    }
	    
    },
    
         
    _update: function () {
        if (!this._container) { return this; }
        if (!this._resources) { return this; }
        
        L.DomUtil.empty(this._resourcesList);
        var mainNode = this._createResourceNode(this._resources.childs);
        L.DomUtil.addClass(mainNode, 'leaflet-ss-control-resources-mainnode');
        this._resourcesList.appendChild(mainNode);     
        return this;
    },
    
    _createResourceNode:function(childs, collapsed){
	    var node = L.DomUtil.create('div','leaflet-ss-control-resources-node');
	    if (collapsed){
		    L.DomUtil.addClass(node, 'leaflet-ss-control-resources-node-collapsed');
	    }
	    for (var i in childs){
		    var child = childs[i];
		    var row = L.DomUtil.create('div', 'leaflet-ss-row');
		    node.appendChild(row);
		    
		    var item;
		    
		    if (child.childs){
			    var innerRow = L.DomUtil.create('div', 'leaflet-ss-row');
			    var inner = this._createResourceNode(child.childs,true);
			    innerRow.appendChild(inner);
			    node.appendChild(innerRow);
			    
			    var expand = L.DomUtil.create('div', 'leaflet-ss-cell leaflet-ss-control-resources-directory');
			    expand.expanded = false;
			    expand.inner = inner;
			    L.DomEvent.on(expand, 'click', this._onExpand , this);
			    row.appendChild(expand);
			    
			    item = L.DomUtil.create('div', 'leaflet-ss-cell');
		        
		    }
		    else{
			    item = L.DomUtil.create('a', 'leaflet-ss-cell leaflet-ss-control-resources-item{');
			    item.href='#';
			    item.resource = child;
			    L.DomEvent.on(item, 'click', this._onClick , this);
		    }
            item.innerHTML = child.name;
		    row.appendChild(item);		    
	    }
	    return node;
    },
    
    _onClick:function(e){
	    if (this.options.onItemClick){
		    this.options.onItemClick.call(this.options.onItemClickContext, e.currentTarget.resource);
	    }
	},
    
    _onExpand:function(e){
	    if (e.currentTarget.expanded){
		    L.DomUtil.addClass(e.currentTarget.inner, 'leaflet-ss-control-resources-node-collapsed');
		    L.DomUtil.removeClass(e.currentTarget, 'leaflet-ss-control-resources-directory-expanded');
	    }
	    else{
		    L.DomUtil.removeClass(e.currentTarget.inner, 'leaflet-ss-control-resources-node-collapsed');
		    L.DomUtil.addClass(e.currentTarget, 'leaflet-ss-control-resources-directory-expanded');
	    }
	    
	    e.currentTarget.expanded = !e.currentTarget.expanded;
    },
    
    
    _initLayout: function () {
        var container = this._container = L.DomUtil.create('div', this.options.cssOff ? '' : this.className);
        this._resourcesList = L.DomUtil.create('div', this.className + '-list', container);
        if (this.options.maxHeight){
	        this._resourcesList.style.maxHeight = this.options.maxHeight;
        }
        if (this.options.maxWidth){
	        this._resourcesList.style.maxWidth = this.options.maxWidth;
        }
    },
});

L.SpectrumSpatial.Controls.resources = function(service , options){
    return new L.SpectrumSpatial.Controls.Resources(service, options);
};