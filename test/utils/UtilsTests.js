QUnit.test('Utils sorting operations tests', function(assert) {

  function ZObj(z) {
    this.z = z;
    this.getZ = function() {
      return z;
    };
  }

  var testarray = [
    new ZObj(3),
    new ZObj(1),
    new ZObj(2)
  ];

  testarray.sort(L.SpectrumSpatial.Utils.sortByProperty('z'));

  assert.equal(testarray[0].z, 1, 'first z == 1');

  testarray.sort(L.SpectrumSpatial.Utils.sortByProperty('z', 'desc'));

  assert.equal(testarray[0].z, 3, 'first z == 3');

  testarray.sort(L.SpectrumSpatial.Utils.sortByFuncResult('getZ'));

  assert.equal(testarray[0].z, 1, 'first getZ() == 1');

  testarray.sort(L.SpectrumSpatial.Utils.sortByFuncResult('getZ', 'desc'));

  assert.equal(testarray[0].z, 3, 'first getZ() == 3');

});

QUnit.test('Utils getElementsByName  tests', function(assert) {

  var parent = document.createElement('div');
  var child1 = document.createElement('div');
  var child2 = document.createElement('div');
  var child3 = document.createElement('div');
  child3.name = 'testname';

  parent.appendChild(child1);
  parent.appendChild(child2);
  child2.appendChild(child3);

  document.body.appendChild(parent);

  var founded = L.SpectrumSpatial.Utils.getElementsByName(parent, 'testname', 'div');

  assert.equal(founded.length, 1, '1 element with testname');

});

QUnit.test('Utils merge  tests', function(assert) {

  var dest = {someParams: {a: 'a'}};
  var src = {b: 'b', c: 'c'};

  L.SpectrumSpatial.Utils.merge(dest.someParams, src);

  assert.equal(dest.someParams.a, 'a', 'a=a');
  assert.equal(dest.someParams.b, 'b', 'b=b');
  assert.equal(dest.someParams.c, 'c', 'c=c');

});

QUnit.test('Utils countPixelDistance  tests', function(assert) {
  var maptest = L.DomUtil.create('div');
  maptest.id = 'testmap';
  document.body.appendChild(maptest);
  var lmap = new L.Map('testmap');
  lmap.setView([0, 0], 0);
  var distance = L.SpectrumSpatial.Utils.countPixelDistance(lmap, 10, {lat: 0, lng: 0});

  assert.equal(Math.round(distance), 1563679, 'distance  = 1563679 meters');
  document.body.removeChild(maptest);
});
