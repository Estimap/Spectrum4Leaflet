var servicetimeout = 50;

/**
This code hides XMLHttpRequest to MockHttpRequest for tests
*/

function recieve(request, returnedObject, type){
	if (!type){
	    type = 'application/json';
	}
	request.setResponseHeader('Content-Type', type);
	request.receive(200, JSON.stringify(returnedObject) );
};

var server = new MockHttpServer();
server.handle = function (request) {
    
    switch(decodeURIComponent(request.url)){
	    case 'http://requesttest/':
	        if (request.method === 'GET'){
	           recieve(request , { 'test': 'success' });
	        }
	        if (request.method === 'POST'){
               recieve(request, JSON.parse (request.requestText) );
	        }
	    break;
	    case 'http://requesttestwithlogin/':
	           if (request.user =='admin' & request.password=='admin'){
		           recieve(request,  { 'test': 'success' });
	           }       
	    break;
	    case 'http://requesttest/;callback=window._Spectrum4LeafletCallbacks.c0':
	           request.setResponseHeader('Content-Type', 'application/json');
	           request.receive(200, ' { window._Spectrum4LeafletCallbacks.c0(\'test\': \'success\' });' );
	    break;
	    case 'http://MappingService/layers.json;l=en_US':
               recieve(request , { 'listNamedLayersResponse': {'namedLayersList': ['/Samples/NamedLayers/WorldFeatureLayer'] } } );
	    break;
	    case 'http://MappingService/layers/Samples/NamedLayers/LayerWithTableRangeTheme.json;l=en_US':
               recieve(request, { 'layerDescription': {'name': '/Samples/NamedLayers/LayerWithTableRangeTheme', 'layer': {} } } );
	    break;
	    case 'http://MappingService/layers.json?q=describe&layers=/Samples/one,/Samples/two':
               recieve(request, { 'layers': [ {},{} ]} );
	    break;
	    case 'http://MappingService/maps.json;l=en_US':
               recieve(request,{
								    'Maps':
								    [
								        '/Samples/NamedMaps/MapWithBarLayer',
								        '/Samples/NamedMaps/CountriesWithShapeTable',
								        '/Samples/NamedMaps/MapWithLayerStyle',
								    ]
								} );
	    break;
	    case 'http://MappingService/maps/Samples/NamedMaps/WorldMap.json;l=en_US':
               recieve(request,{
									'MapDescription':{
										'Version':'1.0',
										'Name':'/Samples/NamedMaps/WorldMap',
										'Layers':[
											{
												'NamedLayer':{
													'Name':'/Samples/NamedLayers/WorldFeatureLayer',
													'Description':'World Countries',
													'NamedTableRef':'/Samples/NamedTables/WorldTable',
													'Renderable':true
												}
											},
										]
									}
								} );
	    break;
	    case 'http://MappingService/maps.json?q=describe&maps=/CountriesWithShapeTable,/MapWithLayer,/DoesNotExist':
               recieve(request,{
								  'maps': [
								    {
								      'MapDescription': {}
								    },
								    {
								      'MapDescription': {}
								    }
								  ],
								  'errorMessages': [
								    {
								      'name': '/DoesNotExist',
								     'message': 'RepositoryEx_ResourceNotFound: Resource was not found - /DoesNotExist'
								    }
								  ]
								} );
	    break;
	    case 'http://MappingService/maps/Samples/NamedMaps/MapWithLayer/legends.json;w=32;h=32;t=gif;?inlineSwatch=false':
               recieve(request,        {
									      'layerName': 'World Capitals',
									      'rows': [      {
									        'description': 'Point',
									        'swatch': 'http://www.pbbi.com/MappingService/services/rest/maps/Samples/NamedMaps/MapWithLayer/legends/0/rows/0/swatch/16x32.png'
									      }],
									      'title': 'World Capitals',
									      'type': 'CARTOGRAPHIC'
									    } );
	    break;
	    case 'http://TilingService/mapList.json':
               recieve(request,        { 'Response':[
                                                      '/Samples/NamedTiles/WorldTile',
                                                      '/Samples/NamedTiles/UKCountriesTile',
                                                      '/Samples/NamedTiles/USATile',
                                                      '/Samples/NamedTiles/UK_REGNSTile'
                                                    ]});
	    break;
	    case 'http://TilingService/Samples/NamedTiles/WorldTile/description.json':
               recieve(request, {'Response': { 
                                                  'mapName':'World',
                                                  'description':'Map Of The World',
                                                  'namedMapLocation':'/Samples/NamedMaps/WorldMap',
                                                  'coordSys':'epsg:3857',
                                                  'minimumLevel':1,
                                                  'maximumLevel':20,
                                                  'tileWidth':256,
                                                  'tileHeight':256,
                                                  'bounds':{ 
                                                              'maxX':2.003750834E7,
                                                              'maxY':2.003750834E7,
                                                              'minX':-2.003750834E7,
                                                              'minY':-2.003750834E7
                                                           },
                                                  'outputTypes':['image/png','image/jpeg','image/gif'],
                                                  'mapExpirationDate':'Tue Dec 31 00:00:00 EST 2019',
                                                  'mapResolution':96,
                                                  'mapRendering':'SPEED',
                                                  'rasterRendering':'SPEED',
                                                  'renderLabels':false,
                                                  'mapPadFactor':1,
                                                  'backgroundOpacity':0.5}});
	    break;
	    default:
            recieve(request, 'I am Bender, please insert girder!','application/robot');
	    break;
    }

};
server.start();