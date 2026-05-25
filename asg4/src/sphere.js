class Sphere {

  constructor() {

    this.type = 'sphere';

    this.color = [1,1,1,1];

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

    let d = Math.PI / 10;
    let dd = Math.PI / 10;

    for(let t = 0; t < Math.PI; t += d){

      for(let r = 0; r < (2 * Math.PI); r += d){

        let p1 = [
          Math.sin(t) * Math.cos(r),
          Math.cos(t),
          Math.sin(t) * Math.sin(r)
        ];

        let p2 = [
          Math.sin(t + dd) * Math.cos(r),
          Math.cos(t + dd),
          Math.sin(t + dd) * Math.sin(r)
        ];

        let p3 = [
          Math.sin(t) * Math.cos(r + dd),
          Math.cos(t),
          Math.sin(t) * Math.sin(r + dd)
        ];

        let p4 = [
          Math.sin(t + dd) * Math.cos(r + dd),
          Math.cos(t + dd),
          Math.sin(t + dd) * Math.sin(r + dd)
        ];

        let v = [];
        let uv = [];

        v = v.concat(p1);
        uv = uv.concat([0,0]);

        v = v.concat(p2);
        uv = uv.concat([0,1]);

        v = v.concat(p4);
        uv = uv.concat([1,1]);

        drawTriangle3DUVNormal(
          v,
          uv,
          v
        );

        v = [];
        uv = [];

        v = v.concat(p1);
        uv = uv.concat([0,0]);

        v = v.concat(p4);
        uv = uv.concat([1,1]);

        v = v.concat(p3);
        uv = uv.concat([1,0]);

        drawTriangle3DUVNormal(
          v,
          uv,
          v
        );
      }
    }
  }
}