const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "rgb(5, 5, 49)";
canvas.style.zIndex = "1";
let darkmode = 0;



const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
const mouseTarget = document.getElementById('homeBackground');

let colors = ['lightblue', 'white', 'gold', 'rgb(106, 106, 226)'];
let colors1 = ['lightblue'];


addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init()
});

class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
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
    for (let i = 0; i < 400; i++) {
      const canvasWidth = canvas.width + 900
      const canvasHeight = canvas.height + 900
      let x = Math.random() * canvasWidth - canvasWidth / 2
      let y = Math.random() * canvasHeight - canvasHeight / 2
      let radius = 4 * Math.random();
      let color = colors[Math.floor(Math.random() * colors.length)]
      particles.push(new Particle(x, y, radius, color))

      if (darkmode > 1) {
        let color = colors1[Math.floor(Math.random() * colors1.length)]
        let radius = 19 * Math.random();
        particles.push(new Particle(x, y, radius, color))
        
      }
      
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
        particle.update()
    })
    
    c.restore()
  radians += 0.0007
}

init()
animate()

mouseTarget.addEventListener('mouseenter', () => {
  canvas.style.backgroundColor = "black";
  darkmode++;
})


mouseTarget.addEventListener('mouseleave', () => {
  canvas.style.backgroundColor = "darkgrey";
})


