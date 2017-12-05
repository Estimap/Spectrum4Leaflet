/**
 * Leaflet namespace
 * @namespace L
 */

/**
 * Leaflet reference systems namespace
 * @namespace L.CRS
 */

/**
 * Spectrum spatial for leaftlet namespace
 * @namespace
 */
L.SpectrumSpatial = {
  Version: '0.4.8',

  /**
   * Spectrum's services
   * @namespace
   */
  Services: {},

  /**
   * Spectrum's services
   * @namespace
   */
  Layers: {},

  /**
   * Controls
   * @namespace
   */
  Controls: {},

  /**
   * Defaults values
   * @namespace
   * @property {string} [proxyUrl=undefined] Proxy url for all services
   * @property {boolean} [alwaysUseProxy=false] All queries will be using proxy
   * @property {boolean} [forceGet=true] Every time use get request (not JSONP)
   * @property {boolean} [encodeUrlForProxy=false] If true proxy params will be url encoded
   */
  Defaults: {

    proxyUrl: undefined,

    alwaysUseProxy: false,

    forceGet: true,

    encodeUrlForProxy: false
  },

  /**
   * Projections
   * @namespace
   */
  Projections: {},

  /**
   * Environment values
   * @namespace
   */
  Support: {
    CORS: ('withCredentials' in new XMLHttpRequest())
  }
};

if(typeof window !== 'undefined' && window.L) {
  window.L.SpectrumSpatial = L.SpectrumSpatial;
}
