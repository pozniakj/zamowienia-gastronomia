document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById('order-list');
  const totalPriceElem = document.getElementById('total-price');
  const savedOrderContainer = document.getElementById('saved-order');
  let order = JSON.parse(localStorage.getItem('order')) || [];

  const menu = {
      burgers: [
          { name: 'Classic', price: 28 },
          { name: 'BBQ', price: 32 },
          { name: 'Oklahoma', price: 28 },
          { name: 'Chipotle', price: 30 },
          { name: 'Truffla', price: 30 },
          { name: 'Piekielny', price: 32 },
          { name: 'KimCheese', price: 32 },
          { name: 'Bydlak', price: 35 }
      ],
      fries: [
          { name: 'Małe', price: 7 },
          { name: 'Duże', price: 10 }
      ],
      sides: [
          { name: 'Dodatkowe Mięso', price: 12 },
          { name: 'Składnik 2zł', price: 2 },
          { name: 'Składnik 4zł', price: 4 }
      ]
  };

  const createItems = (container, items) => {
      container.innerHTML = '';
      items.forEach(item => {
          const button = document.createElement('button');
          button.classList.add("menu-item");
          button.textContent = `${item.name} - ${item.price} PLN +`;
          button.onclick = () => addToOrder(item);
          container.appendChild(button);
      });
  };

  const addToOrder = (item) => {
      const existingItem = order.find(o => o.name === item.name);
      if (existingItem) {
          existingItem.quantity++;
      } else {
          order.push({ ...item, quantity: 1 });
      }
      updateOrderSummary();
  };

  window.removeFromOrder = (index) => {
      order.splice(index, 1);
      updateOrderSummary();
  };

  const updateOrderSummary = () => {
      orderList.innerHTML = '';
      let totalPrice = 0;

      order.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `${item.name} x${item.quantity} - ${item.price * item.quantity} PLN 
              <button class="remove-btn" onclick="removeFromOrder(${index})">🗑</button>`;
          orderList.appendChild(listItem);
          totalPrice += item.price * item.quantity;
      });

      totalPriceElem.textContent = `Cena całkowita: ${totalPrice} PLN`;
      localStorage.setItem('order', JSON.stringify(order));
  };

  document.getElementById('save-order-main')?.addEventListener('click', () => {
      localStorage.setItem('savedOrder', JSON.stringify(order));
      alert('Zamówienie zapisane!');

      order = [];
      localStorage.setItem('order', JSON.stringify(order));
      updateOrderSummary();
      showSavedOrder();
  });

  const showSavedOrder = () => {
      const savedOrder = JSON.parse(localStorage.getItem('savedOrder'));
      if (!savedOrder || savedOrder.length === 0) return;

      savedOrderContainer.innerHTML = `<h2>📝 Ostatnie zamówienie</h2>`;
      const orderBox = document.createElement('div');
      orderBox.classList.add('saved-order-box');

      let totalPrice = 0;
      savedOrder.forEach(item => {
          const itemText = document.createElement('p');
          itemText.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} PLN`;
          orderBox.appendChild(itemText);
          totalPrice += item.price * item.quantity;
      });

      const totalText = document.createElement('p');
      totalText.innerHTML = `<strong>Łączna cena:</strong> ${totalPrice} PLN`;
      orderBox.appendChild(totalText);
      savedOrderContainer.appendChild(orderBox);
  };

  if (document.getElementById('burger-items')) {
      createItems(document.getElementById('burger-items'), menu.burgers);
  } else if (document.getElementById('fries-items')) {
      createItems(document.getElementById('fries-items'), menu.fries);
  } else if (document.getElementById('sides-items')) {
      createItems(document.getElementById('sides-items'), menu.sides);
  }

  showSavedOrder();
  updateOrderSummary();
});
