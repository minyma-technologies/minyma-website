var flow = function( p ) {
  var particles_a = [];
  var particles_b = [];
  var particles_c = [];
  var nums =200;
  var noiseScale = 800;
  var prev_wh;
  var prev_ww;

  p.setup = function setup() {
      var dimensions = document.getElementById('flow').getBoundingClientRect();

      prev_wh = dimensions.height;
      prev_ww = dimensions.width;

    canvas = p.createCanvas(prev_ww, prev_wh);
      canvas.parent("flow");
      p.background(21, 8, 50);
    for(var i = 0; i < nums; i++){
      particles_a[i] = new Particle(p.random(0, p.width),p.random(0,p.height));
      particles_b[i] = new Particle(p.random(0, p.width),p.random(0,p.height));
      particles_c[i] = new Particle(p.random(0, p.width),p.random(0,p.height));
    }
  }

  p.draw = function draw() {
      var dimensions = document.getElementById('flow').getBoundingClientRect();

      if (dimensions.height != prev_wh || dimensions.width != prev_ww) {
          prev_wh = dimensions.height;
          prev_ww = dimensions.width;

          canvas = p.createCanvas(prev_ww, prev_wh);
          canvas.parent("flow");
          p.background(21, 8, 50);
          for(var i = 0; i < nums; i++){
              particles_a[i] = new Particle(p.random(0, p.width),p.random(0,p.height));
              particles_b[i] = new Particle(p.random(0, p.width),p.random(0,p.height));
              particles_c[i] = new Particle(p.random(0, p.width),p.random(0,p.height));
          }
      }

    p.noStroke();
    p.smooth();
      for(var i = 0; i < nums; i++){
      var radius = p.map(i,0,nums,1,2);
      var alpha = p.map(i,0,nums,0,250);

      p.fill(69,33,124,alpha);
      particles_a[i].move();
      particles_a[i].display(radius);
      particles_a[i].checkEdge();

      p.fill(7,153,242,alpha);
      particles_b[i].move();
      particles_b[i].display(radius);
      particles_b[i].checkEdge();

      p.fill(255,255,255,alpha);
      particles_c[i].move();
      particles_c[i].display(radius);
      particles_c[i].checkEdge();
    }  
  }

  
  function Particle(x, y){
    this.dir = p.createVector(0, 0);
    this.vel = p.createVector(0, 0);
    this.pos = p.createVector(x, y);
    this.speed = 0.4;

    this.move = function(){
      var angle = p.noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*p.TWO_PI*noiseScale;
      this.dir.x = p.cos(angle);
      this.dir.y = p.sin(angle);
      this.vel = this.dir.copy();
      this.vel.mult(this.speed);
      this.pos.add(this.vel);
    }

    this.checkEdge = function(){
      if(this.pos.x > p.width || this.pos.x < 0 || this.pos.y > p.height || this.pos.y < 0){
        this.pos.x = p.random(50, p.width);
        this.pos.y = p.random(50, p.height);
      }
    }

    this.display = function(r){
      p.ellipse(this.pos.x, this.pos.y, r, r);
    }
  }
}


// "painted hills" by garabatospr

// color palette
var hills = function (p) {
  var colors = ["#ff0000", "#feb30f", "#0aa4f7", "#000000", "#ffffff"];

  // set weights for each color 

  // red, blue, and white dominates 

  var weights = [10, 1, 10, 1, 6, 3];

  // scale of the vector field 
  // smaller values => bigger structures  
  // bigger values  ==> smaller structures 

  var myScale = 3;

  // number of drawing agents 

  var nAgents = 300;

  let agent = [];

  var dimensions = document.getElementById('hill').getBoundingClientRect();

  prev_wh = dimensions.height;
  prev_ww = dimensions.width;

  p.setup = function setup() {
      canvas = p.createCanvas(prev_ww, prev_wh);
      canvas.parent('hill')
      p.strokeCap(p.SQUARE);

      p.background(60, 20, 60);

      p.colorMode(p.HSB, 360, 100, 100);

      for (let i = 0; i < nAgents; i++) {
          agent.push(new Agent());
      }

  }

  p.draw = function draw() {
      var dimensions = document.getElementById('hill').getBoundingClientRect();

      if (dimensions.height != prev_wh || dimensions.width != prev_ww) {
          prev_wh = dimensions.height;
          prev_ww = dimensions.width;
          canvas = p.createCanvas(prev_ww, prev_wh);
          canvas.parent('hill')
          agent = [];

          p.colorMode(p.RGB)
          p.background(60, 20, 60);
          p.colorMode(p.HSB, 360, 100, 100);
          p.strokeCap(p.SQUARE);
    
    
          for (let i = 0; i < nAgents; i++) {
              agent.push(new Agent());
          }
      }

      for (let i = 0; i < agent.length; i++) {
          agent[i].update();
      }
  }

  // select random colors with weights from palette 

  function myRandom(colors, weights) {
      let tt = 0;
      let sum = 0;

      //for(let i=0;i < colors.length; i++)
      //{
      //  sum += weights[i];
      //}

      let rr = p.random(0, sum);

      for (let j = 0; j < weights.length; j++) {

          if (weights[j] >= rr) {
              return colors[j];
          }
          rr -= weights[j];
      }

      return tt;
  }



  // paintining agent 


  class Agent {
      constructor() {
          this.point = p.createVector(1, p.height / 2 + p.randomGaussian() * 400);

          this.pOld = p.createVector(this.point.x, this.point.y);

          this.step = 0.4;

          let temp = myRandom(colors, weights);

          this.color = p.color(p.hue(temp) + p.randomGaussian() * 10,
          p.saturation(temp) + p.randomGaussian() * 10,
          p.brightness(temp) - 10, p.random(10, 90));

          this.strokeWidth = p.random(1, 5);
      }

      update() {

          this.point.x += vector_field(this.point.x, this.point.y).x * this.step;
          this.point.y += vector_field(this.point.x, this.point.y).y * this.step;

          p.strokeWeight(this.strokeWidth);
          p.stroke(this.color);
          p.line(this.pOld.x, this.pOld.y, this.point.x, this.point.y);

          this.pOld.set(this.point);

      }

  }

  // vector field function 
  // the painting agents follow the flow defined 
  // by this function 


  function vector_field(x, y) {

      x = p.map(x, 0, p.width, -myScale, myScale);
      y = p.map(y, 0, p.height, -myScale, myScale);

      let k1 = 5;
      let k2 = 3;

      let u = p.sin(k1 * y) + p.cos(k2 * y);
      let v = p.sin(k2 * x) - p.cos(k1 * x);

      // litle trick to move from left to right 

      if (u <= 0) {
          u = -u;
      }

      return p.createVector(u, v);
  }


  // function to select 

  function myRandom(colors, weights) {
      let tt = 0;
      let sum = 0;

      for (let i = 0; i < colors.length; i++) {
          sum += weights[i];
      }

      let rr = p.random(0, sum);

      for (let j = 0; j < weights.length; j++) {

          if (weights[j] >= rr) {
              return colors[j];
          }
          rr -= weights[j];
      }

      return tt;
  }
}


var flow_live = new p5(flow);
var hill_live = new p5(hills);
