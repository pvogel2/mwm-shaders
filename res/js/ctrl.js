let renderer;

function createLineSegments(fragShader, vertShader) {
  console.log(fragShader);
  console.log(vertShader);
    
  data = [
    [-10.0, 0.0, 0.0],
    [-10.0, 10.0, 0.0],
    [10.0, 0.0, 0.0],
    [10.0, 10.0, 0.0]
  ];

  const uniforms = {
    texture:   { type: "t", value: renderer.getTexture( "random.png" ) },
  };

  uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;

  var c_material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    clipping: true,
    vertexColors: THREE.VertexColors,
    shading : THREE.SmoothShading,
    vertexShader : vertShader, //'varying vec4 vColor;\n\tvoid main() {\n\tvColor = vec4( color, 1.0 );\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}',
    fragmentShader : fragShader //'varying vec4 vColor;\n\tvoid main() {\n\tgl_FragColor = vColor;\n}'
  });
  // geometry, need to buffer due to dynamic changing values
  var c_geometry = new THREE.BufferGeometry();

  // attributes
  var c_positions = new Float32Array( data.length * 3 ); // 3 vertices per point
  var c_uvs = new Float32Array( data.length * 2 ); // 3 uvs per point
  var c_colors = new Float32Array( data.length * 3 );

  var groundColor = new THREE.Color( 1, 1, 1);
  var topColor = new THREE.Color( 1, 1, 1);

  for (var i = 0; i < data.length; i++) {
      var date = data[i];

      c_uvs[ i * 2 + 0 ] = i % 2;
      c_uvs[ i * 2 + 1 ] = i % 2;
      c_positions[ i * 3 + 0 ] = data[i][0];
      c_positions[ i * 3 + 1 ] = data[i][1];
      c_positions[ i * 3 + 2 ] = data[i][2];
 
      groundColor.toArray(c_colors, i * 3);
      topColor.toArray(c_colors, i * 3 + 3);
  }

  c_geometry.addAttribute( 'uv', new THREE.BufferAttribute( c_uvs, 2 ) );
  c_geometry.addAttribute( 'position', new THREE.BufferAttribute( c_positions, 3 ) );
  c_geometry.addAttribute( 'color', new THREE.BufferAttribute( c_colors, 3 ) );

  var lines = new THREE.LineSegments( c_geometry, c_material);
  renderer.addObject( 'samplelines', lines , false);
}

function createPlane(fragShader, vertShader, renderer) {
  var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  //var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  const p_uniforms = {
      texture:   { type: "t", value: renderer.getTexture( "square.jpg" ) },
      time:{type:"f", value: Math.PI * 0.5}
  };
  p_uniforms.texture.value.wrapS = p_uniforms.texture.value.wrapT = THREE.RepeatWrapping;

  var p_material = new THREE.ShaderMaterial( {
    uniforms: p_uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader:   vertShader,
    fragmentShader: fragShader
  });
  p_material.side = THREE.DoubleSide;
  /*renderer.registerEventCallback('render', function(data) {
    p_material.uniforms.time.value += 0.01;
  });*/
  return new THREE.Mesh( geometry, p_material );
}

function createInstances(fragShaders, vertShaders, renderer) {
  var instances = 4;
  var positions = [
    -0.5, 0.0, 0.0,
    -0.5, 1.0, 0.0,
    0.5, 1.0, 0.0,
    0.5, 0.0, 0.0,

    0.0, 0.0, -0.5,
    0.0, 1.0, -0.5,
    0.0, 1.0, 0.5,
    0.0, 0.0, 0.5,

    -0.5, 0.0, -0.5,
    -0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.0, -0.5
];

  var uvs = [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,

    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0

  ];

  var indices = [
    8, 9, 10,
    8, 10, 11,
    0, 1, 2,
    0, 2, 3,
    4, 5, 6,
    4, 6, 7
  ];

  var offsets = [
    0.0, 5.0, 0.0,
    5.0, 0.0, 0.0,    
    0.0, -5.0, 0.0,
    -5.0, 0.0, 0.0    
  ];

  var orientations = [];

  var angles = [0.0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  var axis = [0.0, 0.0, -1.0];
  for(var i = 0; i < instances; i++) {
    offsets.push(5 * i + 6, 0.0, 0.0);
    var angle2 = 0.5 * angles[i];
    orientations.push(axis[0] * Math.sin(angle2), axis[1] * Math.sin(angle2), axis[2] * Math.sin(angle2), Math.cos(angle2));
  }

  var geometry = new THREE.InstancedBufferGeometry();
  geometry.maxInstancedCount = instances;
  geometry.setIndex( indices );

  geometry.addGroup(0, 6, 1);
  geometry.addGroup(6, 12, 0);

  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
  geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
  geometry.addAttribute( 'orientation', new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4 ) );

  const p_uniforms0 = {
      texture:   { type: "t", value: renderer.getTexture( "pin.png" ) },
      time:{type:"f", value: 0.0}
  };
  const p_uniforms1 = {
      texture:   { type: "t", value: renderer.getTexture( "disc.png" ) },
      time:{type:"f", value: 0.0}
  };
  //p_uniforms0.texture.value.wrapS = p_uniforms0.texture.value.wrapT
  // = p_uniforms1.texture.value.wrapS = p_uniforms1.texture.value.wrapT = THREE.RepeatWrapping;

  var p_material0 = new THREE.ShaderMaterial( {
    uniforms: p_uniforms0,
    transparent: true,
    depthWrite: false,
    vertexShader:   Array.isArray(vertShaders) ? vertShaders[0] : vertShaders,
    fragmentShader: Array.isArray(fragShaders) ? fragShaders[0] : fragShaders
  });
  p_material0.side = THREE.DoubleSide;

  var p_material1 = new THREE.ShaderMaterial( {
    uniforms: p_uniforms1,
    transparent: true,
    depthWrite: false,
    vertexShader:   Array.isArray(vertShaders) ? vertShaders[1] : vertShaders,
    fragmentShader: Array.isArray(fragShaders) ? fragShaders[1] : fragShaders
  });
  // p_material1.side = THREE.DoubleSide;
  renderer.registerEventCallback('render', function(data) {
    p_material0.uniforms.time.value += 0.01;
    p_material1.uniforms.time.value += 0.01;
  });
  //return new THREE.Mesh( geometry, p_material0 );
  return new THREE.Mesh( geometry, [p_material0, p_material1] );
}

