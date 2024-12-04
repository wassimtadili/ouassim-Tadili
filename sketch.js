let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];
let m = "n";
let SliderVitesse, Sliderforce;

function preload() {
  // load asset images qui se trouvent dans le dossier assets 
  background = loadImage('assets/bgspace.jpg');
  vaisseau = loadImage('assets/icons8-vaisseau-spatial-64.png');
  obstacle = loadImage('assets/planetobstacle.avif');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(1000, 1000, vaisseau);
  pursuer2 = new Vehicle(random(width), random(height));

  // Ajouter les sliders
  SliderVitesse = createSlider(1, 20, 10, 1);
  SliderVitesse.position(1100, 10);
  let labelVitesseMax = createDiv('Vitesse Max :');
  labelVitesseMax.position(1000, 10);
  labelVitesseMax.style('color', 'red');
  labelVitesseMax.style('font-size', '14px');

  Sliderforce = createSlider(0.1, 5, 2, 0.01);
  Sliderforce.position(1150, 40);
  let labelAccelerationMax = createDiv('Accélération Max :');
  labelAccelerationMax.position(1000, 40);
  labelAccelerationMax.style('color', 'red');
  labelAccelerationMax.style('font-size', '14px');

  vehicules.push(pursuer1);
  //vehicules.push(pursuer2);

  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacles.push(new Obstacle(width / 2, height / 2, 100 ,obstacle));
}


function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  image(background, 0, 0, width+1500  , height+1000);
  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    // imageMode(CENTER);
    // image(obstacle, o.pos.x, o.pos.y, o.r*3, o.r*3);
    o.show();
  })

  let nMaxSpeed = SliderVitesse.value();
  let nMaxForce = Sliderforce.value();

  vehicules.forEach((v,index) => {
    
    v.maxSpeed = nMaxSpeed;
    v.maxForce = nMaxForce;
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    if(m == "s")
    {
      if(index == 0)
      {
        v.applyBehaviors(target, obstacles, vehicules);
        v.applyForce(v.arrive(target));
      }
      else
      {
        v.applyBehaviors(vehicules[index - 1].pos, obstacles, vehicules);
        v.applyForce(v.arrive(vehicules[index-1].pos.copy()));
      }
    }
    else if(m == "n")
    {
      v.applyBehaviors(target, obstacles, vehicules);
      v.applyForce(v.arrive(target));
    }
    else if(m == "w")
    {
        v.applyBehaviors(target, obstacles, vehicules);
        v.wander();
        v.boundaries();
    }
    
    // déplacement et dessin du véhicule et de la target
    v.update();
    v.show();
  });
}

function mousePressed() {
  // TODO : ajouter un obstacle de taille aléatoire à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(70, 100), obstacle));
}

function keyPressed() {
  if (key == "n") {
    m= "n";
  }
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height)));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  } else if (key == "f") {
    // on crée 10 véhicules à des position random espacées de 50px
    // en x = 20, y = hauteur du  canvas sur deux
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(20, 300 , vaisseau)
      // vitesse aléatoire
      v.vel = new p5.Vector(random(1, 5), random(1, 5));
      vehicules.push(v);
    }
  } else if(key == "s")
  {
     m = "s";
  }
  else if(key == "w")
  {
    m = "w";
  }
}