
//TODO:responsive, mobile accessible, database images keyword, more configurable
let p;
const DEFAULT_DIM = 8;
let skip = DEFAULT_DIM;
let particles = new Array();
let eraserSlider, pixelSlider, imageUrl;
let tmp;
let eraserDim, pixelDensity;
let eraser;
let img;

let font,
  fontsize;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('data/BPtypewrite.otf');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  fontsize = map(windowWidth, 0, 1080, 10, 17);
  textSize(fontsize);
  noStroke();
  eraser = new Eraser(windowWidth, windowHeight, DEFAULT_DIM);
  eraserSlider = createSlider(1, 500, 20);
  pixelSlider = createSlider(1, 30, DEFAULT_DIM);
  imageUrl = createInput();
  imageUrl.position(30, windowHeight - 220);
  imageUrl.style('font-size', "14px");
  imageUrl.style('font-family', "BPtypewrite");
  //placeholder input
  imageUrl.attribute('placeholder', 'ananas');
  imageUrl.input(downloadImage);
  eraserSlider.position(20, windowHeight - 180);
  pixelSlider.position(20, windowHeight - 140);
  eraserSlider.elt.step = 20;
  tmp = pixelSlider.value();
  loadImage('data/ananas.png', function (i) {
    img = i;
    img.loadPixels();
    pixelateImage();
  });

}

function draw() {
  background(255);
  eraserDim = eraserSlider.value();
  pixelDensity = pixelSlider.value();
  eraser.update(mouseX, mouseY, eraserDim);
  stroke(100);
  strokeWeight(1);
  eraser.show();
  noStroke();
  particles.forEach(p => {
    // if (eraser.erase(p)) {
    //     // particles = particles.filter(e => e != p);
    //     // p.color = color(100);
    //     p.fall();
    // }
    p.behaviors();
    p.update(pixelDensity);
    p.display();
  });
  //slider change event simulation
  if (pixelDensity != tmp) {
    tmp = pixelDensity;
    updateImage();
  }
  fill(70);
  textSize(fontsize);
  text("    Eraser Size:  " + eraserDim, eraserSlider.x * 2 + eraserSlider.width, eraserSlider.y + 15);
  text("    Resolution (pixel size) :  " + pixelDensity, pixelSlider.x * 2 + pixelSlider.width, pixelSlider.y + 15);
  text("    Fruit name || Image URL, max 64x64 px (poi sono cazzi tuoi)", imageUrl.x * 2 + imageUrl.width, imageUrl.y + 15);
  textSize(12);
  text("      fruits: ananas, anguria, arancia, avocado, banana, charizard, kiwi, limone, mais, mela, papaya, pera, pikachu, pizza, pomodoro, prugna, uva", imageUrl.x * 2 + imageUrl.width, pixelSlider.y + 60);

}
function windowResized() {
  resizeCanvas(w, h);
}


class Particle {
  constructor(x, y, dim, color) {
    this.position = createVector(random(x - 10, x + 10), random(y - 10, y + 10));
    this.dim = dim;
    this.mass = dim;
    this.speed = 0;
    this.color = color;
    this.falling = false;
    this.vel = createVector(random(-30, 30), random(-30, 30));
    this.acc = createVector();
    this.target = createVector(x, y);
    this.maxSpeed = 8;
    this.maxForce = 1;
  }

  behaviors() {
    let mouse = createVector(mouseX, mouseY);
    let seek = this.seek(this.target);
    let arrive = this.arrive(this.target);
    let flee = this.flee(mouse);
    arrive.mult(1);
    flee.mult(5);
    this.applyForce(arrive);
    this.applyForce(flee);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    let desiredVel = p5.Vector.sub(target, this.position);
    desiredVel.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desiredVel, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  arrive(target) {
    let desiredVel = p5.Vector.sub(target, this.position);
    let distance = desiredVel.mag();
    let speed = this.maxSpeed;
    if (distance < 50) {
      speed = map(distance, 0, 100, 0, this.maxSpeed);
    }
    desiredVel.setMag(speed);
    let steer = p5.Vector.sub(desiredVel, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  flee(target) {
    let desiredVel = p5.Vector.sub(target, this.position);
    let distance = desiredVel.mag();
    if (distance < (eraserDim / 2 + eraserDim / 10)) {
      desiredVel.setMag(this.maxSpeed);
      desiredVel.mult(-1);
      let steer = p5.Vector.sub(desiredVel, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }


  display() {
    fill(this.color);
    // stroke(1);
    rect(this.position.x, this.position.y, this.dim, this.dim);
  }

  set setMass(mass) {
    this.mass = mass;
  }

  setTarget(x, y) {
    this.target.set(x, y);
  }

  get getPosition() {
    return this.position;
  }

  get getX() {
    return this.getPosition.x;
  }
  get getY() {
    return this.getPosition.y;
  }

  fall() {
    this.falling = true;
  }

  update(dim) {
    if (this.falling) {
      //
    }

    this.position.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.dim = dim;
  }
}

class Eraser {
  constructor(x, y, dim) {
    this.position = new p5.Vector(x, y);
    this.dim = dim;
  }

  update(x, y, dim) {
    this.position.x = x;
    this.position.y = y;
    this.dim = dim;
  }

  show() {
    fill(255);
    stroke(200);
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, this.dim, this.dim);
  }

  get getPosition() {
    return this.position;
  }

  get getX() {
    return this.getPosition.x;
  }
  get getY() {
    return this.getPosition.y;
  }


  erase(object) {
    let objectRadius = object.dim / 2;
    let radius = this.dim / 2;
    if (abs(object.getX - this.getX) <= objectRadius + radius && abs(object.getY - this.getY) <= objectRadius + radius) {
      return true;
    }
  }

}
function updateImage() {
  particles = new Array();
  pixelateImage();
}
let url, tmp_url;
function downloadImage() {
  url = "data/" + imageUrl.value();
  if (!url.includes(".png")) {
    tmp_url = url + ".png";
  }
  loadImage(url, function (i) {
    img = i;
    imageUrl.value("");
    imageUrl.attribute('placeholder', url.toLowerCase());
    updateImage();
  });

  loadImage(tmp_url, function (i) {
    img = i;
    imageUrl.value("");
    imageUrl.attribute('placeholder', tmp_url.toLowerCase());
    updateImage();
  });
}


function pixelateImage() {
  // let n = 0;
  // console.log("... Pixelating image...");

  for (let x = 0; x < img.width; x += pixelDensity) {
    for (let y = 0; y < img.height; y += pixelDensity) {
      // console.log(img.get(x, y));
      //salta pixel trasparenti
      if (img.get(x, y)[3] > 0)
        particles.push(new Particle(x + windowWidth / 2 - windowWidth / 10, y + windowHeight / 4, pixelDensity, img.get(x, y)));
      // n++;
    }
  }
  // console.log("... " + n + " particles created.");
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
