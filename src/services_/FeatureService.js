/** 
* @class Spectrum Spatial Feature Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.FeatureService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.FeatureService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.FeatureService# */
{
    /**
    * List all Available Tables
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] The locale in which to return the table information.
    */
    tableList : function(callback, context,locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables.json');
        if (locale){
		    operation.options.getParams.l = locale;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Total number of all Available Tables
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] The locale in which to return the table information.
    */
    count : function(callback, context,locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/count');
        if (locale){
		    operation.options.getParams.l = locale;
	    }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Count features operation options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.FeatureCountOptions
    * @property {string} [q] The query method to perform. This must be searchAtPoint 
    * @property {string} [point] The point used as the starting location for the search. For example: point=-75.651157,45.374245,EPSG:4326
    * @property {string} [tolerance] The distance to search around the point. By default the tolerance is 300 meters
    * @property {string} [geometryAttributeName] The geometry definition attribute from the table that should be used for processing the spatial query. This attribute is only required for tables that contain more than one geometry attribute definition.
    * @property {string} [l] The locale in which to return the table information
	*/
    
    /**
    * Number of Features in a Table
    * @param {string} tableName The name of the table to return feature metadata
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.FeatureCountOptions} [options] Additional options
    */
    featureCount : function(tableName, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features/count',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Describe a Table's Metadata
    * @param {string} tableName The name of the table to return metadata
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [locale] The locale in which to return the table information.
    */
    describe : function(tableName, callback, context, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/metadata.json');
        if (locale){
	        operation.options.getParams.l = locale;
        }
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Insert a Feature into a Table
    * @param {string} tableName The name of the table to insert the features
    * @param {Object} features Features to insert
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {integer} [commitInterval] The number of inserts that will be processed in a transaction
    */
    insert : function(tableName, features, callback, context, commitInterval){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.action = 'insert';
        if (commitInterval){
	        operation.options.getParams.commitInterval = commitInterval;
        }
        operation.options.postParams = features;
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * SearchAtPoint function's options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.SearchAtPointOptions
    * @property {string} [attributes] The attribute names of the table to be returned in the response.
    * @property {string} [orderBy] The attribute name and direction to order the returned results
    * @property {string} [tolerance] The distance to search around the point. By default the tolerance is 300 meters
    * @property {string} [geometryAttributeName] The geometry definition attribute from the table that should be used for processing the spatial query  
    * @property {string} [page] The page number to return   
    * @property {string} [pageLength] The number of features returned on each page 
    * @property {string} [l] The locale in which to return the table information
	*/
    
    /**
    * Search a Table for Features at a Point
    * @param {string} tableName The name of the table to insert the features
    * @param {Object} point Point. example { x:'1',y:'1'}
    * @param {string} srs Reference system code. Example 'EPSG:4326'
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.SearchAtPointOptions} [options] Additional options
    */
    searchAtPoint : function(tableName, point, srs, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = 'searchAtPoint';
        operation.options.getParams.point = point.x + ',' + point.y + ',' + srs;
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * SearchNearest function's options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.SearchNearestOptions
    * @property {string} [attributes] The attribute names of the table to be returned in the response.
    * @property {string} [orderBy] The attribute name and direction to order the returned results
    * @property {string} [withinDistance] The distance to search around the geometry. By default the search distance is 300 meters
    * @property {string} [distanceAttributeName] The name of the distance attribute to be returned in the response.
    * @property {string} [geometryAttributeName] The geometry definition attribute from the table that should be used for processing the spatial query  
    * @property {string} [page] The page number to return   
    * @property {string} [pageLength] The number of features returned on each page 
    * @property {string} [l] The locale in which to return the table information
    * @property {string} [maxFeatures] The total number of features returned in the response. By default this value is 1000 features
	*/
    
    /**
    * Search a Table for Features Nearest to a Geometry
    * @param {string} tableName The name of the table to insert the features
    * @param {Object} geometry Geometry
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.SearchNearestOptions} [options] Additional options
    */
    searchNearest : function(tableName, geometry, callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = 'searchNearest';
        operation.options.getParams.geometry = JSON.stringify(geometry);
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Search for Features by ID
    * @param {string} tableName The name of the table to insert the features
    * @param {string} id Identifier
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {string} [attributes] The attribute names of the feature to be returned in the response
    * @param {string} [locale] The locale in which to return the table information
    */
    searchId : function(tableName, id, callback, context, attributes, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json' + 
															     ((attributes) ? (';attributes='+attributes) : '' ) +
															     ((locale) ? (';l='+locale) : '' ) +
																 '/'+ id );
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * SearchSQL function's options
	* @typedef {Object} L.SpectrumSpatial.Services.FeatureService.SearchSQLOptions
    * @property {string} [page] The page number to return   
    * @property {string} [pageLength] The number of features returned on each page 
    * @property {string} [l] The locale in which to return the table information
	*/
    
    /**
    * Search for Features Using SQL Queries
    * @param {string} query The query to perform in SQL format.
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {L.SpectrumSpatial.Services.FeatureService.SearchSQLOptions} [options] Additional options
    */
    searchSQL : function( query , callback, context, options){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.q = query;
        L.SpectrumSpatial.Utils.merge(operation.options.getParams,options);
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Update Features by Primary Key
    * @param {string} tableName The name of the table for which you are updating features
    * @param {Object} features Features to update
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {integer} [commitInterval] The number of inserts that will be processed in a transaction
    */
    update : function(tableName, features, callback, context, commitInterval){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/'+this.clearParam(tableName)+'/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.action = 'update';
        if (commitInterval){
	        operation.options.getParams.commitInterval = commitInterval;
        }
        operation.options.postParams = features;
	    this.startRequest(operation, callback, context);
    },
    
    /**
    * Update Features Using SQL
    * @param {string} query SQL query
    * @param {Request.Callback} callback Callback of the function
    * @param {Object} context Context for callback
    * @param {Object} [boundParams] Bound parameters
    * @param {string} [locale] The locale in which to return the table information
    */
    updateSQL : function(query, callback, context, boundParams, locale){  
        var operation = new L.SpectrumSpatial.Services.Operation('tables/features.json',
																 { paramsSeparator: '&', queryStartCharacter:'?'});
        operation.options.getParams.update = query;
        if (locale){
	        operation.options.getParams.l = locale;
        }
        if (boundParams){
	        operation.options.postParams = boundParams;
        }
        
	    this.startRequest(operation, callback, context);
    },
    
    
});

L.SpectrumSpatial.Services.featureService = function(url,options){
  return new L.SpectrumSpatial.Services.FeatureService(url,options);
};