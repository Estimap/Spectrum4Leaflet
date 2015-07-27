(function(){
	
	var returnJsonData = null; 

    var callback = function(response,error) {
	    returnJsonData = response;
    };

    var service = new L.SpectrumSpatial.Services.RoutingService('http://RoutingService/', { dbsource: 'usroutedatabase' });
	
	asyncTest('Services.RoutingService.GetRoute test', function() {
	    expect(1);
	    
	    service.getRoute(
							{x:-73.97, y: 40.79},
							{x:-73.98, y: 40.74},
							'epsg:4326',
							callback,{}
						);
	
	    function theTest() {         
	        equal(returnJsonData.time, 
	              7.67, 
	              'Time is 7.67');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.RoutingService.GetTravelBoundary test', function() {
	    expect(1);
	    
	    service.getTravelBoundary(
							{x:-77.092609, y:38.871256},
							'epsg:4326',
							'5',
							callback,{},
							{ costUnit : 'm'}
						);
	
	    function theTest() {         
	        equal(returnJsonData.travelBoundary.costs[0].cost, 
	              5, 
	              'Cost is 5');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	
})();