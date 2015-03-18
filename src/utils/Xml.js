/**
* Xml utils
* @namespace
*/
L.SpectrumSpatial.Utils.Xml = {
	
	/**
	* Checking xml namespace, if null return '', if does not have ':', adds it
	* @param {string} ns Namespace
	* @returns {string}
	*/
	checkNs : function(ns){
	   	if ((!ns) || (ns==='')){
			ns = '';
		}
		else{
			if (ns.slice(-1)!==':'){
				ns +=':';
			}			
		}
		return ns;
	},
	
	/**
	* Serializes point to xml string
	* @param {Object} point Point to serialize
	* @param {string} [ns] namespace
	* @returns {string}
	*/
	fromPoint : function(point, ns){
		ns = L.SpectrumSpatial.Utils.Xml.checkNs(ns);
		return L.Util.template('<{ns}Pos><{ns}X>{x}</{ns}X><{ns}Y>{y}</{ns}Y></{ns}Pos>', { x: point.x, y:point.y, ns:ns });
	},
	
	/**
	* Serializes envelope to xml string
	* @param {Object} envelope Envelope to serialize
	* @param {string} [ns] namespace
	* @returns {string}
	*/
	fromEnvelope: function(envelope,ns){
		return L.SpectrumSpatial.Utils.Xml.fromPoint(envelope.min,ns)+
			   L.SpectrumSpatial.Utils.Xml.fromPoint(envelope.max,ns);
	},
	
	/**
	* Serializes geometry to xml string
	* @param {Object} geometry Geometry to serialize
	* @param {string} type Type of geometry
	* @param {string} srsName Spatial reference of geometry
	* @param {string} ns1 namespace for geometry
	* @param {string} ns2 namespace for geometry elements
	* @param {string} [geometryNodeName=Geometry] Name of root element
	* @returns {string}
	*/
	fromGeometry: function(geometry, type, srsName, ns1,ns2, geometryNodeName){
		var data;
		ns1 = L.SpectrumSpatial.Utils.Xml.checkNs(ns1);
		ns2 = L.SpectrumSpatial.Utils.Xml.checkNs(ns2);
		if (!geometryNodeName){
			geometryNodeName = 'Geometry';
		}
		switch(type){
			case 'Point':
			data = L.SpectrumSpatial.Utils.Xml.fromPoint(geometry,ns2);
			break;
			case 'Envelope':
			data = L.SpectrumSpatial.Utils.Xml.fromEnvelope(geometry,ns2);
			break;
		}		
		return L.Util.template('<{ns1}{nodeName} xsi:type="{ns2}{type}" srsName="{srsName}">{data}</{ns1}{nodeName}>', 
								{   
									ns1:ns1, 
									ns2:ns2, 
									type:type, 
									data:data, 
									srsName:srsName,
									nodeName: geometryNodeName
								});
	}
};