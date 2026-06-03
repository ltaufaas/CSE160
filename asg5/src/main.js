import * as THREE from "https://esm.sh/three@0.165.0";

import { OrbitControls }
from "https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader }
from "https://esm.sh/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(
  0,
  20,
  30
);

camera.lookAt(
  0,
  0,
  0
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(
  renderer.domElement
);

const controls =
new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

// cube

const geometry =
new THREE.BoxGeometry(
  50,
  1,
  50
);

const textureLoader =
new THREE.TextureLoader();

const grassTexture =
textureLoader.load(
  './textures/grass.png'
);

const material =
new THREE.MeshStandardMaterial({
  map: grassTexture
});

const stoneTexture =
textureLoader.load(
  './textures/stone.png'
);

const greenTexture =
textureLoader.load(
  './textures/greenstone.png'
);

const ambientLight =
new THREE.AmbientLight(
  0xffffff,
  0.7
);

scene.add(
  ambientLight
);

const directionalLight =
new THREE.DirectionalLight(
  0xffffff,
  2
);

directionalLight.position.set(
  5,
  10,
  5
);

scene.add(
  directionalLight
);

const pointLight =
new THREE.PointLight(
  0xffffff,
  100
);

scene.add(pointLight);

const lightSphere =
new THREE.Mesh(

  new THREE.SphereGeometry(
    0.5,
    16,
    16
  ),

  new THREE.MeshBasicMaterial({
    color: 0xffff00
  })

);

scene.add(lightSphere);

const hemiLight =
new THREE.HemisphereLight(
  0x87ceeb,
  0x444444,
  1
);

scene.add(hemiLight);

const sky =
new THREE.Mesh(

  new THREE.SphereGeometry(
    500,
    32,
    32
  ),

  new THREE.MeshBasicMaterial({
    color: 0x87ceeb,
    side: THREE.BackSide
  })

);

scene.add(sky);

const floor =
  new THREE.Mesh(
    geometry,
    material
  );

floor.position.y = -0.5;

scene.add(floor);

// Stone Wall

for(let i=-10; i<=10; i+=2){

  const wallCube =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2,
      2,
      2
    ),

    new THREE.MeshStandardMaterial({
      map: stoneTexture
    })

  );

  wallCube.position.set(
    i,
    1,
    -20
  );

  scene.add(
    wallCube
  );
}

// Left Wall

for(let z=-20; z<=20; z+=2){

  const wallCube =
  new THREE.Mesh(

    new THREE.BoxGeometry(2,2,2),

    new THREE.MeshStandardMaterial({
      map: stoneTexture
    })

  );

  wallCube.position.set(
    -20,
    1,
    z
  );

  scene.add(wallCube);
}

// Right Wall

for(let z=-20; z<=20; z+=2){

  const wallCube =
  new THREE.Mesh(

    new THREE.BoxGeometry(2,2,2),

    new THREE.MeshStandardMaterial({
      map: stoneTexture
    })

  );

  wallCube.position.set(
    20,
    1,
    z
  );

  scene.add(wallCube);
}

for(let x=-20; x<=20; x+=2){

  const wallCube =
  new THREE.Mesh(

    new THREE.BoxGeometry(2,2,2),

    new THREE.MeshStandardMaterial({
      map: stoneTexture
    })

  );

  wallCube.position.set(
    x,
    1,
    20
  );

  scene.add(wallCube);
}

const pillarPositions = [

  [-10,  2.5, -3],   // left
  [ 10,  2.5, -3],   // right
  [ 0,  2.5, -14],  // back
  [ 0,  2.5, 8]    // front

];

for(const pos of pillarPositions){

  const pillar =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2,
      5,
      2
    ),

    new THREE.MeshStandardMaterial({
      map: greenTexture
    })

  );

  pillar.position.set(
    pos[0],
    pos[1],
    pos[2]
  );

  scene.add(
    pillar
  );
}

for(let i=0; i<5; i++){

  const sphere =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      1,
      32,
      32
    ),

    new THREE.MeshStandardMaterial({
      color: 0xffffff
    })

  );

  sphere.position.set(
    -12 + i * 6,
    1,
    -5
  );

  scene.add(
    sphere
  );
}

let butterfly = null;
let sudowoodo = null;

const loader = new GLTFLoader();

loader.load(

  "./models/Butterfly.glb",

  function(gltf){

    butterfly = gltf.scene;

    butterfly.scale.set(
      0.05,
      0.05,
      0.05
    );

    butterfly.position.set(
      0,
      5,
      0
    );

    scene.add(
      butterfly
    );

    console.log("Butterfly loaded");

  }

);

loader.load(

  "./models/Sudowoodo.glb",

  function(gltf){

    sudowoodo = gltf.scene;

    sudowoodo.scale.set(
      3,
      3,
      3
    );

    sudowoodo.position.set(
      0,
      5,
      -2
    );

    scene.add(
      sudowoodo
    );

    console.log("Sudowoodo loaded");

  }

);

function animate() {

  requestAnimationFrame(
    animate
  );

  let t =
  performance.now() * 0.001;

  if(butterfly){

  butterfly.position.x =
    Math.cos(t) * 6;

  butterfly.position.z =
    -6 + Math.sin(t) * 6;

  butterfly.position.y =
    12 + Math.sin(t * 4);

  butterfly.rotation.y =
    -t;
}

  if (butterfly){

    pointLight.position.copy(butterfly.position);

  }

  lightSphere.position.copy(
  pointLight.position
  );

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

animate();