/**
* Xml utils
* @namespace
*/
L.SpectrumSpatial.Utils.Xml = {
	
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
	
	fromPoint : function(point, ns){
		ns = L.SpectrumSpatial.Utils.Xml.checkNs(ns);
		return L.Util.template('<{ns}Pos><{ns}X>{x}</{ns}X><{ns}Y>{y}</{ns}Y></{ns}Pos>', { x: point.x, y:point.y, ns:ns });
	},
	
	fromEnvelope: function(envelope,ns){
		return L.SpectrumSpatial.Utils.Xml.fromPoint(envelope.min,ns)+
			   L.SpectrumSpatial.Utils.Xml.fromPoint(envelope.max,ns);
	},
	
	fromGeometry: function(geometry, type, srsName, ns1,ns2){
		var data;
		ns1 = L.SpectrumSpatial.Utils.Xml.checkNs(ns1);
		ns2 = L.SpectrumSpatial.Utils.Xml.checkNs(ns2);
		
		switch(type){
			case 'Point':
			data = L.SpectrumSpatial.Utils.Xml.fromPoint(geometry,ns2);
			break;
			case 'Envelope':
			data = L.SpectrumSpatial.Utils.Xml.fromEnvelope(geometry,ns2);
			break;
		}		
		return L.Util.template('<{ns1}Geometry xsi:type="{ns2}{type}" srsName="{srsName}">{data}</{ns1}Geometry>', 
								{   
									ns1:ns1, 
									ns2:ns2, 
									type:type, 
									data:data, 
									srsName:srsName 
								});
	}
};