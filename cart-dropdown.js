class CartDropdown {
  constructor() {
    this.cart = new ShoppingCart();
    this.init();
  }

  init() {
    this.createDropdownHTML();
    this.bindEvents();
    this.updateDropdown();
  }

  createDropdownHTML() {
    const cartButton = document.querySelector('.cart-btn') || 
                      document.querySelector('.carrito-btn') ||
                      document.querySelector('[href="carrito.html"]') ||
                      document.querySelector('a[href*="carrito"]');
    
    if (!cartButton) {
      console.warn('No se encontró el botón del carrito');
      return;
    }

    cartButton.classList.add('cart-button');

    const dropdown = document.createElement('div');
    dropdown.className = 'cart-dropdown';
    dropdown.innerHTML = `
      <div class="cart-dropdown-header">
        Mi Carrito
      </div>
      <div class="cart-dropdown-items" id="cart-dropdown-items">
        <!-- Los items se cargarán dinámicamente -->
      </div>
      <div class="cart-dropdown-footer">
        <div class="cart-total" id="cart-dropdown-total">
          Total: 0.00€
        </div>
        <a href="carrito.html" class="cart-dropdown-button">
          Ir a mi carrito
        </a>
      </div>
    `;

    cartButton.appendChild(dropdown);
    this.dropdown = dropdown;
    
    dropdown.style.display = 'none';
  }


  updateDropdown() {
    if (!this.dropdown) return;

    const items = this.cart.getItems();
    const itemsContainer = document.getElementById('cart-dropdown-items');
    const totalContainer = document.getElementById('cart-dropdown-total');
    
    if (!itemsContainer || !totalContainer) return;

    itemsContainer.innerHTML = '';

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-dropdown-empty">
          Tu carrito está vacío
        </div>
      `;
      totalContainer.textContent = 'Total: 0.00€';
      return;
    }

    const itemsToShow = items.slice(0, 3);
    let total = 0;

    itemsToShow.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemElement = document.createElement('div');
      itemElement.className = 'cart-dropdown-item';
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-title">${this.truncateTitle(item.title)}</div>
          <div class="cart-item-quantity">Cantidad: ${item.quantity}</div>
        </div>
        <div class="cart-item-price">${item.price.toFixed(2)}€</div>
      `;
      itemsContainer.appendChild(itemElement);
    });

    const fullTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (items.length > 3) {
      const moreItemsElement = document.createElement('div');
      moreItemsElement.className = 'cart-more-items';
      moreItemsElement.textContent = `y ${items.length - 3} artículo${items.length - 3 > 1 ? 's' : ''} más...`;
      itemsContainer.appendChild(moreItemsElement);
    }

    totalContainer.textContent = `Total: ${fullTotal.toFixed(2)}€`;
  }

  truncateTitle(title, maxLength = 30) {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  }


  bindEvents() {
    const cartButton = document.querySelector('.cart-button');
    
    if (cartButton && this.dropdown) {
      cartButton.addEventListener('mouseenter', () => {
        this.dropdown.style.display = 'block';
        setTimeout(() => {
          this.dropdown.style.opacity = '1';
          this.dropdown.style.visibility = 'visible';
          this.dropdown.style.transform = 'translateY(0)';
        }, 10);
      });

      cartButton.addEventListener('mouseleave', () => {
        this.dropdown.style.opacity = '0';
        this.dropdown.style.visibility = 'hidden';
        this.dropdown.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          this.dropdown.style.display = 'none';
        }, 300);
      });
    }

    document.addEventListener('cartUpdated', () => {
      this.updateDropdown();
    });

    setInterval(() => {
      this.updateDropdown();
    }, 1000);
  }

  refresh() {
    this.updateDropdown();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const isCartPage = window.location.pathname.includes('carrito') || 
                     document.title.toLowerCase().includes('carrito');
  
  if (!isCartPage) {
    window.cartDropdown = new CartDropdown();
  }
});

window.updateCartDropdown = function() {
  if (window.cartDropdown) {
    window.cartDropdown.refresh();
  }
};