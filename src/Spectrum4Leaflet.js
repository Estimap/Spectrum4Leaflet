/**
 * Spectrum for leaftlet namespace
 * @namespace
 */
var Spectrum4Leaflet = {
  Version: '0.1',
  
  /**
  * Spectrum's services
  * @namespace
  */
  Services: {},
  
  
  Layers:{}
};

if(typeof window !== 'undefined' && window.L){
  window.L.spectrum4L = Spectrum4Leaflet;
}