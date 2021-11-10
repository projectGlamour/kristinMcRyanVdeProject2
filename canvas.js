const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "rgb(5, 5, 49)";
canvas.style.zIndex = "1";

let radius = 8;
let radians123 = 0.0007;
let numberofitems = 400;

const darkModeOnBttn = document.querySelector("#first");
const darkModeOffBttn = document.querySelector("#second");
const normalizeBttn = document.querySelector("#third");
let htmlElement = document.documentElement;

let colors = ['lightblue', 'white', 'gold', 'rgb(106, 106, 226)'];

darkModeOnBttn.addEventListener("click", function () {
  canvas.style.backgroundColor = "black";
  colors = ['lightblue', 'white', 'gold', 'yellow'];
  radius = 9;
  numberofitems = 1000;
  radians123 = 0.001;
  init();
});

darkModeOffBttn.addEventListener("click", function () {
  canvas.style.backgroundColor = "#800000";
  colors = ['white', 'darkgreen', 'lightgreen', 'green', 'gold'];
  radius = 14;
  init();
});

normalizeBttn.addEventListener("click", function () {
  canvas.style.backgroundColor = "rgb(5, 5, 49)";
  colors = ['lightblue', 'white', 'gold', 'rgb(106, 106, 226)'];
  radius = 8;
  init();
});

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}


addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init()
});

class Particle {
  constructor(x, y, radius1, color) {
    this.x = x
    this.y = y
    this.radius1 = radius1
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius1, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    
  }
}


let particles
function init() {
    particles = []
    for (let i = 0; i < numberofitems; i++) {
      const canvasWidth = canvas.width + 900
      const canvasHeight = canvas.height + 900
      let x = Math.random() * canvasWidth - canvasWidth / 2 
      let y = Math.random() * canvasHeight - canvasHeight / 2
      let radius1 = radius * Math.random();
      let color = colors[Math.floor(Math.random() * colors.length)]
      particles.push(new Particle(x, y, radius1, color))   
      
  }
  
}

let radians = 0


function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
    c.save()
  c.translate(canvas.width / 2, canvas.height / 2)
    c.rotate(radians)
  particles.forEach((particle) => {
    c.moveTo(Math.random(), Math.random());
        particle.update()
    })
    
    c.restore()
  radians += radians123;
}

init()
animate()

const mouseTarget = document.getElementById("aboutIntroduction");

mouseTarget.addEventListener('mouseenter', () => {
  const roundimage1 = document.getElementById("roundimage");
  roundimage1.style.transform = "translate(-25%, 0)";
})

mouseTarget.addEventListener('mouseleave', () => {
  const roundimage1 = document.getElementById("roundimage");
  roundimage1.style.transform = "translate(105%, 0)";
});

function pageScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
