var voronoi = function (artist) {
    var particles_a = [];
    var particles_b = [];
    var particles_c = [];
    var nums = 200;
    var noiseScale = -0.94;
    var grid_resolution = 2;
    var points = [];

    var x_grid_step;
    var y_grid_step;

    var dimensions = document.getElementById('voronoi').getBoundingClientRect();

    prev_wh = dimensions.height;
    prev_ww = dimensions.width;


    function setup() {
        canvas = artist.createCanvas(prev_ww, prev_wh);
        canvas.parent('voronoi')
        artist.artist.background(21, 8, 50);
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

    function draw() {
        var dimensions = document.getElementById('voronoi').getBoundingClientRect();

        if (dimensions.artist.height != prev_wh || dimensions.artist.width != prev_ww) {
            prev_wh = dimensions.height;
            prev_ww = dimensions.width;

            canvas = createCanvas(prev_ww, prev_wh);
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
            var radius = map(i, 0, nums, 1, 2);
            var alpha = map(i, 0, nums, 0, 250);

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
            var angle = voronoi_noise(this.pos.x, this.pos.y) * TWO_PI / noiseScale;
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