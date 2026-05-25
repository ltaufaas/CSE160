class Cube {

  constructor() {

    this.color = [1.0, 1.0, 1.0, 1.0];

    this.matrix = new Matrix4();

    this.textureNum = -1;
  }

  render() {

    let rgba = this.color;

    gl.uniform4f(
      u_FragColor,
      rgba[0],
      rgba[1],
      rgba[2],
      rgba[3]
    );

    gl.uniform1i(
      u_whichTexture,
      this.textureNum
    );

    gl.uniformMatrix4fv(
      u_ModelMatrix,
      false,
      this.matrix.elements
    );

    let normalMatrix = new Matrix4();

    normalMatrix.setInverseOf(this.matrix);

    normalMatrix.transpose();

    gl.uniformMatrix4fv(
      u_NormalMatrix,
      false,
      normalMatrix.elements
    );

    // FRONT

    drawTriangle3DUVNormal(

      [0,0,0, 1,1,0, 1,0,0],

      [0,0, 1,1, 1,0],

      [0,0,1, 0,0,1, 0,0,1]

    );

    drawTriangle3DUVNormal(

      [0,0,0, 0,1,0, 1,1,0],

      [0,0, 0,1, 1,1],

      [0,0,-1, 0,0,-1, 0,0,-1]

    );

    // TOP

    drawTriangle3DUVNormal(

      [0,1,0, 0,1,1, 1,1,1],

      [0,0, 1,1, 1,0],

      [0,1,0, 0,1,0, 0,1,0]

    );

    drawTriangle3DUVNormal(

      [0,1,0, 1,1,1, 1,1,0],

      [0,0, 0,1, 1,1],

      [0,1,0, 0,1,0, 0,1,0]

    );

    // RIGHT

    drawTriangle3DUVNormal(

      [1,0,0, 1,1,0, 1,1,1],

      [0,0, 1,1, 1,0],

      [1,0,0, 1,0,0, 1,0,0]

    );

    drawTriangle3DUVNormal(

      [1,0,0, 1,1,1, 1,0,1],

      [0,0, 0,1, 1,1],

      [1,0,0, 1,0,0, 1,0,0]

    );

    // LEFT

    drawTriangle3DUVNormal(

      [0,0,0, 0,1,0, 0,1,1],

      [0,0, 1,1, 1,0],

      [-1,0,0, -1,0,0, -1,0,0]

    );

    drawTriangle3DUVNormal(

      [0,0,0, 0,1,1, 0,0,1],

      [0,0, 0,1, 1,1],

      [-1,0,0, -1,0,0, -1,0,0]

    );

    // BOTTOM

    drawTriangle3DUVNormal(

      [0,0,0, 1,0,0, 1,0,1],

      [0,0, 1,1, 1,0],

      [0,-1,0, 0,-1,0, 0,-1,0]

    );

    drawTriangle3DUVNormal(

      [0,0,0, 1,0,1, 0,0,1],

      [0,0, 0,1, 1,1],

      [0,-1,0, 0,-1,0, 0,-1,0]

    );

    // BACK

    drawTriangle3DUVNormal(

      [0,0,1, 1,1,1, 1,0,1],

      [0,0, 1,1, 1,0],

      [0,0,-1, 0,0,-1, 0,0,-1]

    );

    drawTriangle3DUVNormal(

      [0,0,1, 0,1,1, 1,1,1],

      [0,0, 0,1, 1,1],

      [0,0,1, 0,0,1, 0,0,1]

    );
  }
}