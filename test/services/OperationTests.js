QUnit.test('Services.Operation functions test', function(assert) {
  var operation = new L.SpectrumSpatial.Services.Operation('layers.json', {getParams: {l: 'en_US'}});

  assert.equal('layers.json;l=en_US', operation.getUrlQuery(), 'getUrlQuery');
  assert.equal(false, operation.isPostOperation(), 'isPostOperation = false');

  operation.options.postParams = {test: 'success'};

  assert.equal(true, operation.isPostOperation(), 'isPostOperation =true');
});
