
asyncTest("Spectrum4Leaflet.Request.get function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var request = Spectrum4Leaflet.Request.get("http://requesttest", callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, 1000); 
});

asyncTest("Spectrum4Leaflet.Request.post function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };
    
    var postData = { test : "success" };

    var request = Spectrum4Leaflet.Request.post("http://requesttest", JSON.stringify(postData), callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return returns  {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, 1000); 
});
