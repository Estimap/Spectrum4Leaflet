/**
* Usefull utils
* @namespace
*/
L.SpectrumSpatial.Utils = {
	
	/**
	 * Function compares two object. If object A "greater" then object B returns 1, if on the contrary -1, if equal 0
	 * @function CompareFunction
	 * @param {Object} a Object A
	 * @param {Object} b Object B
	 * @returns {number} 
	 */
	
	/**
	* Object array's sorting function (by specified property name)
	* @param {string} property Property name
	* @param {string=} [order=asc] Sorting order. Can be "asc" for ascending order or "desc" descending order.
	* @returns {CompareFunction}
    */
    sortByProperty :  function(property, order) {
	    var sortOrder = (order === "desc") ? -1:1;
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    };
	},
	
	/**
	* Object array's sorting function (by specified function name)
	* @param {string} funcname Function name
	* @param {string=} [order=asc] Sorting order. Can be "asc" for ascending order or "desc" descending order.
	* @returns {CompareFunction}
    */
	sortByFuncResult :  function(funcname, order) {
	    var sortOrder = (order === "desc") ? -1:1;
	    return function (a,b) {
	        var result = (a[funcname]() < b[funcname]()) ? -1 : (a[funcname]() > b[funcname]()) ? 1 : 0;
	        return result * sortOrder;
	    };
	}
	
};