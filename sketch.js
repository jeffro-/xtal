var song, env, rev, volume;
var touchStarted;
var a;
var songLoaded;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  cursor();
  songLoaded = false;
  song = loadSound('audio/xtal.mp3', loaded);

  env = new p5.Env(0.01, 0, 0, 1, 0, 1, 0.05, 0);
  rev = new p5.Reverb();
  rev.process(song, 3, 0.5);
  
  a = 0;
}

function loaded() {
  song.setVolume(0);
  songLoaded = true;
  touchStarted = false;
  song.loop();
  noCursor();
}

function draw() {
  background(55, 20, 100);

  // preload animation
  for (var i = 0; i < TAU; i += TAU / 8) {
    if (songLoaded) {
      calpha--;
    } else calpha = 360;
    var cx = width / 2 + 10 * cos(i + frameCount / 20.0);
    var cy = height / 2 + 10 * sin(i + frameCount / 20.0);
    
    fill(0,calpha);
    noStroke();
    push();
    translate(cx, cy);
    ellipse(0, 0, 5, 5);
    pop();
  }

  //start program
  if (songLoaded && calpha < 0) circles();
}

function circles() {
  //initialize
  var wave = song.getLevel();
  var x = touchX || mouseX;
  var y = touchY || mouseY;
  var size = map(y, 0, height, 200, 10);
  var hue = map(x, 0, width, 100, 60);
  var sat = map(y, 0, height, 60, 0);

  // big circle / background
  if (touchStarted) {
    noStroke();
    fill(hue, sat, 100);
    ellipse(x, y, size + a, size + a);
    a += 150;

    //text fade-in
    var alpha = map(a, 0, 150, 0, 10);
    fill(0, alpha);
    textSize(24);
    text("jeffro / xtal", 35, 45);
  } else if (!touchStarted && size + a > width) a = 0;

  // circle section
  if (touchStarted) fill(0);
  else fill(hue, 20, 100);
  noStroke();
  ellipse(x, y, size + (wave * 200), size + (wave * 200));

  // audio section
  var freq = map(x, 0, width, 0.5, 1.5);
  var revAmp = map(y, 0, height, 1, 0);
  var threshold = constrain(y, height/2, height);
  volume = map(threshold, height/2, height, 1, 0);
  env.mult(volume);

  song.rate(freq);
  rev.amp(revAmp);
}

function mousePressed() {
  env.triggerAttack(song);
  touchStarted = true;
  return false;
}

function mouseReleased() {
  env.triggerRelease(song);
  touchStarted = false;
  return false;
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}