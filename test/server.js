/**
This code hides XMLHttpRequest to MockHttpRequest for tests
*/

var server = new MockHttpServer();
server.handle = function (request) {
    
    switch(request.url){
	    case 'http://requesttest':
	        if (request.method === 'GET'){
		       request.setResponseHeader("Content-Type", "application/json");
               request.receive(200, "{ \"test\": \"success\" }" );
	        }
	        if (request.method === 'POST'){
		       request.setResponseHeader("Content-Type", "application/json");
               request.receive(200, request.requestText );
	        }

	    break;
	    default:
	        request.setResponseHeader("Content-Type", "application/robot");
            request.receive(200, "I am Bender, please insert girder!");
	    break;
    }

};
server.start();