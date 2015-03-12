/** 
* @class Spectrum Spatial Geometry Service wrapper
* @augments L.SpectrumSpatial.Services.Service 
* @constructs L.SpectrumSpatial.Services.GeometryService
* @param {string} url Url of service
* @param {Services.Service.Options} options Additional options of service
*/
L.SpectrumSpatial.Services.GeometryService = L.SpectrumSpatial.Services.Service.extend(
/** @lends L.SpectrumSpatial.Services.GeometryService.prototype */
{

});

L.SpectrumSpatial.Services.geometryService = function(url,options){
  return new L.SpectrumSpatial.Services.GeometryService(url,options);
};