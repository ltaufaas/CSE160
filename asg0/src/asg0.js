function main() {
  let canvas = document.getElementById("example");
  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(ctx, v, color) {
  let centerX = 200;
  let centerY = 200;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + v.elements[0] * 20, centerY - v.elements[1] * 20);
  ctx.stroke();
}

function angleBetween(v1, v2) {
  let dot = Vector3.dot(v1, v2);
  let m1 = v1.magnitude();
  let m2 = v2.magnitude();

  let cosAlpha = dot / (m1 * m2);
  let angleRadians = Math.acos(cosAlpha);
  let angleDegrees = angleRadians * 180 / Math.PI;

  return angleDegrees;
}

function areaTriangle(v1, v2) {
  let cross = Vector3.cross(v1, v2);
  let area = cross.magnitude() / 2;
  return area;
}

function handleDrawEvent() {
  let canvas = document.getElementById("example");
  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x1 = parseFloat(document.getElementById("v1x").value);
  let y1 = parseFloat(document.getElementById("v1y").value);
  let v1 = new Vector3([x1, y1, 0]);

  let x2 = parseFloat(document.getElementById("v2x").value);
  let y2 = parseFloat(document.getElementById("v2y").value);
  let v2 = new Vector3([x2, y2, 0]);

  drawVector(ctx, v1, "red");
  drawVector(ctx, v2, "blue");
}

function handleDrawOperationEvent() {
  let canvas = document.getElementById("example");
  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x1 = parseFloat(document.getElementById("v1x").value);
  let y1 = parseFloat(document.getElementById("v1y").value);
  let v1 = new Vector3([x1, y1, 0]);

  let x2 = parseFloat(document.getElementById("v2x").value);
  let y2 = parseFloat(document.getElementById("v2y").value);
  let v2 = new Vector3([x2, y2, 0]);

  drawVector(ctx, v1, "red");
  drawVector(ctx, v2, "blue");

  let op = document.getElementById("operation").value;
  let scalar = parseFloat(document.getElementById("scalar").value);

  if (op === "add") {
    let v3 = new Vector3(v1.elements);
    v3.add(v2);
    drawVector(ctx, v3, "green");

  } else if (op === "sub") {
    let v3 = new Vector3(v1.elements);
    v3.sub(v2);
    drawVector(ctx, v3, "green");

  } else if (op === "mul") {
    let v3 = new Vector3(v1.elements);
    let v4 = new Vector3(v2.elements);
    v3.mul(scalar);
    v4.mul(scalar);
    drawVector(ctx, v3, "green");
    drawVector(ctx, v4, "green");

  } else if (op === "div") {
    let v3 = new Vector3(v1.elements);
    let v4 = new Vector3(v2.elements);
    v3.div(scalar);
    v4.div(scalar);
    drawVector(ctx, v3, "green");
    drawVector(ctx, v4, "green");

  } else if (op === "mag") {
    console.log("v1 magnitude:", v1.magnitude());
    console.log("v2 magnitude:", v2.magnitude());

  } else if (op === "norm") {
    let v3 = new Vector3(v1.elements);
    let v4 = new Vector3(v2.elements);
    v3.normalize();
    v4.normalize();
    drawVector(ctx, v3, "green");
    drawVector(ctx, v4, "green");

  } else if (op === "angle") {
    console.log("Angle:", angleBetween(v1, v2));

  } else if (op === "area") {
    console.log("Area of triangle:", areaTriangle(v1, v2));
  }
}