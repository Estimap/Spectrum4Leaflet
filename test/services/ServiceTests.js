asyncTest('Services.Service.startRequest get test', function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var operation = new L.SpectrumSpatial.Services.Operation('');
    var service = new L.SpectrumSpatial.Services.Service('http://requesttest/');
    
    service.startRequest(operation,callback,{});

    function theTest() {         
        equal(returnJsonData.test, 'success' , 'Server should return {\'test\': \'success\'}');
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest('Services.Service.startRequest post test', function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var operation = new L.SpectrumSpatial.Services.Operation('', { postParams : {test:'success'} });
    var service = new L.SpectrumSpatial.Services.Service('http://requesttest/');
    
    service.startRequest(operation,callback,{});

    function theTest() {         
        equal(returnJsonData.test, 'success' , 'Server should return {\'test\': \'success\'}');
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

test( 'Services.Service.clearParam test', function() {
   var service = new L.SpectrumSpatial.Services.Service('http://requesttest/');
   equal(service.clearParam('/Sample/One/Two'), 'Sample/One/Two', '/***' );
   equal(service.clearParam('/Sample/One/Two/'), 'Sample/One/Two', '/***/' );
   equal(service.clearParam('Sample/One/Two/'), 'Sample/One/Two', '***/' );
});