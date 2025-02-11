const burgers = [
  { name: 'Classic', price: 28 },
  { name: 'BBQ', price: 32 },
  { name: 'Oklahoma', price: 28 },
  { name: 'Chipotle', price: 30 },
  { name: 'Truffla', price: 30 },
  { name: 'Piekielny', price: 32 },
  { name: 'KimCheese', price: 32 },
  { name: 'Bydlak', price: 35 }
];

const fries = [
  { name: 'Małe', price: 7 },
  { name: 'Duże', price: 10 }
];

const sides = [
  { name: 'Dodatkowe Mięso', price: 12 },
  { name: 'Składnik 2zł', price: 2 },
  { name: 'Składnik 4zł', price: 4 }
];

const order = [];

const burgerContainer = document.getElementById('burger-items');
const friesContainer = document.getElementById('fries-items');
const sidesContainer = document.getElementById('sides-items');
const orderList = document.getElementById('order-list');
const totalPriceElem = document.getElementById('total-price');

// Funkcja do generowania produktów w sekcji
const createItems = (container, items) => {
  container.innerHTML = '';  // Czyszczenie kontenera przed dodaniem nowych przycisków
  items.forEach(item => {
      const button = document.createElement('button');
      button.textContent = `${item.name} - ${item.price} PLN +`;
      button.onclick = () => addToOrder(item);
      container.appendChild(button);
  });
};

// Funkcja do dodawania pozycji do zamówienia
const addToOrder = (item) => {
  order.push(item);
  updateOrderSummary();
};

// Funkcja do aktualizacji podsumowania zamówienia
const updateOrderSummary = () => {
  orderList.innerHTML = '';
  let totalPrice = 0;
  order.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `${item.name} - ${item.price} PLN`;
      orderList.appendChild(listItem);
      totalPrice += item.price;
  });
  totalPriceElem.textContent = `Cena całkowita: ${totalPrice} PLN`;
};

// Inicjalizacja strony
if (burgerContainer) {
  createItems(burgerContainer, burgers);
} else if (friesContainer) {
  createItems(friesContainer, fries);
} else if (sidesContainer) {
  createItems(sidesContainer, sides);
}

// Funkcja do zapisywania zamówienia
document.getElementById('save-order').onclick = () => {
  alert('Zamówienie zapisane!');
};
