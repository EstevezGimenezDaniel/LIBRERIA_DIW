document.addEventListener('DOMContentLoaded', function() {
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-container .nav-link, .tabs .nav-link, [role="tab"]');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        if (tabButtons.length === 0) {
            return;
        }
        
        let hasActiveTab = false;
        let activeIndex = 0;
        
        tabButtons.forEach((btn, index) => {
            if (btn.classList.contains('active')) {
                hasActiveTab = true;
                activeIndex = index;
            }
        });
        
        if (!hasActiveTab) {
            tabButtons.forEach((btn, index) => {
                if (btn.getAttribute('aria-selected') === 'true') {
                    hasActiveTab = true;
                    activeIndex = index;
                }
            });
        }
        
        tabPanes.forEach(pane => {
            pane.style.display = 'none';
            pane.classList.remove('active', 'show');
        });
        
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        if (tabButtons.length > 0 && tabPanes.length > 0) {
            tabButtons[activeIndex].classList.add('active');
            tabButtons[activeIndex].setAttribute('aria-selected', 'true');
            
            if (tabPanes[activeIndex]) {
                tabPanes[activeIndex].style.display = 'block';
                tabPanes[activeIndex].classList.add('active', 'show');
            }
            
            updateStatusIndicators(tabButtons[activeIndex]);
        }
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                tabPanes.forEach(pane => {
                    pane.style.display = 'none';
                    pane.classList.remove('active', 'show');
                });
                
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                if (tabPanes[index]) {
                    tabPanes[index].style.display = 'block';
                    tabPanes[index].classList.add('active', 'show');
                    
                    tabPanes[index].style.opacity = '0';
                    tabPanes[index].style.transform = 'translateY(10px)';
                    tabPanes[index].style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        tabPanes[index].style.opacity = '1';
                        tabPanes[index].style.transform = 'translateY(0)';
                    }, 10);
                }
                
                updateStatusIndicators(this);
                
                announceTabChange(this, index);
            });
        });
    }
    
    function updateStatusIndicators(activeButton) {
        const allIndicators = document.querySelectorAll('.status-indicator');
        
        allIndicators.forEach(indicator => {
            indicator.classList.remove('status-active');
            indicator.classList.add('status-inactive');
        });
        
        if (activeButton) {
            const activeIndicator = activeButton.querySelector('.status-indicator');
            if (activeIndicator) {
                activeIndicator.classList.remove('status-inactive');
                activeIndicator.classList.add('status-active');
            }
        }
    }
    
    function initAccordion() {
        const accordionButtons = document.querySelectorAll('.accordion-button');
        
        const openAccordions = [];
        accordionButtons.forEach((button, index) => {
            const targetCollapse = findAccordionTarget(button);
            if (targetCollapse && targetCollapse.classList.contains('show')) {
                openAccordions.push(index);
            }
        });
        
        accordionButtons.forEach((button, index) => {
            const targetCollapse = findAccordionTarget(button);
            if (!targetCollapse) return;
            
            if (openAccordions.includes(index)) {
                button.classList.remove('collapsed');
                button.setAttribute('aria-expanded', 'true');
                targetCollapse.classList.add('show');
                targetCollapse.style.display = 'block';
            } else {
                button.classList.add('collapsed');
                button.setAttribute('aria-expanded', 'false');
                targetCollapse.classList.remove('show');
                targetCollapse.style.display = 'none';
            }
        });
        
        if (openAccordions.length === 0 && accordionButtons.length > 0) {
            const firstButton = accordionButtons[0];
            const firstTarget = findAccordionTarget(firstButton);
            if (firstTarget) {
                openAccordionItem(firstButton, firstTarget);
            }
        }
        
        accordionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetCollapse = findAccordionTarget(this);
                if (!targetCollapse) {
                    console.warn('No se encontró el contenedor del acordeón para:', this);
                    return;
                }
                
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
                
                if (isExpanded) {
                    closeAccordionItem(this, targetCollapse);
                } else {
                    openAccordionItem(this, targetCollapse);
                }
            });
        });
    }
    
    function findAccordionTarget(button) {
        let targetId = button.getAttribute('data-bs-target');
        if (!targetId) {
            targetId = button.getAttribute('data-target');
        }
        
        if (targetId) {
            const cleanId = targetId.replace('#', '');
            return document.getElementById(cleanId);
        }
        
        const ariaControls = button.getAttribute('aria-controls');
        if (ariaControls) {
            return document.getElementById(ariaControls);
        }
        
        let targetCollapse = button.nextElementSibling;
        while (targetCollapse && !targetCollapse.classList.contains('accordion-collapse')) {
            targetCollapse = targetCollapse.nextElementSibling;
        }
        
        if (!targetCollapse) {
            const accordionItem = button.closest('.accordion-item');
            if (accordionItem) {
                targetCollapse = accordionItem.querySelector('.accordion-collapse');
            }
        }
        
        return targetCollapse;
    }
    
    function openAccordionItem(button, targetCollapse) {
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        
        targetCollapse.style.display = 'block';
        targetCollapse.classList.add('show');
        
        const content = targetCollapse.querySelector('.accordion-body') || targetCollapse;
        const contentHeight = content.scrollHeight;
        
        targetCollapse.style.maxHeight = '0px';
        targetCollapse.style.overflow = 'hidden';
        targetCollapse.style.transition = 'max-height 0.35s ease-out';
        
        requestAnimationFrame(() => {
            targetCollapse.style.maxHeight = contentHeight + 'px';
        });
        
        setTimeout(() => {
            targetCollapse.style.maxHeight = 'none';
            targetCollapse.style.overflow = 'visible';
            targetCollapse.style.transition = '';
        }, 350);
    }
    
    function closeAccordionItem(button, targetCollapse) {
        button.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        
        const currentHeight = targetCollapse.scrollHeight;
        targetCollapse.style.maxHeight = currentHeight + 'px';
        targetCollapse.style.overflow = 'hidden';
        targetCollapse.style.transition = 'max-height 0.35s ease-in';
        
        targetCollapse.offsetHeight;
        
        requestAnimationFrame(() => {
            targetCollapse.style.maxHeight = '0px';
        });
        
        setTimeout(() => {
            targetCollapse.style.display = 'none';
            targetCollapse.classList.remove('show');
            targetCollapse.style.maxHeight = '';
            targetCollapse.style.overflow = '';
            targetCollapse.style.transition = '';
        }, 350);
    }
    
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            const activeElement = document.activeElement;
            
            if (activeElement.matches('.tab-container .nav-link, .tabs .nav-link, [role="tab"]')) {
                const tabList = Array.from(document.querySelectorAll('.tab-container .nav-link, .tabs .nav-link, [role="tab"]'));
                const currentIndex = tabList.indexOf(activeElement);
                
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % tabList.length;
                    tabList[nextIndex].focus();
                    tabList[nextIndex].click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + tabList.length) % tabList.length;
                    tabList[prevIndex].focus();
                    tabList[prevIndex].click();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activeElement.click();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    tabList[0].focus();
                    tabList[0].click();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    tabList[tabList.length - 1].focus();
                    tabList[tabList.length - 1].click();
                }
            }
            
            if (activeElement.classList.contains('accordion-button')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activeElement.click();
                }
            }
        });
    }
    
    function announceTabChange(button, index) {
        const tabName = button.textContent.trim();
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = `Pestaña ${tabName} seleccionada`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    window.TabsAPI = {
        showTab: function(index) {
            const tabButtons = document.querySelectorAll('.tab-container .nav-link, .tabs .nav-link, [role="tab"]');
            if (tabButtons[index]) {
                tabButtons[index].click();
                return true;
            }
            return false;
        },
        
        showTabById: function(id) {
            const tabButton = document.querySelector(`[data-bs-target="#${id}"], [data-target="#${id}"]`);
            if (tabButton) {
                tabButton.click();
                return true;
            }
            return false;
        },
        
        getActiveTab: function() {
            return document.querySelector('.tab-container .nav-link.active, .tabs .nav-link.active, [role="tab"].active');
        },
        
        getActiveTabIndex: function() {
            const activeTab = this.getActiveTab();
            if (activeTab) {
                const tabButtons = Array.from(document.querySelectorAll('.tab-container .nav-link, .tabs .nav-link, [role="tab"]'));
                return tabButtons.indexOf(activeTab);
            }
            return -1;
        },
        
        toggleAccordion: function(id) {
            const accordionButton = document.querySelector(`[data-bs-target="#${id}"], [data-target="#${id}"], [aria-controls="${id}"]`);
            if (accordionButton) {
                accordionButton.click();
                return true;
            }
            return false;
        },
        
        openAccordion: function(id) {
            const accordionButton = document.querySelector(`[data-bs-target="#${id}"], [data-target="#${id}"], [aria-controls="${id}"]`);
            if (accordionButton && accordionButton.getAttribute('aria-expanded') === 'false') {
                accordionButton.click();
                return true;
            }
            return false;
        },
        
        closeAccordion: function(id) {
            const accordionButton = document.querySelector(`[data-bs-target="#${id}"], [data-target="#${id}"], [aria-controls="${id}"]`);
            if (accordionButton && accordionButton.getAttribute('aria-expanded') === 'true') {
                accordionButton.click();
                return true;
            }
            return false;
        }
    };
    
    initTabs();
    initAccordion();
    initKeyboardNavigation();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const openAccordions = document.querySelectorAll('.accordion-collapse.show');
            openAccordions.forEach(accordion => {
                if (accordion.style.maxHeight && accordion.style.maxHeight !== 'none') {
                    accordion.style.maxHeight = 'none';
                    const newHeight = accordion.scrollHeight;
                    accordion.style.maxHeight = newHeight + 'px';
                }
            });
        }, 250);
    });
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                const hasNewTabs = addedNodes.some(node => 
                    node.nodeType === 1 && 
                    (node.matches('.tab-container .nav-link, .tabs .nav-link, [role="tab"]') || 
                     node.querySelector('.tab-container .nav-link, .tabs .nav-link, [role="tab"]'))
                );
                const hasNewAccordions = addedNodes.some(node => 
                    node.nodeType === 1 && 
                    (node.classList.contains('accordion-button') || node.querySelector('.accordion-button'))
                );
                
                if (hasNewTabs || hasNewAccordions) {
                    setTimeout(() => {
                        initTabs();
                        initAccordion();
                    }, 100);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Sistema de pestañas y acordeones inicializado correctamente');
});