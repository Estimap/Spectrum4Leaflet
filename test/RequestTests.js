
asyncTest("Request.get function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var request = Spectrum4Leaflet.Request.get("http://requesttest/", null , null, callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Request.get with login and password function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var request = Spectrum4Leaflet.Request.get("http://requesttestwithlogin/", "admin" , "admin", callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});

asyncTest("Request.jsonp function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var request = Spectrum4Leaflet.Request.jsonp("requestjsonp.js", "?",callback, {});

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

    var request = Spectrum4Leaflet.Request.post("http://requesttest/", JSON.stringify(postData),"application/json", null , null, null, callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "Server should return returns  {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, servicetimeout); 
});
