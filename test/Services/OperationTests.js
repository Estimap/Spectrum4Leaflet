test( "Services.Operation functions test", function() {
   var operation = new Spectrum4Leaflet.Services.Operation("layers.json", { getParams: { l : "en_US" } } );
   
   equal("layers.json;l=en_US", operation.getUrlQuery(), "getUrlQuery" );
   equal(false, operation.isPostOperation(), "isPostOperation = false" );
   
   operation.options.postParams = { test : "success"};
   
   equal(true, operation.isPostOperation(), "isPostOperation =true");
});