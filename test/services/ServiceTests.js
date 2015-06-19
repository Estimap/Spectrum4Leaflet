(function(){
	
	var returnJsonData = null; 
    var callback = function(response, error) {
	    returnJsonData = response;
    };

    var service = new L.SpectrumSpatial.Services.Service('http://requesttest/');

	test( 'Services.Service.applyParamToXml test', function() {
	   var message = '<elem {id} ></elem>';
	   var id = undefined;
	   equal(service.applyParamToXml(message,id,'id'),  '<elem  ></elem>', 'id is undefined');
	   id = 'id1';
	   equal(service.applyParamToXml(message,id,'id'),  '<elem id="id1" ></elem>', 'id is id1');
	   
	   message = '<elem>{inner}</elem>';
	   var inner = undefined;
	   equal(service.applyParamToXml(message,inner,'inner', true),  '<elem></elem>', 'inner is undefined');
	   inner = "data";
	   equal(service.applyParamToXml(message,inner,'inner', true),  '<elem><inner>data</inner></elem>', 'inner has data');
	});
	
	asyncTest('Services.Service.startRequest get test', function() {
	    expect(1);
	
	    var operation = new L.SpectrumSpatial.Services.Operation('');	    
	    service.startRequest(operation,callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.test, 'success' , 'Server should return {\'test\': \'success\'}');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	asyncTest('Services.Service.startRequest post test', function() {
	    expect(1);
	
	    var operation = new L.SpectrumSpatial.Services.Operation('', { postParams : {test:'success'} });	    
	    service.startRequest(operation,callback,{});
	
	    function theTest() {         
	        equal(returnJsonData.test, 'success' , 'Server should return {\'test\': \'success\'}');
	        start();
	    }
	
	    setTimeout(theTest, servicetimeout); 
	});
	
	test( 'Services.Service.clearParam test', function() {
	   equal(service.clearParam('/Sample/One/Two'), 'Sample/One/Two', '/***' );
	   equal(service.clearParam('/Sample/One/Two/'), 'Sample/One/Two', '/***/' );
	   equal(service.clearParam('Sample/One/Two/'), 'Sample/One/Two', '***/' );
	});

})();