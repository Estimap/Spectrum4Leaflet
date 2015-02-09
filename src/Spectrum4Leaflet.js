/**
 * Leaflet namespace
 * @namespace L
 */



/**
* Spectrum spatial for leaftlet namespace
* @namespace
*/
L.SpectrumSpatial = {
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
  * Controls
  * @namespace
  */
  Controls:{},
  
  /**
  * Environment values
  * @namespace
  */
  Support: {
    CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
  }
};

if(typeof window !== 'undefined' && window.L){
  window.L.SpectrumSpatial = L.SpectrumSpatial;
}