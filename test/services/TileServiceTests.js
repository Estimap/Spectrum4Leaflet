(function(){
		    
    var returnJsonData = null; 
    var callback = function(error, response) {
	    returnJsonData = response;
    };
	
	var service = new L.SpectrumSpatial.Services.TileService('http://TilingService/');

	asyncTest('Services.TileService.mapList test', function() {
	    expect(1);
	    
	    service.mapList(callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.Response.length, 4 ,'Server should return 4 tiled layers ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.TileService.description test', function() {
	    expect(1);
	   
	    service.description('/Samples/NamedTiles/WorldTile/', callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.Response.mapName, 'World' ,'Server should return World description');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	test( 'Services.TileService.getTileUrl tests', function() {
	   equal( service.getTileUrl('Samples/NamedTiles/WorldTile/',2,1,1,'png'),
	          'http://TilingService/Samples/NamedTiles/WorldTile/2/1:1/tile.png',
	          'getTileUrl' );
	          
	});

})();