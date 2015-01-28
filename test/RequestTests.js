
asyncTest("Request.get function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var request = Spectrum4Leaflet.Request.get("http://requesttest/", callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Request.post function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };
    
    var postData = { test : "success" };

    var request = Spectrum4Leaflet.Request.post("http://requesttest/", JSON.stringify(postData), callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return returns  {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});
