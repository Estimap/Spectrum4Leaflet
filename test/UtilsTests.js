test( 'Utils sorting operations tests', function() {
   
   function ZObj(z){
	   this.z = z;
	   this.getZ = function(){
		   return z;
	   };
   }
   
   var testarray = [
	   new ZObj(3),
	   new ZObj(1),
	   new ZObj(2)
   ];
   
   testarray.sort(L.SpectrumSpatial.Utils.sortByProperty('z'));
   
   equal(testarray[0].z, 1, 'first z == 1');
   
   testarray.sort(L.SpectrumSpatial.Utils.sortByProperty('z','desc'));
   
   equal(testarray[0].z, 3, 'first z == 3');
   
   testarray.sort(L.SpectrumSpatial.Utils.sortByFuncResult('getZ'));
   
   equal(testarray[0].z, 1, 'first getZ() == 1');
   
   testarray.sort(L.SpectrumSpatial.Utils.sortByFuncResult('getZ','desc'));
   
   equal(testarray[0].z, 3, 'first getZ() == 3');
   
});

test( 'Utils getElementsByName  tests', function() {
   
   var parent = document.createElement('div');
   var child1 = document.createElement('div');
   var child2 = document.createElement('div');
   var child3 = document.createElement('div');
   child3.name = 'testname';
   
   parent.appendChild(child1);
   parent.appendChild(child2);
   child2.appendChild(child3);
   
   document.body.appendChild(parent);
   
   var founded = L.SpectrumSpatial.Utils.getElementsByName(parent, 'testname','div');
   
   equal(founded.length, 1, '1 element with testname');
   
});