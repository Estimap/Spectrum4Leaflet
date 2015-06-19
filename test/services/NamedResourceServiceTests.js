(function(){
	
	var returnXmlData = null; 
	
	var callback = function(response, error) {
	    returnXmlData = response;
	};
	
	var service = new L.SpectrumSpatial.Services.NamedResourceService('http://NamedResourceService/');
    

	asyncTest('Services.NamedResourceService.listNamedResources test', function() {
	    expect(1);
	
	    service.listNamedResources(callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'list' , 
	              'Server should return <list></list>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.readNamedResource test', function() {
	    expect(1);
	    
	    service.readNamedResource('/Samples/NamedMaps/MapWithLayer',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Resource' , 
	              'Server should return <Resource></Resource>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.deleteNamedResource test', function() {
	    expect(1);
	   	    
	    service.deleteNamedResource('/Samples/NamedMaps/MapWithLayer',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Status' , 
	              'Server should return <Status></Status>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.addNamedResource test', function() {
	    expect(1);

	    service.addNamedResource('<Resource></Resource>',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Status' , 
	              'Server should return <Status></Status>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.updateNamedResource test', function() {
	    expect(1);

	    service.updateNamedResource('<Resource></Resource>',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Status' , 
	              'Server should return <Status></Status>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.searchNamedResource test', function() {
	    expect(1);
	    
	    service.searchNamedResource('/Samples',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Resource' , 
	              'Server should return <Resource></Resource>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.searchReferences test', function() {
	    expect(1);

	    service.searchReferences('/Samples/NamedMaps/MapWithLayer',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Resource' , 
	              'Server should return <Resource></Resource>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.NamedResourceService.searchReferencedIn test', function() {
	    expect(1);

	    service.searchReferencedIn('/Samples/NamedMaps/MapWithLayer',callback,{});
	
	    function theTest() {         
	        equal(returnXmlData.documentElement.nodeName, 
	              'Resource' , 
	              'Server should return <Resource></Resource>');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
})();   
