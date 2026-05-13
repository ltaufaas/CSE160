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

    // FRONT

    drawTriangle3DUV(

      [0,0,0, 1,1,0, 1,0,0],

      [0,0, 1,1, 1,0]

    );

    drawTriangle3DUV(

      [0,0,0, 0,1,0, 1,1,0],

      [0,0, 0,1, 1,1]

    );

    // TOP

    drawTriangle3DUV(

      [0,1,0, 0,1,1, 1,1,1],

      [0,0, 1,1, 1,0]

    );

    drawTriangle3DUV(

      [0,1,0, 1,1,1, 1,1,0],

      [0,0, 0,1, 1,1]

    );

    // RIGHT

    drawTriangle3DUV(

      [1,0,0, 1,1,0, 1,1,1],

      [0,0, 1,1, 1,0]

    );

    drawTriangle3DUV(

      [1,0,0, 1,1,1, 1,0,1],

      [0,0, 0,1, 1,1]

    );

    // LEFT

    drawTriangle3DUV(

      [0,0,0, 0,1,0, 0,1,1],

      [0,0, 1,1, 1,0]

    );

    drawTriangle3DUV(

      [0,0,0, 0,1,1, 0,0,1],

      [0,0, 0,1, 1,1]

    );

    // BOTTOM

    drawTriangle3DUV(

      [0,0,0, 1,0,0, 1,0,1],

      [0,0, 1,1, 1,0]

    );

    drawTriangle3DUV(

      [0,0,0, 1,0,1, 0,0,1],

      [0,0, 0,1, 1,1]

    );

    // BACK

    drawTriangle3DUV(

      [0,0,1, 1,1,1, 1,0,1],

      [0,0, 1,1, 1,0]

    );

    drawTriangle3DUV(

      [0,0,1, 0,1,1, 1,1,1],

      [0,0, 0,1, 1,1]

    );
  }
}