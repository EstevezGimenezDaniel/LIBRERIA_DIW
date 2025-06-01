class ResponsiveMenu {
  constructor() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.mainNav = document.querySelector('.main-nav');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.mainNav) {
      console.warn('Elementos del menú no encontrados');
      return;
    }

    this.menuToggle.addEventListener('click', this.toggleMenu.bind(this));
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.closeMenu.bind(this));
    });

    document.addEventListener('click', this.handleOutsideClick.bind(this));

    window.addEventListener('resize', this.handleResize.bind(this));

    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    this.updateMenuState();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.updateMenuState();
  }

  openMenu() {
    this.isOpen = true;
    this.updateMenuState();
  }

  closeMenu() {
    this.isOpen = false;
    this.updateMenuState();
  }

  updateMenuState() {

    this.mainNav.classList.toggle('active', this.isOpen);
    this.menuToggle.classList.toggle('active', this.isOpen);
    

    this.menuToggle.setAttribute('aria-expanded', this.isOpen.toString());
    

    const menuIcon = this.menuToggle.querySelector('.menu-icon');
    if (menuIcon) {
      menuIcon.textContent = this.isOpen ? '✕' : '☰';
    }

    if (this.isOpen) {

      const firstLink = this.mainNav.querySelector('.nav-link');
      if (firstLink && window.innerWidth <= 768) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  }

  handleOutsideClick(event) {

    if (window.innerWidth > 768) return;
    
    if (this.isOpen && 
        !this.mainNav.contains(event.target) && 
        !this.menuToggle.contains(event.target)) {
      this.closeMenu();
    }
  }

  handleResize() {
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMenu();
    }
  }

  handleKeyDown(event) {

    if (event.key === 'Escape' && this.isOpen) {
      this.closeMenu();
      this.menuToggle.focus();
    }

    if (window.innerWidth <= 768 && this.isOpen) {
      this.handleMenuNavigation(event);
    }
  }

  handleMenuNavigation(event) {
    const focusableElements = this.mainNav.querySelectorAll('.nav-link');
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex].focus();
        break;
        
      case 'Home':
        event.preventDefault();
        focusableElements[0].focus();
        break;
        
      case 'End':
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
        break;
    }
  }
}

function enhanceUserExperience() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const currentPage = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage.split('/').pop()) {
      link.setAttribute('aria-current', 'page');
      link.style.fontWeight = '700';
    }
  });
}

function initializeMenu() {
  try {
    new ResponsiveMenu();
    
    enhanceUserExperience();
    
    console.log('Menú de navegación inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el menú:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMenu);
} else {
  initializeMenu();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ResponsiveMenu };
}