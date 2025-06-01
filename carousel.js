class ProductCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.track = this.container.querySelector('.carousel-track');
    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.prevBtn = this.container.querySelector('.carousel-btn-prev');
    this.nextBtn = this.container.querySelector('.carousel-btn-next');
    this.indicators = this.container.querySelectorAll('.carousel-indicator');

    this.currentSlide = 0;
    this.slidesToShow = this.getSlidesToShow();
    this.totalSlides = this.slides.length;
    this.maxSlide = Math.max(0, this.totalSlides - this.slidesToShow);
    this.isTransitioning = false;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; 

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    this.setupEventListeners();
    this.updateCarousel();
    this.updateButtons();
    this.updateIndicators();
    
    if (this.totalSlides > this.slidesToShow) {
      this.startAutoplay();
    }

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  setupEventListeners() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    this.track.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.track.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.track.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    this.track.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.track.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.track.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.track.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    this.container.addEventListener('focusin', () => this.pauseAutoplay());
    this.container.addEventListener('focusout', () => this.startAutoplay());

    this.container.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  getSlidesToShow() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 4;
  }

  handleResize() {
    const newSlidesToShow = this.getSlidesToShow();
    if (newSlidesToShow !== this.slidesToShow) {
      this.slidesToShow = newSlidesToShow;
      this.maxSlide = Math.max(0, this.totalSlides - this.slidesToShow);
      
      if (this.currentSlide > this.maxSlide) {
        this.currentSlide = this.maxSlide;
      }
      
      this.updateCarousel();
      this.updateButtons();
      this.updateIndicators();
    }
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.maxSlide);
        break;
    }
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.pauseAutoplay();
  }

  handleTouchMove(e) {
    if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
      e.preventDefault();
    }
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
    this.startAutoplay();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.touchStartX = e.clientX;
    this.track.style.cursor = 'grabbing';
    this.pauseAutoplay();
    e.preventDefault();
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
  }

  handleMouseUp(e) {
    if (this.isDragging) {
      this.touchEndX = e.clientX;
      this.handleSwipe();
      this.isDragging = false;
      this.track.style.cursor = '';
      this.startAutoplay();
    }
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  prevSlide() {
    if (this.isTransitioning) return;
    
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.maxSlide;
    }
    
    this.updateCarousel();
    this.updateButtons();
    this.updateIndicators();
  }

  nextSlide() {
    if (this.isTransitioning) return;
    
    if (this.currentSlide < this.maxSlide) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
    
    this.updateCarousel();
    this.updateButtons();
    this.updateIndicators();
  }

  goToSlide(slideIndex) {
    if (this.isTransitioning) return;
    
    const targetSlide = Math.max(0, Math.min(slideIndex, this.maxSlide));
    
    if (targetSlide !== this.currentSlide) {
      this.currentSlide = targetSlide;
      this.updateCarousel();
      this.updateButtons();
      this.updateIndicators();
    }
  }

  updateCarousel() {
    if (!this.track) return;
    
    this.isTransitioning = true;
    
    const slideWidth = this.slides[0].offsetWidth;
    const gap = 20;
    const offset = -(this.currentSlide * (slideWidth + gap));

    this.track.style.transform = `translateX(${offset}px)`;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  updateButtons() {
    if (!this.prevBtn || !this.nextBtn) return;

    this.prevBtn.disabled = false;
    this.nextBtn.disabled = false;
  }

  updateIndicators() {
    if (this.indicators.length === 0) return;
    
    this.indicators.forEach((indicator, index) => {
      const isActive = index === this.currentSlide;
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-pressed', isActive.toString());
    });
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  stopAutoplay() {
    this.pauseAutoplay();
  }

  destroy() {
    this.stopAutoplay();
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    this.prevBtn?.removeEventListener('click', () => this.prevSlide());
    this.nextBtn?.removeEventListener('click', () => this.nextSlide());
    
    this.indicators.forEach((indicator, index) => {
      indicator.removeEventListener('click', () => this.goToSlide(index));
    });
    
    this.container = null;
    this.track = null;
    this.slides = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.indicators = null;
  }
}

function initCarousels() {
  const bestSellersCarousel = new ProductCarousel('.carousel-section');
  
  window.carousels = {
    bestSellers: bestSellersCarousel
  };
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}

function pauseAllCarousels() {
  if (window.carousels) {
    Object.values(window.carousels).forEach(carousel => {
      if (carousel && typeof carousel.pauseAutoplay === 'function') {
        carousel.pauseAutoplay();
      }
    });
  }
}

function resumeAllCarousels() {
  if (window.carousels) {
    Object.values(window.carousels).forEach(carousel => {
      if (carousel && typeof carousel.startAutoplay === 'function') {
        carousel.startAutoplay();
      }
    });
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseAllCarousels();
  } else {
    resumeAllCarousels();
  }
});
