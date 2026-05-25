class Camera {
  constructor() {
    this.fov = 60;
    this.yaw = 0;

    this.eye = new Vector3([0, 2, 9]);
    this.at = new Vector3([2, 2, 1]);
    this.up = new Vector3([0, 1, 0]);

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.updateView();
    this.updateProjection();
  }

  updateView() {
    this.viewMatrix.setLookAt(
      this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
      this.at.elements[0], this.at.elements[1], this.at.elements[2],
      this.up.elements[0], this.up.elements[1], this.up.elements[2]
    );
  }

  updateProjection() {
    this.projectionMatrix.setPerspective(
      this.fov,
      canvas.width / canvas.height,
      0.1,
      1000
    );
  }

  moveForward() {

  let f = new Vector3();

  f.set(this.at);

  f.sub(this.eye);

  f.normalize();

  f.mul(1.5);

  this.eye.add(f);

  this.at.add(f);

  this.updateView();
}

  moveBackward() {

    let b = new Vector3();

    b.set(this.eye);

    b.sub(this.at);

    b.normalize();

    b.mul(1.5);

    this.eye.add(b);

    this.at.add(b);

    this.updateView();
  }

  moveLeft() {

    let f = new Vector3();

    f.set(this.at);

    f.sub(this.eye);

    let s = Vector3.cross(this.up, f);

    s.normalize();

    s.mul(1.5);

    this.eye.add(s);

    this.at.add(s);

    this.updateView();
  }

  moveRight() {

    let f = new Vector3();

    f.set(this.at);

    f.sub(this.eye);

    let s = Vector3.cross(f, this.up);

    s.normalize();

    s.mul(1.5);

    this.eye.add(s);

    this.at.add(s);

    this.updateView();

  }
  

  pan(angle) {

    let f = new Vector3();

    f.set(this.at);

    f.sub(this.eye);

    let rotationMatrix = new Matrix4();

    rotationMatrix.setRotate(angle, 0, 1, 0);

    let f_prime = rotationMatrix.multiplyVector3(f);

    this.at.set(this.eye);

    this.at.add(f_prime);

    this.updateView();
  }

}