function createBlockInstances(fragShaders, vertShaders, renderer) {
  var instances = 4;
  var offsets = [
    0.3, 5.5, -0.3,
    5.5, -0.3,  -0.3,    
    -0.3, -5.5,  -0.3,
    -5.5, 0.3,  -0.3 
  ];

  var orientations = [];

  var angles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  var axis = [0.0, 0.0, -1.0];
  for(var i = 0; i < instances; i++) {
    //offsets.push(5 * i + 6, 0.0, 0.0);
    var angle2 = 0.5 * angles[i];
    orientations.push(axis[0] * Math.sin(angle2), axis[1] * Math.sin(angle2), axis[2] * Math.sin(angle2), Math.cos(angle2));
  }

  var geometry = new THREE.InstancedBufferGeometry();
  var height = 5;
  var b = new THREE.BoxBufferGeometry(0.2, 0.2 * height, 0.2);
  var positions = [];
  for (var i = 0; i < b.attributes.position.array.length; i++) {
    positions.push(b.attributes.position.array[i]);
  };

  var uvs = [
    0, height, 1, height, 0, 0, 1, 0, //rechts
    0, height, 1, height, 0, 0, 1, 0, //links
    0, 1, 1, 1, 0, 0, 1, 0, //oben
    0, 1, 1, 1, 0, 0, 1, 0, //unten
    0, height, 1, height, 0, 0, 1, 0, //front
    0, height, 1, height, 0, 0, 1, 0]; //back

  var shifts = [
    1, height, 1, height, 1, height, 1, height, //rechts
    1, height, 1, height, 1, height, 1, height, //rechts
    1, 1, 1, 1, 1, 1, 1, 1, //oben
    1, 1, 1, 1, 1, 1, 1, 1, //unten
    1, height, 1, height, 1, height, 1, height, //rechts
    1, height, 1, height, 1, height, 1, height]; //rechts

  var indices = [];
  for (var i = 0; i < b.index.array.length; i++) {
    indices.push(b.index.array[i]);
  };
  //var normals = b.attributes.normal.array.slice(0);

  geometry.maxInstancedCount = instances;
  geometry.setIndex( indices );

  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  //geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
  geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
  geometry.addAttribute( 'shift', new THREE.Float32BufferAttribute( shifts, 2 ) );
  geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
  geometry.addAttribute( 'orientation', new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4 ) );

  const uniforms = {
    time:{type:"f", value: 0.0}
  };

  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader:   Array.isArray(vertShaders) ? vertShaders[0] : vertShaders,
    fragmentShader: Array.isArray(fragShaders) ? fragShaders[0] : fragShaders
  });
  material.side = THREE.DoubleSide;

  renderer.registerEventCallback('render', function(data) {
    material.uniforms.time.value += 0.01;
  });

  return new THREE.Mesh( geometry, material );
}

