const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "rgb(5, 5, 49)";
canvas.style.zIndex = "1";



window.addEventListener('resize', canvasresize);

canvasresize();
function canvasresize(){
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let radius = 8;
let radians123 = 0.0007;
let numberofitems = 1000;

const darkModeOnBttn = document.querySelector("#first");
const darkModeOffBttn = document.querySelector("#second");
const normalizeBttn = document.querySelector("#third");
let htmlElement = document.documentElement;

let colors = ['lightblue', 'white', 'gold', 'rgb(106, 106, 226)'];

darkModeOnBttn.addEventListener("click", function () {
  canvas.style.backgroundColor = "black";
  colors = ['lightblue', 'white', 'gold', 'yellow'];
  radius = 9;
  numberofitems = 1600;
  radians123 = 0.001;
  htmlElement.setAttribute("data-theme", "dark");
  init();
});

darkModeOffBttn.addEventListener("click", function () {
  canvas.style.backgroundColor = "#800000";
  colors = ['white', 'darkgreen', 'lightgreen', 'green', 'gold'];
  radius = 14;
  htmlElement.setAttribute("data-theme", "christmas");
  init();
});

normalizeBttn.addEventListener("click", function () {
  canvas.style.backgroundColor = "rgb(5, 5, 49)";
  colors = ['lightblue', 'white', 'gold', 'rgb(106, 106, 226)'];
  radius = 8;
  htmlElement.setAttribute("data-theme", "light");
  init();
});

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

//Boiler Plate Code Provide By Chris Courses
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
      const canvasWidth = canvas.width + 1900
      const canvasHeight = canvas.height + 1900
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
//Boiler Plate Code Provide By Chris Courses

init()
animate()

const mouseTarget = document.getElementById("aboutIntroduction");

mouseTarget.addEventListener('mouseenter', () => {
  const mediaQuery = window.matchMedia('(max-width: 900px)')
  
  const mediaQuery2 = window.matchMedia('(min-width: 901px)')

  if (mediaQuery.matches) {
    const wrapperAnimation = document.getElementById("wrapperOpacityAnime");
    const wrapperAnimation2 = document.getElementById("wrapperOpacityAnime2");
    wrapperAnimation.style.animation = "none";
    wrapperAnimation2.style.animation = "none";
    wrapperAnimation.style.opacity = "1";
    wrapperAnimation2.style.opacity = "1";
  }
  if (mediaQuery2.matches) {
  const wrapperAnimation = document.getElementById("wrapperOpacityAnime");
  const wrapperAnimation2 = document.getElementById("wrapperOpacityAnime2");
  wrapperAnimation.style.animation = "slideinLeft 6s 1, slidein 4s 1";
  wrapperAnimation2.style.animation = "slideinRight 6s 1, slidein 2s 1";
  wrapperAnimation.style.opacity = "1";
  wrapperAnimation2.style.opacity = "1";  

 }
 
})

mouseTarget.addEventListener('mouseleave', () => {
  const mediaQuery = window.matchMedia('(max-width: 900px)')
  const mediaQuery2 = window.matchMedia('(min-width: 901px)')

  if (mediaQuery.matches) {
    const wrapperAnimation = document.getElementById("wrapperOpacityAnime");
    const wrapperAnimation2 = document.getElementById("wrapperOpacityAnime2");
    wrapperAnimation.style.animation = "none";
    wrapperAnimation2.style.animation = "none";
    wrapperAnimation.style.opacity = "1";
    wrapperAnimation2.style.opacity = "1";
  }

  if (mediaQuery2.matches) {
  const wrapperAnimation = document.getElementById("wrapperOpacityAnime");
  const wrapperAnimation2 = document.getElementById("wrapperOpacityAnime2");
  wrapperAnimation.style.animation = "slideinLeftReverse 6s 1, slideinout 4s 1";
  wrapperAnimation2.style.animation = "slideinRightReverse 3s 1, slideinout 1.5s 1";
  wrapperAnimation.style.opacity = "0";
  wrapperAnimation2.style.opacity = "0";

 }
 

});

function pageScroll() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
