var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform float u_Size;
void main() {
  gl_Position = a_Position;
  gl_PointSize = u_Size;
}
`;

var FSHADER_SOURCE = `
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
let u_Size;

let g_shapesList = [];

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;

let POINT = 0;
let TRIANGLE = 1;

let g_selectedType = POINT;

let CIRCLE = 2;

let g_selectedSegments = 10;

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
  }
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get a_Position');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get u_Size');
    return;
  }
}

function addActionsForHtmlUI() {
  document.getElementById('clearButton').onclick = function() {
    g_shapesList = [];
    renderAllShapes();
  };

  document.getElementById('pointButton').onclick = function() {
    g_selectedType = POINT;
  };

document.getElementById('triangleButton').onclick = function() {
   g_selectedType = TRIANGLE;
  };

document.getElementById('circleButton').onclick = function() {
  g_selectedType = CIRCLE;
  };

  document.getElementById('pictureButton').onclick = function() {
  drawMyPicture();
  };

document.getElementById('segmentSlide').addEventListener('input', function() {
  g_selectedSegments = Number(this.value);
  });

  document.getElementById('redSlide').addEventListener('input', function() {
    g_selectedColor[0] = this.value / 100;
  });

  document.getElementById('greenSlide').addEventListener('input', function() {
    g_selectedColor[1] = this.value / 100;
  });

  document.getElementById('blueSlide').addEventListener('input', function() {
    g_selectedColor[2] = this.value / 100;
  });

  document.getElementById('sizeSlide').addEventListener('input', function() {
    g_selectedSize = Number(this.value);
  });
}

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let shape;

if (g_selectedType == POINT) {
  shape = new Point();
} else if (g_selectedType == TRIANGLE) {
  shape = new Triangle();
} else if (g_selectedType == CIRCLE) {
  shape = new Circle();
  shape.segments = g_selectedSegments;
}
  shape.position = [x, y];
  shape.color = [
    g_selectedColor[0],
    g_selectedColor[1],
    g_selectedColor[2],
    g_selectedColor[3]
  ];
  shape.size = g_selectedSize;

  g_shapesList.push(shape);

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  let x = ev.clientX;
  let y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < g_shapesList.length; i++) {
    g_shapesList[i].render();
  }
}

function addPictureTriangle(vertices, color) {
  let t = new Triangle();
  t.vertices = vertices;
  t.color = color;
  g_shapesList.push(t);
}

function drawMyPicture() {
  g_shapesList = [];

  let white = [1.0, 1.0, 1.0, 1.0];
  let black = [0.0, 0.0, 0.0, 1.0];
  let pink = [0.95, 0.6, 0.7, 1.0];
  let collar = [0.2, 0.7, 1.0, 1.0];
  let gold = [1.0, 0.85, 0.2, 1.0];

  // HEAD
  addPictureTriangle([-0.35, 0.15, 0.0, 0.55, 0.35, 0.15], white);
  addPictureTriangle([-0.35, 0.15, 0.0, -0.22, 0.35, 0.15], white);

  // EARS (black outer)
  addPictureTriangle([-0.26, 0.34, -0.12, 0.72, -0.02, 0.34], black);
  addPictureTriangle([0.02, 0.34, 0.12, 0.72, 0.26, 0.34], black);

  // INNER EARS (pink)
  addPictureTriangle([-0.21, 0.38, -0.12, 0.61, -0.05, 0.38], pink);
  addPictureTriangle([0.05, 0.38, 0.12, 0.61, 0.21, 0.38], pink);

  // INNER FACE
  addPictureTriangle([-0.30, 0.12, -0.08, 0.12, -0.18, -0.12], white);
  addPictureTriangle([0.08, 0.12, 0.30, 0.12, 0.18, -0.12], white);
  addPictureTriangle([-0.18, -0.12, 0.0, 0.04, 0.18, -0.12], white);

  // BODY
  addPictureTriangle([-0.24, -0.22, 0.0, -0.62, 0.24, -0.22], white);
  addPictureTriangle([-0.30, -0.22, -0.05, -0.55, 0.0, -0.22], white);
  addPictureTriangle([0.0, -0.22, 0.05, -0.55, 0.30, -0.22], white);

  // PAWS
  addPictureTriangle([-0.18, -0.62, -0.05, -0.62, -0.12, -0.50], white);
  addPictureTriangle([0.05, -0.62, 0.18, -0.62, 0.12, -0.50], white);

  // TAIL
  addPictureTriangle([0.22, -0.34, 0.52, -0.16, 0.32, -0.02], white);
  addPictureTriangle([0.22, -0.34, 0.44, -0.42, 0.52, -0.16], white);

  // EYES (straighter)
  addPictureTriangle([-0.17, 0.17, -0.07, 0.17, -0.12, 0.10], black);
  addPictureTriangle([0.07, 0.17, 0.17, 0.17, 0.12, 0.10], black);

  // NOSE
  addPictureTriangle([-0.04, 0.02, 0.04, 0.02, 0.0, -0.04], pink);

  // MOUTH
  addPictureTriangle([-0.03, -0.05, 0.0, -0.10, 0.0, -0.04], black);
  addPictureTriangle([0.0, -0.10, 0.03, -0.05, 0.0, -0.04], black);

  // COLLAR
  addPictureTriangle([-0.22, -0.16, 0.22, -0.16, -0.22, -0.24], collar);
  addPictureTriangle([0.22, -0.16, 0.22, -0.24, -0.22, -0.24], collar);

  // BIGGER PENDANT
  addPictureTriangle([-0.06, -0.24, 0.06, -0.24, 0.0, -0.36], gold);

  // L on pendant
  addPictureTriangle([-0.05, -0.26, -0.03, -0.26, -0.05, -0.20], black);
  addPictureTriangle([-0.05, -0.26, -0.01, -0.26, -0.01, -0.28], black);

  // T on pendant
  addPictureTriangle([0.01, -0.20, 0.05, -0.20, 0.03, -0.22], black);
  addPictureTriangle([0.025, -0.22, 0.035, -0.22, 0.03, -0.30], black);

  // WHISKERS
  addPictureTriangle([-0.26, 0.00, -0.08, 0.01, -0.26, 0.02], black);
  addPictureTriangle([-0.26, -0.04, -0.08, -0.01, -0.26, -0.02], black);
  addPictureTriangle([0.08, 0.01, 0.26, 0.00, 0.26, 0.02], black);
  addPictureTriangle([0.08, -0.01, 0.26, -0.04, 0.26, -0.02], black);

  renderAllShapes();
}
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  let g_isDragging = false;

  canvas.onmousedown = function(ev) {
    g_isDragging = true;
    click(ev);
  };

  canvas.onmouseup = function() {
    g_isDragging = false;
  };

  canvas.onmouseleave = function() {
    g_isDragging = false;
  };

  canvas.onmousemove = function(ev) {
    if (g_isDragging) {
      click(ev);
    }
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}