function createPoints(fragShader, vertShader) {
  var data = [
    [-5.0, 0.0, 0.0],
    [5.0, 0.0, 0.0]
  ];

  var normals = [
    [-1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0]
  ];

  const p_uniforms = {
      texture:   { type: "t", value: renderer.getTexture( "square.jpg" ) },
  };
  p_uniforms.texture.value.wrapS = p_uniforms.texture.value.wrapT = THREE.RepeatWrapping;

  var p_material = new THREE.ShaderMaterial( {
    uniforms: p_uniforms,
    depthWrite: false,
    transparent: true,
    vertexShader:   vertShader,
    fragmentShader: fragShader
  });

  var p_geometry = new THREE.BufferGeometry();
  var p_positions = new Float32Array( data.length * 3 );
  var p_normals = new Float32Array( normals.length * 3 );
  var p_colors = new Float32Array( data.length * 3 );
  var p_sizes = new Float32Array( data.length);

  var pointColor = new THREE.Color( 1, 0, 0);
  for (var i = 0; i < data.length; i++) {
      var date = data[i];
      var ndate = normals[i];
      var v0 = new THREE.Vector3(date[0], date[1], date[2]);
      var n0 = new THREE.Vector3(ndate[0], ndate[1], ndate[2]);

      v0.toArray(p_positions, i * 3);
      n0.toArray(p_normals, i * 3);
      pointColor.toArray( p_colors, i * 3);
      p_sizes[i] = 2500;
  }
  //centroid_size_bufferAttr = ;
  //centroid_size_bufferAttr.dynamic = true;
  p_geometry.addAttribute( 'normal', new THREE.BufferAttribute( p_normals, 3 ));
  p_geometry.addAttribute( 'position', new THREE.BufferAttribute( p_positions, 3 ));
  p_geometry.addAttribute( 'size', new THREE.BufferAttribute( p_sizes, 1 ));
  p_geometry.addAttribute( 'color', new THREE.BufferAttribute( p_colors, 3 ));

  //var s_material = new THREE.PointsMaterial( { size: 0.05, vertexColors: THREE.VertexColors } );
  return new THREE.Points( p_geometry, p_material );
  //var lines = new THREE.LineSegments( s_geometry, s_material );
  //renderer.addObject( 'citypoints', points, false );
  //parent.add(centroids);
}

function getSphere(radius) {
  const geometry = new THREE.SphereGeometry( radius, 32, 32 );
  var color = new THREE.Color( 0x080808);
  const material = new THREE.MeshPhongMaterial( {color: color} );
  return new THREE.Mesh( geometry, material );
};

document.addEventListener("DOMContentLoaded", function(event) {
  window.mdc.autoInit();

  var fabMenuEl = document.querySelector('#fab_menu');
  var fabMenu = new mdc.menu.MDCMenu(fabMenuEl);

  var neCtrlCardEl = document.querySelector('#ne-ctrl-card');
  var wbCtrlCardEl = document.querySelector('#wb-ctrl-card');

  window.toggleFabMenu = function(evt) {
    fabMenu.open = !fabMenu.open;
  };

  fabMenuEl.addEventListener('MDCMenu:selected', function(evt) {
     var detail = evt.detail;
     if (detail.index === 1) {
       neCtrlCardEl.style.display="block";
       wbCtrlCardEl.style.display="none";
     }
     if (detail.index === 2) {
       wbCtrlCardEl.style.display="block";
       neCtrlCardEl.style.display="none";
     }
  });

  renderer = new MWM.Renderer();
  renderer.res = '/res/scene/';
  var fileLoader = new THREE.FileLoader();
  var pFrag0 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/linesegment/simple.frag', (data) => {
      resolve(data);
    });
  });
  var pVert0 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/linesegment/simple.vert', (data) => {
      resolve(data);
    });
  });

  var pFrag1 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/points/test.frag', (data) => {
      resolve(data);
    });
  });
  var pVert1 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/points/simple.vert', (data) => {
      resolve(data);
    });
  });

  var pFrag2 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/mesh/simple.frag', (data) => {
      resolve(data);
    });
  });
  var pVert2 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/mesh/simple.vert', (data) => {
      resolve(data);
    });
  });

  var pFrag3 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/mesh/instance.frag', (data) => {
      resolve(data);
    });
  });
  var pVert3 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/mesh/instance.vert', (data) => {
      resolve(data);
    });
  });
  var pFrag4 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/mesh/instanceSimple.frag', (data) => {
      resolve(data);
    });
  });
  var pVert4 = new Promise((resolve, reject) => {
    fileLoader.load('/res/shaders/mesh/instanceSimple.vert', (data) => {
      resolve(data);
    });
  });
  Promise.all([pFrag0, pVert0, pFrag1, pVert1, pFrag2, pVert2, pFrag3, pVert3, pFrag4, pVert4]).then(shaders => {
    createLineSegments(shaders[0], shaders[1]);
    const p = createPoints(shaders[2], shaders[3]);
    const s = getSphere(5);
    // renderer.addObject( 'points', p , false, s);//frag, vert

    renderer.addObject( 'instancedBlock', createBlockInstances(shaders[8], shaders[9], renderer));
    renderer.addObject( 'instanced', createInstances([shaders[6], shaders[4]], shaders[7], renderer));
    renderer.addObject( 'sphere', s , false);
    renderer.start();
  }).catch(err => {
    console.log('Initializationfailed', err);
  });
});
