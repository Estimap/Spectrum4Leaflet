/**
This tests needs jsonplaceholder (Fake json node.js server) to be installed
*/


asyncTest("Spectrum4Leaflet.Request.get function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };

    var request = Spectrum4Leaflet.Request.get("http://localhost:3000/posts/1", callback, {});

    function theTest() {         
        equal(returnJsonData.id, 1 , "http://localhost:3000/posts/1  {\"id\": 1}");
        start();
    }

    setTimeout(theTest, 2000); 
});

asyncTest("Spectrum4Leaflet.Request.post function", function() {
    expect(1);
    
    var returnJsonData = null; 

    var callback = function(error, response) {
	    returnJsonData = response;
    };
    
    var postData = { test : "success" };

    var request = Spectrum4Leaflet.Request.post("http://localhost:3000/posts", JSON.stringify(postData), callback, {});

    function theTest() {         
        equal(returnJsonData.test, "success" , "http://localhost:3000/posts returns  {\"test\": \"success\"}");
        start();
    }

    setTimeout(theTest, 2000); 
});
