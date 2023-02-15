var girl = function (artist) {
    var colors = "083d77-ebebd3-f4d35e-ee964b-f95738-f24".split("-").map(a => "#" + a)
    var colors2 = "22577a-38a3a5-57cc99-80ed99-c7f9cc-fff".split("-").map(a => "#" + a)
    var particles = []

    var dimensions = document.getElementById('girl').getBoundingClientRect();

    wh = dimensions.height;
    ww = dimensions.width;

    artist.setup = function setup() {
        canvas = artist.createCanvas(ww, wh);
        canvas.parent("girl")
        artist.background(100);
        artist.fill("#151023")
        artist.pixelDensity(2)
        artist.rect(0, 0, artist.width, artist.height)
        var agents = artist.height / 2;
        var start = artist.random(artist.height / 2);
        var end = artist.random(artist.height / 2) + agents;
        for (var i = start; i < end; i += 4) {
            particles.push(new Particle({
                p: artist.createVector(0, (i - artist.height / 2) + artist.height / 2),
                v: artist.createVector(1, -(i - artist.height / 2) / 50),
                a: artist.createVector(0.03, 0),
                color: colors[artist.floor(i / 50) % colors.length],
                r: artist.max(1, artist.random(15) * artist.random() * artist.random())
            }))
        }
    }

    artist.draw = function draw() {
        var dimensions = document.getElementById('flow').getBoundingClientRect();

        if (dimensions.height != wh || dimensions.width != ww) {
            wh = dimensions.height;
            ww = dimensions.width;

            canvas = artist.createCanvas(ww, wh);
            canvas.parent("girl")

            artist.background(100);
            artist.fill("#151023")
            artist.pixelDensity(2)
            artist.rect(0, 0, artist.width, artist.height)
            var agents = artist.height / 2;
            var start = artist.random(artist.height / 2);
            var end = artist.random(artist.height / 2) + agents;
            for (var i = start; i < end; i += 4) {
                particles.push(new Particle({
                    p: artist.createVector(0, (i - artist.height / 2) + artist.height / 2),
                    v: artist.createVector(1, -(i - artist.height / 2) / 50),
                    a: artist.createVector(0.03, 0),
                    color: colors[artist.floor(i / 50) % colors.length],
                    r: artist.max(1, artist.random(15) * artist.random() * artist.random())
                }))
            }
        }

        artist.noStroke()
        // background(0,1)
        particles.forEach(p => {
            p.update()
            p.draw()
        })
        // ellipse(mouseX, mouseY, 20, 20);
    }

    class Particle {
        constructor(args) {
            let def = {
                lastP: artist.createVector(0, 0),
                p: artist.createVector(0, 0),
                v: artist.createVector(0, 0),
                a: artist.createVector(0, 0),
                color: artist.color(255),
                rSpan: artist.random([10, 20, 50, 100]),
                dashSpan: artist.random([1, 10, 10000000]),
                r: 2
            }
            Object.assign(def, args)
            Object.assign(this, def)
        }
        update() {
            this.lastP.x = this.p.x
            this.lastP.y = this.p.y
            this.p.add(this.v)
            this.v.add(this.a)

            this.p.y += artist.sin(this.p.x / this.rSpan) * 4
            this.p.x += artist.sin(this.p.y / this.rSpan) * 4
            if (artist.floor(this.p.x) % 20 == 0) {
                this.v.x += (artist.noise(this.p.x * 100, 100000) - 0.5) / 10
                this.v.y += (artist.noise(this.p.y * 100, 5) - 0.5) / 10
                // this.p.y+=sin(this.p.x/5)*2
                // this.p.x+=sin(this.p.y/5)*2
                // this.v.x+=random(-1,1)
                // this.v.y+=random(-1,1)
                if (artist.random() < 0.3) {
                    this.color = artist.random(artist.random([colors, colors2]))
                }
            }
            let delta = artist.createVector(artist.width / 2, artist.height / 2).sub(this.p)
            this.p.add(delta.mult(0.1).limit(4))
            this.v.mult(0.999)
            this.r *= 0.998
        }
        draw() {
            artist.push()
            artist.noStroke()
            artist.strokeWeight(this.r)
            artist.stroke(this.color)
            // translate(this.p.x,this.p.y)
            // ellipse(0,0,this.r)
            if ((artist.frameCount % this.dashSpan) < this.dashSpan * 0.7) {
                artist.line(this.lastP.x, this.lastP.y, this.p.x, this.p.y)
            }
            if (artist.random() < 0.1) {
                artist.noStroke()
                artist.fill(0, 100)
                for (var i = 0; i < 5; i++) {
                    artist.ellipse(this.p.x + artist.random(-20, 20), this.p.y + artist.random(-20, 20), artist.random(2))
                }
            }
            let c = artist.color(this.color)
            c.setAlpha(3)
            artist.stroke(c)
            artist.blendMode(artist.SCREEN)
            // for(var i=4;i<5;i++){
            // 	strokeWeight(i*3)
            // 	line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
            // }
            // strokeWeight(6)
            // line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
            // strokeWeight(8)
            // line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)

            // ellipse(0,0,this.r*2)
            // ellipse(0,0,this.r*3)
            // ellipse(0,0,this.r*4)
            artist.pop()
        }
    }
}

