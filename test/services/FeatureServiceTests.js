(function(){
	
	var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var service = new L.SpectrumSpatial.Services.FeatureService('http://FeatureService/');
	
	asyncTest('Services.FeatureService.tableList test', function() {
	    expect(1);
	    
	    service.tableList(callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.Tables.length, 
	              2, 
	              'Test server has 2 tables ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.count test', function() {
	    expect(1);

	    service.count(callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.TablesTotalCount, 
	              2, 
	              'Test server has 2 tables ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.featureCount test', function() {
	    expect(1);
	    
	    service.featureCount('/Samples/NamedTables/UK_REGNS',callback,{},{l:'en_US'});
	
	    function theTest() {         
	        equal(returnJsonData.FeaturesTotalCount, 
	              11, 
	              'Table has 11 features ');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.describe test', function() {
	    expect(1);

	    service.describe('/Samples/NamedTables/UK_REGNS',callback,{},'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.Metadata[0].type, 
	              'Geometry', 
	              'return only geometry column');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.searchAtPoint test', function() {
	    expect(1);
	    
	    service.searchAtPoint('/Samples/NamedTables/WorldcapTable/', { x:1 , y:2 }, 'EPSG:4326', callback, {});
	
	    function theTest() {         
	        equal(returnJsonData.type, 
	              'FeatureCollection', 
	              'return collection of features');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.searchNearest test', function() {
	    expect(1);
	    
	    service.searchNearest('/Samples/NamedTables/WorldcapTable/',{"type":"Point"}, callback, {},{withinDistance:'5000 mi'});
	
	    function theTest() {         
	        equal(returnJsonData.type, 
	              'FeatureCollection', 
	              'return collection of features');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.searchId test', function() {
	    expect(1);
	    
	    service.searchId('Samples/NamedTables/​WorldTable/','43', callback, {},null,'en_US');
	
	    function theTest() {         
	        equal(returnJsonData.type, 
	              'FeatureCollection', 
	              'return collection of features');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.searchSQL test', function() {
	    expect(1);
	    
	    service.searchSQL('SELECT * FROM "/Samples/NamedTables/WorldTable" WHERE Country=\'CANADA\'', callback, {});
	
	    function theTest() {         
	        equal(returnJsonData.type, 
	              'FeatureCollection', 
	              'return collection of features');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.insert test', function() {
	    expect(1);
	    
	    service.insert('MyTable', {"type":"FeatureCollection","features": [{ "type": "Feature","id": "1"}]}, callback, {},2);
	
	    function theTest() {         
	        equal(returnJsonData.features[0].id, 
	              '1', 
	              'return inserted 1 feature');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.update test', function() {
	    expect(1);
	    
	    service.update('MyTable', {"type":"FeatureCollection","features": [{ "type": "Feature","id": "1"}]}, callback, {},2);
	
	    function theTest() {         
	        equal(returnJsonData.features[0].id, 
	              '1', 
	              'return updated 1 feature');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.FeatureService.updateSQL test', function() {
	    expect(1);
	    
	    service.updateSQL('update MyTable set MyColumn = \'foo\'', callback, {});
	
	    function theTest() {         
	        equal(returnJsonData.updated, 
	              2, 
	              'return updated 1 feature');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});

})();
