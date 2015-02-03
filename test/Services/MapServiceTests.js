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
              "Server should return /Samples/NamedLayers/WorldFeatureLayer ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Services.MapService.describeNamedLayer test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.describeNamedLayer("/Samples/NamedLayers/LayerWithTableRangeTheme","en_US",callback,{});

    function theTest() {         
        equal(returnJsonData.layerDescription.name, 
              "/Samples/NamedLayers/LayerWithTableRangeTheme" , 
              "Server should return Samples/NamedLayers/LayerWithTableRangeTheme ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Services.MapService.describeNamedLayers test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.describeNamedLayers(["/Samples/one","/Samples/two"],callback,{});

    function theTest() {         
        equal(returnJsonData.layers.length, 
              2 , 
              "Server should return 2 layer infos ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Services.MapService.listNamedMaps test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.listNamedMaps("en_US",callback,{});

    function theTest() {         
        equal(returnJsonData.Maps.length, 
              3 , 
              "Server should return 3 maps ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Services.MapService.describeNamedMap test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.describeNamedMap("/Samples/NamedMaps/WorldMap","en_US",callback,{});

    function theTest() {         
        equal(returnJsonData.MapDescription.Name, 
              "/Samples/NamedMaps/WorldMap", 
              "Server should return /Samples/NamedMaps/WorldMap ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Services.MapService.describeNamedMaps test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.describeNamedMaps(["/CountriesWithShapeTable","/MapWithLayer","/DoesNotExist"],callback,{});

    function theTest() {         
        equal(returnJsonData.maps.length, 
              2, 
              "Server should return 2 maps infos ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

test( "Services.MapService.getUrlRenderMap tests", function() {

   var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
   
   equal("http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;c=-2.5%2C38.5%2Cepsg%3A4326;z=500%20mi;r=96;l=en_US",
          service.getUrlRenderMapByCenterZoom("Samples/NamedMaps/WorldMap","png",640,480,-2.5,38.5,"500 mi","epsg:4326",96,"en_US"),
          "getUrlRenderMapByCenterZoom" );
          
   equal("http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;c=-2.5%2C38.5%2Cepsg%3A4326;s=10000000;r=96;l=en_US",
          service.getUrlRenderMapByCenterScale("Samples/NamedMaps/WorldMap","png",640,480,-2.5,38.5,10000000,"epsg:4326",96,"en_US"),
          "getUrlRenderMapByCenterScale");
          
   equal("http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;b=-10%2C-10%2C10%2C10%2Cepsg%3A4326;r=72;l=en_US",
          service.getUrlRenderMapByBounds("Samples/NamedMaps/WorldMap","png",640,480,[-10,-10,10,10],"epsg:4326",72,"en_US"),
          "getUrlRenderMapByCenterZoom" );
});

asyncTest("Services.MapService.getLegendForMap test", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
    
    service.getLegendForMap("/Samples/NamedMaps/MapWithLayer", 32,32,"gif", false, null,null ,callback,{});

    function theTest() {         
        equal(returnJsonData.layerName, 
              "World Capitals", 
              "Server should return legend info ");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

test( "Services.MapService.getUrlSwatchForLayer tests", function() {

   var service = new Spectrum4Leaflet.Services.MapService("http://MappingService/");
   
   equal("http://MappingService/maps/Samples/NamedMaps/WorldMap/legends/0/rows/0/swatch/32x32.png;r=96",
          service.getUrlSwatchForLayer("Samples/NamedMaps/WorldMap",0,0,32,32,"png",96),
          "getUrlSwatchForLayer" );
          
});