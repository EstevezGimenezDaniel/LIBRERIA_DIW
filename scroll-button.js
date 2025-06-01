document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    function toggleScrollButton() {
        if (window.pageYOffset > 100) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Optimizar el evento scroll con throttle
    const throttledToggle = throttle(toggleScrollButton, 100);
    window.addEventListener('scroll', throttledToggle);
    
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Verificar estado inicial
    toggleScrollButton();
});

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}