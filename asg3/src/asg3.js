let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;

  varying vec2 v_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position =
      u_ProjectionMatrix *
      u_ViewMatrix *
      u_GlobalRotateMatrix *
      u_ModelMatrix *
      a_Position;

    v_UV = a_UV;
  }
`;

let FSHADER_SOURCE = `
  precision mediump float;

  varying vec2 v_UV;

  uniform vec4 u_FragColor;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;

  uniform int u_whichTexture;

  void main() {

    if (u_whichTexture == -1) {

      gl_FragColor = u_FragColor;

    }

    else if (u_whichTexture == 0) {

      gl_FragColor = texture2D(u_Sampler0, v_UV);

    }

    else if (u_whichTexture == 1) {

      gl_FragColor = texture2D(u_Sampler1, v_UV);

    }
  }
`;

let canvas;
let gl;

let a_Position;
let a_UV;

let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

let u_Sampler0;
let u_Sampler1;

let u_whichTexture;

let camera;

let g_animationOn = true;

let g_map = [];

for (let x = 0; x < 32; x++) {

  g_map.push([]);

  for (let z = 0; z < 32; z++) {

    let height = 0;

    // OUTER WALLS

    if (
      x == 0 ||
      z == 0 ||
      x == 31 ||
      z == 31
    ) {

      height = 2;

    }

    // RANDOM INTERIOR BLOCKS

    else if (Math.random() < 0.005) {

      height =
        Math.floor(Math.random() * 4) + 1;
    }

    // STORE BOTH HEIGHT + TEXTURE

    g_map[x].push({

      height: height,

      texture:
        Math.random() < 0.5 ? 1 : 0

    });
  }
}

function main() {

  canvas = document.getElementById("webgl");

  gl = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get WebGL context");
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  a_UV = gl.getAttribLocation(gl.program, "a_UV");

  u_FragColor =
    gl.getUniformLocation(gl.program, "u_FragColor");

  u_ModelMatrix =
    gl.getUniformLocation(gl.program, "u_ModelMatrix");

  u_GlobalRotateMatrix =
    gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");

  u_ViewMatrix =
    gl.getUniformLocation(gl.program, "u_ViewMatrix");

  u_ProjectionMatrix =
    gl.getUniformLocation(gl.program, "u_ProjectionMatrix");

  u_Sampler0 =
    gl.getUniformLocation(gl.program, "u_Sampler0");

  u_Sampler1 =
    gl.getUniformLocation(gl.program, "u_Sampler1");

  u_whichTexture =
    gl.getUniformLocation(gl.program, "u_whichTexture");

  camera = new Camera();

  let identityM = new Matrix4();

  gl.uniformMatrix4fv(
    u_ModelMatrix,
    false,
    identityM.elements
  );

  gl.uniformMatrix4fv(
    u_GlobalRotateMatrix,
    false,
    identityM.elements
  );

  let mouseDown = false;

  canvas.onmousedown = function() {
    mouseDown = true;
  };

  canvas.onmouseup = function() {
    mouseDown = false;
  };

  canvas.onmousemove = function(ev) {

    if (mouseDown) {

      camera.pan(ev.movementX * 1.5);

      renderScene();
    }
  };

  document.onkeydown = keydown;

  initTextures();
  initTextures2();

  tick();
}

function initTextures() {

  let image = new Image();

  if (!image) {
    console.log("Failed to create image object");
    return false;
  }

  image.onload = function() {
    sendTextureToGLSL0(image);
  };

  image.src = "textures/stone.png";

  return true;
}

function initTextures2() {

  let image = new Image();

  if (!image) {
    console.log("Failed to create image object");
    return false;
  }

  image.onload = function() {
    sendTextureToGLSL1(image);
  };

  image.src = "textures/greenstone.png";

  return true;
}

function sendTextureToGLSL0(image) {

  let texture = gl.createTexture();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR
  );

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image
  );

  gl.uniform1i(u_Sampler0, 0);

  console.log("Texture 0 loaded");
}

function sendTextureToGLSL1(image) {

  let texture = gl.createTexture();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR
  );

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image
  );

  gl.uniform1i(u_Sampler1, 1);

  console.log("Texture 1 loaded");
}

function tick() {

  renderScene();

  requestAnimationFrame(tick);
}

function getMapCoordinates() {

  let forward = new Vector3();

  forward.set(camera.at);

  forward.sub(camera.eye);

  forward.normalize();

  let x =
    Math.floor(camera.eye.elements[0] + forward.elements[0] + 16);

  let z =
    Math.floor(camera.eye.elements[2] + forward.elements[2] + 16);

  return [x, z];
}

function keydown(ev) {

  if (ev.key == 'w') {
    camera.moveForward();
  }

  if (ev.key == 's') {
    camera.moveBackward();
  }

  if (ev.key == 'a') {
    camera.moveLeft();
  }

  if (ev.key == 'd') {
    camera.moveRight();
  }

  if (ev.key == 'q') {
    camera.pan(5);
  }

  if (ev.key == 'e') {
    camera.pan(-5);
  }

  if (ev.key == 'f') {

  let coords = getMapCoordinates();

  let x = coords[0];
  let z = coords[1];

  if (
    x >= 0 &&
    x < 32 &&
    z >= 0 &&
    z < 32
  ) {

    g_map[x][z].height += 1;
  }
}

  if (ev.key == 'g') {

    let coords = getMapCoordinates();

    let x = coords[0];
    let z = coords[1];

    if (
      x >= 0 &&
      x < 32 &&
      z >= 0 &&
      z < 32 &&
      g_map[x][z].height > 0
    ) {

      g_map[x][z].height -= 1;
    }
  }

  renderScene();
}

function renderScene() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniformMatrix4fv(
    u_ViewMatrix,
    false,
    camera.viewMatrix.elements
  );

  gl.uniformMatrix4fv(
    u_ProjectionMatrix,
    false,
    camera.projectionMatrix.elements
  );

  let globalRotMat = new Matrix4();

  gl.uniformMatrix4fv(
    u_GlobalRotateMatrix,
    false,
    globalRotMat.elements
  );

  // GROUND

  let ground = new Cube();

  ground.color = [0.3, 0.7, 0.3, 1];

  ground.textureNum = -1;

  ground.matrix.translate(-50, -0.75, -50);

  ground.matrix.scale(100, 0.01, 100);

  ground.render();

  // SKY

  let sky = new Cube();

  sky.color = [0.5, 0.7, 1.0, 1];

  sky.textureNum = -1;

  sky.matrix.scale(100, 100, 100);

  sky.matrix.translate(-0.5, -0.5, -0.5);

  sky.render();

// WORLD MAP

for (let x = 0; x < g_map.length; x++) {

  for (let z = 0; z < g_map[x].length; z++) {

    let block = g_map[x][z];

    let height = block.height;

    for (let y = 0; y < height; y++) {

      let wall = new Cube();

      wall.color = [1,1,1,1];

      wall.textureNum = block.texture;

      wall.matrix.translate(
        x - 16,
        y - 0.75,
        z - 16
      );

      wall.render();
    }
  }
}

}