var voronoi = function (artist) {
    var particles_a = [];
    var particles_b = [];
    var particles_c = [];
    var nums = 100;
    var noiseScale = -0.94;
    var grid_resolution = 2;
    var points = [];

    var x_grid_step;
    var y_grid_step;

    var dimensions = document.getElementById('voronoi').getBoundingClientRect();

    prev_wh = dimensions.height;
    prev_ww = dimensions.width;


    artist.setup = function setup() {
        canvas = artist.createCanvas(prev_ww, prev_wh);
        canvas.parent('voronoi')
        artist.background(21, 8, 50);
        for (var i = 0; i < nums; i++) {
            particles_a[i] = new Particle(artist.random(0, artist.width), artist.random(0, artist.height));
            particles_b[i] = new Particle(artist.random(0, artist.width), artist.random(0, artist.height));
            particles_c[i] = new Particle(artist.random(0, artist.width), artist.random(0, artist.height));
        }
        x_grid_step = artist.width / grid_resolution;
        y_grid_step = artist.height / grid_resolution;
        for (var i = 0; i < grid_resolution; i++) {
            for (var j = 0; j < grid_resolution; j++) {
                var idx = to_idx(i, j);
                points[idx] = [x_grid_step * (i + artist.random(0, 1)), y_grid_step * (j + artist.random(0, 1))]
            }
        }
    }

    artist.draw = function draw() {
        var dimensions = document.getElementById('voronoi').getBoundingClientRect();

        if (dimensions.height != prev_wh || dimensions.width != prev_ww) {
            prev_wh = dimensions.height;
            prev_ww = dimensions.width;

            canvas = artist.createCanvas(prev_ww, prev_wh);
            canvas.parent('voronoi')

            artist.background(21, 8, 50);
            for (var i = 0; i < nums; i++) {
                particles_a[i] = new Particle(artist.random(0, artist.width), artist.random(0, artist.height));
                particles_b[i] = new Particle(artist.random(0, artist.width), artist.random(0, artist.height));
                particles_c[i] = new Particle(artist.random(0, artist.width), artist.random(0, artist.height));
            }
            x_grid_step = artist.width / grid_resolution;
            y_grid_step = artist.height / grid_resolution;
            for (var i = 0; i < grid_resolution; i++) {
                for (var j = 0; j < grid_resolution; j++) {
                    var idx = to_idx(i, j);
                    points[idx] = [x_grid_step * (i + artist.random(0, 1)), y_grid_step * (j + artist.random(0, 1))]
                }
            }
        }


        artist.noStroke();
        artist.smooth();
        for (var i = 0; i < nums; i++) {
            var radius = artist.map(i, 0, nums, 1, 2);
            var alpha = artist.map(i, 0, nums, 0, 250);

            artist.fill(200, 33, 120, alpha);
            particles_a[i].move();
            particles_a[i].display(radius);

            artist.fill(220, 42, 75, alpha);
            particles_b[i].move();
            particles_b[i].display(radius);

            artist.fill(180, 180, 180, alpha);
            particles_c[i].move();
            particles_c[i].display(radius);
        }
    }

    function to_idx(x_idx, y_idx) {
        return x_idx + y_idx * grid_resolution;
    }

    function voronoi_noise(x, y) {
        var max_step = Math.max(x_grid_step, y_grid_step)
        var x_idx = Math.floor(x / x_grid_step);
        x_idx = Math.min(Math.max(0, x_idx), grid_resolution - 1)
        var y_idx = Math.floor(y / y_grid_step);
        y_idx = Math.min(Math.max(0, y_idx), grid_resolution - 1)
        var idx = to_idx(x_idx, y_idx);
        var min_dist = Math.hypot(points[idx][0] - x, points[idx][1] - y);
        var min_dist_idx = 0;
        var x_extent = Math.ceil(x_grid_step / max_step);
        var y_extent = Math.ceil(y_grid_step / max_step);
        for (var i = -x_extent; i <= x_extent; i++) {
            for (var j = -y_extent; j <= y_extent; j++) {
                var x1_idx = x_idx + i;
                var y1_idx = y_idx + j;
                if (x1_idx < 0 || x1_idx >= grid_resolution || y1_idx < 0 || y1_idx >= grid_resolution) {
                    continue;
                }
                idx = to_idx(x1_idx, y1_idx);
                var dist = Math.hypot(points[idx][0] - x, points[idx][1] - y);
                if (dist < min_dist) {
                    min_dist = dist;
                    min_dist_idx = idx;
                }
            }
        }
        return min_dist;
    }

    function Particle(x, y) {
        this.dir = artist.createVector(0, 0);
        this.vel = artist.createVector(0, 0);
        this.pos = artist.createVector(x, y);
        this.speed = 1;

        this.move = function () {
            // var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*TWO_PI*noiseScale;
            var angle = voronoi_noise(this.pos.x, this.pos.y) * artist.TWO_PI / noiseScale;
            this.dir.x = artist.cos(angle);
            this.dir.y = artist.sin(angle);
            this.vel = this.dir.copy();
            this.vel.mult(this.speed);
            this.pos.add(this.vel);
        }

        this.checkEdge = function () {
            if (this.pos.x > artist.width || this.pos.x < 0 || this.pos.y > artist.height || this.pos.y < 0) {
                this.pos.x = artist.random(50, artist.width);
                this.pos.y = artist.random(50, artist.height);
            }
        }

        this.display = function (r) {
            artist.ellipse(this.pos.x, this.pos.y, r, r);
        }
    }
}

var voronoi_live = new p5(voronoi);
var girl_live = new p5(girl);