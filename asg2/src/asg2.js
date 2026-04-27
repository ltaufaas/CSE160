let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;

  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
`;

let FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;

  void main() {
    gl_FragColor = u_FragColor;
  }
`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

let g_globalAngle = 0;
let g_animationOn = true;
let g_mouseXAngle = 0;
let g_mouseYAngle = 0;

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
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");

  let identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);

  document.getElementById("angleSlide").addEventListener("input", function() {
    g_globalAngle = Number(this.value);
    renderScene();
  });

  document.getElementById("animationButton").addEventListener("click", function() {
    g_animationOn = !g_animationOn;
  });

  canvas.addEventListener("mousemove", function(ev) {
    if (ev.buttons === 1) {
      g_mouseXAngle = (ev.clientY / canvas.height) * 180 - 90;
      g_mouseYAngle = (ev.clientX / canvas.width) * 360;
      renderScene();
    }
  });

  tick();
}

function tick() {
  renderScene();
  requestAnimationFrame(tick);
}

function renderScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_mouseYAngle, 0, 1, 0);
  globalRotMat.rotate(g_mouseXAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  let time = performance.now() / 1000.0;

  let runCycle = g_animationOn ? Math.sin(time * 8) : 0;
  let bodyOffset = g_animationOn ? Math.abs(runCycle) * 0.03 : 0;
  let move = g_animationOn ? Math.sin(time * 2) * 0.25 : 0;
  let runAngle = g_animationOn ? runCycle * 3.5 : 0;

  // BODY
  let body = new Cube();
  body.color = [0.9, 0.9, 0.85, 1];
  body.matrix.translate(-0.5 + move, -0.4 + bodyOffset, 0.0);
  body.matrix.scale(0.7, 0.4, 0.35);
  body.render();

  // WOOL PATCHES

  // TOP WOOL
  for (let x = 0.1; x <= 0.7; x += 0.2) {
    for (let z = 0.05; z <= 0.35; z += 0.15) {
      let wool = new Cube();
      wool.color = [0.85, 0.83, 0.8, 1];
      wool.matrix = new Matrix4(body.matrix);
      wool.matrix.translate(x, 0.85, z);
      wool.matrix.scale(0.16, 0.16, 0.16);
      wool.render();
    }
  }

  // LEFT SIDE WOOL
  for (let x = 0.1; x <= 0.7; x += 0.2) {
    for (let y = 0.35; y <= 0.65; y += 0.15) {
      let wool = new Cube();
      wool.color = [0.85, 0.83, 0.8, 1];
      wool.matrix = new Matrix4(body.matrix);
      wool.matrix.translate(x, y, -0.15);
      wool.matrix.scale(0.16, 0.16, 0.10);
      wool.render();
    }
  }

  // RIGHT SIDE WOOL
  for (let x = 0.1; x <= 0.7; x += 0.2) {
    for (let y = 0.35; y <= 0.65; y += 0.15) {
      let wool = new Cube();
      wool.color = [0.85, 0.83, 0.8, 1];
      wool.matrix = new Matrix4(body.matrix);
      wool.matrix.translate(x, y, 1.0);
      wool.matrix.scale(0.16, 0.16, 0.10);
      wool.render();
    }
  }

  // TAIL
  let tail = new Cube();
  tail.color = [0.9, 0.9, 0.85, 1];
  tail.matrix = new Matrix4(body.matrix);
  tail.matrix.translate(-0.05, 0.20, 0.10);
  tail.matrix.scale(1, 0.2, 0.2);
  tail.render();

  // HEAD
  let head = new Cube();
  head.color = [0.85, 0.8, 0.7, 1];
  head.matrix = new Matrix4(body.matrix);
  head.matrix.translate(1, 0.35, 0.20);
  head.matrix.scale(0.35, 0.45, 0.45);
  head.render();

  // LEFT EAR
  let leftEar = new Cube();
  leftEar.color = [0.85, 0.8, 0.7, 1];
  leftEar.matrix = new Matrix4(head.matrix);
  leftEar.matrix.translate(0.15, 0.9, -0.15);
  leftEar.matrix.scale(0.10, 0.2, 0.30);
  leftEar.render();

  // RIGHT EAR
  let rightEar = new Cube();
  rightEar.color = [0.85, 0.8, 0.7, 1];
  rightEar.matrix = new Matrix4(head.matrix);
  rightEar.matrix.translate(0.15, 0.9, 1);
  rightEar.matrix.scale(0.10, 0.2, 0.25);
  rightEar.render();

  // 4 LEGS
  drawLeg(body.matrix, 0.12, 0.10, runAngle);
  drawLeg(body.matrix, 0.12, 0.70, -runAngle);
  drawLeg(body.matrix, 0.70, 0.10, -runAngle);
  drawLeg(body.matrix, 0.70, 0.70, runAngle);

  // LEFT EYE
  let leftEye = new Cube();
  leftEye.color = [0.05, 0.05, 0.05, 1];
  leftEye.matrix = new Matrix4(head.matrix);
  leftEye.matrix.translate(1.05, 0.55, 0.05);
  leftEye.matrix.scale(0.1, 0.08, 0.05);
  leftEye.render();

  // RIGHT EYE
  let rightEye = new Cube();
  rightEye.color = [0.05, 0.05, 0.05, 1];
  rightEye.matrix = new Matrix4(head.matrix);
  rightEye.matrix.translate(1.05, 0.55, 0.35);
  rightEye.matrix.scale(0.1, 0.08, 0.05);
  rightEye.render();

  // NOSE
  let nose = new Cube();
  nose.color = [1.0, 0.6, 0.7, 1];
  nose.matrix = new Matrix4(head.matrix);
  nose.matrix.translate(1.0, 0.35, 0.18);
  nose.matrix.scale(0.01, 0.10, 0.2);
  nose.render();
}

function drawLeg(baseMatrix, x, z, legAngle) {
  // UPPER LEG
  let upperLeg = new Cube();
  upperLeg.color = [0.85, 0.8, 0.7, 1];
  upperLeg.matrix = new Matrix4(baseMatrix);
  upperLeg.matrix.translate(x, -0.25, z);
  upperLeg.matrix.rotate(legAngle, 1, 0, 0);
  upperLeg.matrix.scale(0.1, 0.25, 0.1);
  upperLeg.render();

  // LOWER LEG
  let lowerLeg = new Cube();
  lowerLeg.color = [0.85, 0.8, 0.7, 1];
  lowerLeg.matrix = new Matrix4(upperLeg.matrix);
  lowerLeg.matrix.translate(0, -0.5, 0);
  lowerLeg.matrix.rotate(-legAngle * 0.2, 1, 0, 0);
  lowerLeg.matrix.scale(1, 0.5, 1);
  lowerLeg.render();

  // HOOF
  let hoof = new Cube();
  hoof.color = [0.4, 0.3, 0.2, 1];
  hoof.matrix = new Matrix4(lowerLeg.matrix);
  hoof.matrix.translate(0, -0.3, 0);
  hoof.matrix.scale(1, 0.3, 1);
  hoof.render();
}