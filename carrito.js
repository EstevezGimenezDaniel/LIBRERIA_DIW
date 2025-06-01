const cart = new ShoppingCart();
const tbody = document.getElementById('cart-body');
const totalEl = document.getElementById('cart-total');
const modal = document.getElementById('confirm-modal');
const confirmBtn = document.getElementById('confirm-delete');
const cancelBtn = document.getElementById('cancel-delete');
let itemToDelete = null;

function renderCart() {
  tbody.innerHTML = '';
  const items = cart.getItems();
  let total = 0;

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No hay artículos en el carrito.</td></tr>';
    totalEl.textContent = '0.00€';
    return;
  }

  items.forEach(item => {
    const row = document.createElement('tr');
    const itemTotal = (item.price * item.quantity).toFixed(2);
    total += parseFloat(itemTotal);
    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.price.toFixed(2)}€</td>
      <td>${item.quantity}</td>
      <td>${itemTotal}€</td>
      <td><button class="btn btn-secondary" data-id="${item.id}">Eliminar</button></td>
    `;
    tbody.appendChild(row);
  });

  totalEl.textContent = `${total.toFixed(2)}€`;

  attachDeleteEventListeners();
}

function attachDeleteEventListeners() {
  document.querySelectorAll('.btn-secondary[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      itemToDelete = btn.getAttribute('data-id');
      modal.style.display = 'block';
    });
  });
}

function confirmDelete() {
  if (itemToDelete) {
    cart.removeItem(itemToDelete);
    itemToDelete = null;
    modal.style.display = 'none';
    renderCart();
  }
}

function cancelDelete() {
  itemToDelete = null;
  modal.style.display = 'none';
}

function handleModalClick(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
}

confirmBtn.addEventListener('click', confirmDelete);
cancelBtn.addEventListener('click', cancelDelete);
window.addEventListener('click', handleModalClick);

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});