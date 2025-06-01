class ShoppingCart {
  constructor(storageKey = 'cartItems') {
    this.storageKey = storageKey;
    this.items = this.loadFromStorage();
  }

  loadFromStorage() {
    const storedItems = localStorage.getItem(this.storageKey);
    try {
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      return [];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  addItem(newItem) {
    const existing = this.items.find(item => item.id === newItem.id);
    if (existing) {
      existing.quantity += newItem.quantity;
    } else {
      this.items.push({ ...newItem });
    }
    this.saveToStorage();
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveToStorage();
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
  }

  getItems() {
    return this.items;
  }

  getItemCount() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  }
}

// Exportar si usas módulos
// export default ShoppingCart;
