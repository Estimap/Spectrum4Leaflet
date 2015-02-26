# Spectrum4Leaflet
Leaflet plugin for Spectrum Spatial server.

## Important 
This plugin USES LATEST DEV VERSION of Leaflet

## What is it
This javascript API helps to you work with [Spectrum Spatial server](http://www.mapinfo.com/products/server/) services in Leaflet maps. This API contains base rest-service wrappers, layers for Leaflet maps and controls. 

## What is inside
### Service wrappers
* MapService - all rest operations of map service
* TileService - all rest operations of tile service 
* FeatureService - all rest operations of feature service

### Layers
* MapServiceLayer - simple map layer object for Leaflet map
* TileServiceLayer - tile layer object for Leaflet map

### Controls
* Layers - extended Leaflet Layers control, can change layer's zIndex, opacity and show legend
* Legend - simple legend for MapServiceLayer
* Feature - now has only one function - "search by point" in specified table of feature service

## Using
In your html add reference on leaflet (dev version) and on Spectrum4Leaflet plugin and write down something like:
```
var mapServiceUrl = 'http://localhost:8080/rest/Spatial/MappingService';
var mapName = '/Samples/NamedMaps/MapWithLayer';

var map = L.map('map').setView([0, 0], 1);
		 
L.SpectrumSpatial.Layers.mapServiceLayer(
											L.SpectrumSpatial.Services.mapService(mapServiceUrl), 
											mapName
										).addTo(map);
```
