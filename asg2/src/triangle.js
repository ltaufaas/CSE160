class Triangle {
  constructor() {
    this.position = [0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
    this.vertices = null;
  }

  render() {
    let rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    if (this.vertices) {
      drawTriangle(this.vertices);
      return;
    }

    let xy = this.position;
    let d = this.size / 200.0;

    drawTriangle([
      0.0, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0
    ]);
  }
}

function drawTriangle(vertices) {
  let n = 3;

  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}