asyncTest("Services.MapService.listNamedLayers test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.listNamedLayers("en_US",callback,{});

    function theTest() {         
        equal(returnJsonData.listNamedLayersResponse.namedLayersList[0], 
              "/Samples/NamedLayers/WorldFeatureLayer" , 
              "Server should return /Samples/NamedLayers/WorldFeatureLayer as ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});