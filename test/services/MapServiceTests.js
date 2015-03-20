(function(){
	
	var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new L.SpectrumSpatial.Services.MapService('http://MappingService/');
	    
	
	asyncTest('Services.MapService.listNamedLayers test', function() {
	    expect(1);
	    
	    service.listNamedLayers(callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.listNamedLayersResponse.namedLayersList[0], 
	              '/Samples/NamedLayers/WorldFeatureLayer' , 
	              'Server should return /Samples/NamedLayers/WorldFeatureLayer ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.MapService.describeNamedLayer test', function() {
	    expect(1);

	    service.describeNamedLayer('/Samples/NamedLayers/LayerWithTableRangeTheme',callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.layerDescription.name, 
	              '/Samples/NamedLayers/LayerWithTableRangeTheme' , 
	              'Server should return Samples/NamedLayers/LayerWithTableRangeTheme ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.MapService.describeNamedLayers test', function() {
	    expect(1);
	    
	    service.describeNamedLayers(['/Samples/one','/Samples/two'],callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.layers.length, 
	              2 , 
	              'Server should return 2 layer infos ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.MapService.listNamedMaps test', function() {
	    expect(1);
	    
	    service.listNamedMaps(callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.Maps.length, 
	              3 , 
	              'Server should return 3 maps ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.MapService.describeNamedMap test', function() {
	    expect(1);
	    
	    service.describeNamedMap('/Samples/NamedMaps/WorldMap',callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.MapDescription.Name, 
	              '/Samples/NamedMaps/WorldMap', 
	              'Server should return /Samples/NamedMaps/WorldMap ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.MapService.describeNamedMaps test', function() {
	    expect(1);
	    
	    service.describeNamedMaps(['/CountriesWithShapeTable','/MapWithLayer','/DoesNotExist'],callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.maps.length, 
	              2, 
	              'Server should return 2 maps infos ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	test( 'Services.MapService.getUrlRenderMap tests', function() {
	
	   var renderOptions = {
		   mapName : 'Samples/NamedMaps/WorldMap',
		   imageType : 'png',
		   width:640,
		   height:480,
		   cx:-2.5,
		   cy:38.5,
		   zoom:'500 mi',
		   srs:'epsg:4326',
		   resolution:96,
		   locale:'en_US'
	   };
	   equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;c=-2.5%2C38.5%2Cepsg%3A4326;z=500%20mi;r=96;l=en_US',
	          service.getUrlRenderMap(renderOptions),
	          'getUrlRenderMapByCenterZoom' );
	   
	   renderOptions.zoom = null;
	   renderOptions.scale = 10000000;
	   
	   equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;c=-2.5%2C38.5%2Cepsg%3A4326;s=10000000;r=96;l=en_US',
	          service.getUrlRenderMap(renderOptions),
	          'getUrlRenderMapByCenterScale');
	          
	   renderOptions.scale = null;
	   renderOptions.cx = null;
	   renderOptions.cy = null;   
	   renderOptions.bounds = [-10,-10,10,10];    
	   renderOptions.resolution = 72;
	      
	   equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/image.png;w=640;h=480;b=-10%2C-10%2C10%2C10%2Cepsg%3A4326;r=72;l=en_US',
	          service.getUrlRenderMap(renderOptions),
	          'getUrlRenderMapByCenterZoom' );
	});
	
	asyncTest('Services.MapService.getLegendForMap test', function() {
	    expect(1);

	    var legendOptions = {
		    mapName :'/Samples/NamedMaps/MapWithLayer',
		    width:32,
		    height:32,
		    imageType:'gif',
		    inlineSwatch:false
	    };
	    service.getLegendForMap(legendOptions ,callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.layerName, 
	              'World Capitals', 
	              'Server should return legend info ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	test( 'Services.MapService.getUrlSwatchForLayer tests', function() {
	
	    var swatchOptions = {
		    mapName :'/Samples/NamedMaps/WorldMap',
		    width:32,
		    height:32,
		    imageType:'png',
		    legendIndex:0,
		    rowIndex:0,
		    resolution:96
	    };
	    equal('http://MappingService/maps/Samples/NamedMaps/WorldMap/legends/0/rows/0/swatch/32x32.png;r=96',
	          service.getUrlSwatchForLayer(swatchOptions),
	          'getUrlSwatchForLayer' );
	          
	});

})();