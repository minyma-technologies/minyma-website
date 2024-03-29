let he = window.screen.height;
let wi = window.screen.width;

var t;
function setup() {
  canvas = createCanvas(windowWidth-100, windowHeight-100);
  canvas.parent("divergence");
  stroke(240, 240, 240, 18);
  noFill();
  background(0);
  t = 0;
}

function draw() {
  var x1 = width * noise(t + 15);
  var x2 = width * noise(t + 25);
  var x3 = width * noise(t + 35);
  var x4 = width * noise(t + 45);
  var y1 = height * noise(t + 55);
  var y2 = height * noise(t + 65);
  var y3 = height * noise(t + 75);
  var y4 = height * noise(t + 85);

  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

  t += 0.002;
}