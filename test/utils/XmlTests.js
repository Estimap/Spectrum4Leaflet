QUnit.test('Utils.Xml.fromPoint tests', function(assert) {
  var p = {x: 1, y: 2};

  assert.equal(L.SpectrumSpatial.Utils.Xml.fromPoint(p, 'v11'), '<v11:Pos><v11:X>1</v11:X><v11:Y>2</v11:Y></v11:Pos>', '');
});

QUnit.test('Utils.Xml.fromGeometry tests', function(assert) {
  var envelope = {
    min: {x: -79.3456, y: 45.987},
    max: {x: -78.3456, y: 46.987}
  };

  assert.equal(
    L.SpectrumSpatial.Utils.Xml.fromGeometry(envelope, 'Envelope', 'epsg:4326', 'v1', 'v11'),
    '<v1:Geometry xsi:type="v11:Envelope" srsName="epsg:4326"><v11:Pos><v11:X>-79.3456</v11:X><v11:Y>45.987</v11:Y></v11:Pos><v11:Pos><v11:X>-78.3456</v11:X><v11:Y>46.987</v11:Y></v11:Pos></v1:Geometry>',
    ''
  );
});
