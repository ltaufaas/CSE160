class Cube {
  constructor() {
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    let rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // FRONT
    drawTriangle([0,0,0, 1,1,0, 1,0,0]);
    drawTriangle([0,0,0, 0,1,0, 1,1,0]);

    // TOP
    drawTriangle([0,1,0, 0,1,1, 1,1,1]);
    drawTriangle([0,1,0, 1,1,1, 1,1,0]);

    // RIGHT
    drawTriangle([1,0,0, 1,1,0, 1,1,1]);
    drawTriangle([1,0,0, 1,1,1, 1,0,1]);

    // LEFT
    drawTriangle([0,0,0, 0,1,0, 0,1,1]);
    drawTriangle([0,0,0, 0,1,1, 0,0,1]);

    // BOTTOM
    drawTriangle([0,0,0, 1,0,0, 1,0,1]);
    drawTriangle([0,0,0, 1,0,1, 0,0,1]);

    // BACK
    drawTriangle([0,0,1, 1,1,1, 1,0,1]);
    drawTriangle([0,0,1, 0,1,1, 1,1,1]);
  }
}