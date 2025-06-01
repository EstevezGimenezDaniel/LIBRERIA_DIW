const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);


document.querySelectorAll('.product-card, .testimonial-card, .gallery-item, .feature-content, .cta-content').forEach(el => observer.observe(el));


function setupHoverAnimations() {

  document.querySelectorAll('.product-card').forEach(card => {
    let hoverTimeout;
    
    card.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout);
      this.style.animationPlayState = 'running';
    });
    
    card.addEventListener('mouseleave', function() {
      hoverTimeout = setTimeout(() => {
        this.style.animationPlayState = 'paused';
      }, 300);
    });
  });

  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.classList.add('pulse');
    });
    
    button.addEventListener('mouseleave', function() {
      if (!this.classList.contains('keep-pulse')) {
        this.classList.remove('pulse');
      }
    });
  });

  document.querySelectorAll('.hero-title, .section-title').forEach(title => {
    title.addEventListener('mouseenter', function() {
      this.style.animation = 'none';
      this.offsetHeight; 
      this.style.animation = 'typewriter 2s steps(40, end)';
    });
  });
}

function createParticleEffect(element) {
  const particles = [];
  const colors = ['#283618', '#b3be7e', '#ffffff'];
  
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    const rect = element.getBoundingClientRect();
    particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
    particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
    
    document.body.appendChild(particle);
    particles.push(particle);

    particle.animate([
      { 
        transform: 'translate(0, 0) scale(1)', 
        opacity: 1 
      },
      { 
        transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => {
      particle.remove();
    };
  }
}

document.querySelectorAll('.buy-now, .favorite-btn').forEach(element => {
  element.addEventListener('click', function(e) {
    e.preventDefault();
    createParticleEffect(this);
  });
});

const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 100;
canvas.id = "canvasAnimado";
canvas.style.display = "block";
canvas.style.opacity = "0.7";

const footer = document.querySelector("footer");
if (footer) {
  footer.appendChild(canvas);
}

const ctx = canvas.getContext("2d");
let animationFrame;

const animatedElements = [
  { x: 0, y: 30, speed: 1, color: "#283618", size: 8 },
  { x: 50, y: 60, speed: 0.5, color: "#b3be7e", size: 6 },
  { x: 100, y: 40, speed: 1.5, color: "#283618", size: 10 }
];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  animatedElements.forEach(element => {
    ctx.beginPath();
    ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
    ctx.fillStyle = element.color;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(element.x - 20, element.y, element.size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = element.color + "40"; 
    ctx.fill();
    
    element.x += element.speed;
    if (element.x > canvas.width + element.size) {
      element.x = -element.size;
    }
  });
  
  animationFrame = requestAnimationFrame(animate);
}

let isCanvasVisible = true;
const canvasObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !isCanvasVisible) {
      isCanvasVisible = true;
      animate();
    } else if (!entry.isIntersecting && isCanvasVisible) {
      isCanvasVisible = false;
      cancelAnimationFrame(animationFrame);
    }
  });
});

if (canvas) {
  canvasObserver.observe(canvas);
  animate();
}

document.addEventListener('DOMContentLoaded', function() {
  setupHoverAnimations();
  
  document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(element => {
      element.style.animationDuration = '0.01ms !important';
      element.style.animationDelay = '0.01ms !important';
      element.style.transitionDuration = '0.01ms !important';
      element.style.transitionDelay = '0.01ms !important';
    });
  }
});

function restartAnimation(element, animationName) {
  element.style.animation = 'none';
  element.offsetHeight; 
  element.style.animation = null;
}

document.addEventListener('mouseover', function(e) {
  if (e.target.closest('.testimonial-card')) {
    const card = e.target.closest('.testimonial-card');
    restartAnimation(card, 'bounceHover');
  }
  
  if (e.target.closest('.gallery-item')) {
    const item = e.target.closest('.gallery-item');
    restartAnimation(item, 'shine');
  }
});

document.querySelectorAll('.social-icon').forEach(icon => {
  icon.addEventListener('mouseenter', function() {
    this.style.transform = 'rotate(10deg) scale(1.1)';
  });
  
  icon.addEventListener('mouseleave', function() {
    this.style.transform = 'rotate(0deg) scale(1)';
  });
});


if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    setupHoverAnimations();
  });
} else {
  setTimeout(setupHoverAnimations, 100);
}

document.addEventListener('keydown', function (e) {
  if (e.key === 't' || e.key === 'T') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
