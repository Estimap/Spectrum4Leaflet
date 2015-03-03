test( 'Services.NamedResourceService._applyParam test', function() {
   var service = new L.SpectrumSpatial.Services.NamedResourceService('http://NamedResourceService/');
   var message = '<elem {id} ></elem>';
   var id = undefined;
   equal(service._applyParam(message,id,'id'),  '<elem  ></elem>', 'id is undefined');
   id = 'id1';
   equal(service._applyParam(message,id,'id'),  '<elem id="id1" ></elem>', 'id is id1');
   
   message = '<elem>{inner}</elem>';
   var inner = undefined;
   equal(service._applyParam(message,inner,'inner', true),  '<elem></elem>', 'inner is undefined');
   inner = "data";
   equal(service._applyParam(message,inner,'inner', true),  '<elem><inner>data</inner></elem>', 'inner has data');
});

asyncTest('Services.NamedResourceService.listNamedResources test', function() {
    expect(1);
    
    var returnXmlData = null; 

    var callback = function(error, response) {
	    returnXmlData = response;
    };

    var service = new L.SpectrumSpatial.Services.NamedResourceService('http://NamedResourceService/');
    
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
    
    var returnXmlData = null; 

    var callback = function(error, response) {
	    returnXmlData = response;
    };

    var service = new L.SpectrumSpatial.Services.NamedResourceService('http://NamedResourceService/');
    
    service.readNamedResource('/Samples/NamedMaps/MapWithLayer',callback,{});

    function theTest() {         
        equal(returnXmlData.documentElement.nodeName, 
              'Resource' , 
              'Server should return <Resource></Resource>');
        start();
    }

    setTimeout(theTest, servicetimeout); 
});