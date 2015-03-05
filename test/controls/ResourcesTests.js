test( 'Controls.Resources._addOrFind functions test', function() {
   var control = new L.SpectrumSpatial.Controls.Resources({},{});
   
   
   var resources = [
	   { type: 'NamedTable', path:'Samples/NamedTables/Table1' },
	   { type: 'NamedTable', path:'Samples/NamedTables/Table2' },
	   { type: 'NamedMap', path:'Samples/NamedMaps/MapWithLayer' },
	   { type: 'NamedMap', path:'MapWithPieLayer' }
   ];
   var tree= { childs:[] };
   
   for (var i in resources){
	   var res = resources[i];
	   
	   control._addOrFind(tree, res, res.path.split('/'));
   }
   
   
   equal(tree.childs.length, 2, '2 childs' );
});