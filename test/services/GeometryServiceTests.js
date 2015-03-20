(function(){
	
	var service = new L.SpectrumSpatial.Services.GeometryService('http://GeometryService/');
   	var returnXmlData = null; 
	
	var callback = function(error, response) {
		returnXmlData = response;
	};
	
	var envelope = {
		   min : {x:-79.3456, y:45.987},
		   max : {x:-78.3456, y:46.987}
	    };	    
	var geometryXmlText = L.SpectrumSpatial.Utils.Xml.fromGeometry(envelope,'Envelope','epsg:4326','v1','v11')
	
	asyncTest('Services.GeometryService.buffer test', function() {
	    expect(1);
	      	    
	    service.buffer(geometryXmlText, 10, callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'BufferResponse' , 
	              'Server should return BufferResponse');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.GeometryService.area test', function() {
	    expect(1);
	    
	    service.area(geometryXmlText, 'meters', callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'AreaResponse' , 
	              'Server should return AreaResponse');
	        start();
	    }
	    	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.GeometryService.area test', function() {
	    expect(1);
	    
	    service.area(geometryXmlText, 'meters', callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'AreaResponse' , 
	              'Server should return AreaResponse');
	        start();
	    }
	    	
	    setTimeout(theTest, servicetimeout); 
	});
	
})();

