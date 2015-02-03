/**
 * Spectrum for leaftlet namespace
 * @namespace
 */
var Spectrum4Leaflet = {
  Version: '0.1.0',
  
  /**
  * Spectrum's services
  * @namespace
  */
  Services: {},
  
  /**
  * Spectrum's services
  * @namespace
  */
  Layers:{},
  
  /**
  * Environment values
  * @namespace
  */
  Support: {
    CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
  }
};

if(typeof window !== 'undefined' && window.L){
  window.L.spectrum4L = Spectrum4Leaflet;
}