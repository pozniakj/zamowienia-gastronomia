document.addEventListener("DOMContentLoaded", () => {
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

    const order = JSON.parse(localStorage.getItem('order')) || [];

    const orderList = document.getElementById('order-list');
    const totalPriceElem = document.getElementById('total-price');

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

    const updateOrderSummary = () => {
        orderList.innerHTML = '';
        let totalPrice = 0;
        order.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} PLN`;
            orderList.appendChild(listItem);
            totalPrice += item.price * item.quantity;
        });
        totalPriceElem.textContent = `Cena całkowita: ${totalPrice} PLN`;
        localStorage.setItem('order', JSON.stringify(order));
    };

    if (document.getElementById('burger-items')) {
        createItems(document.getElementById('burger-items'), menu.burgers);
    } else if (document.getElementById('fries-items')) {
        createItems(document.getElementById('fries-items'), menu.fries);
    } else if (document.getElementById('sides-items')) {
        createItems(document.getElementById('sides-items'), menu.sides);
    }

    document.getElementById('save-order')?.addEventListener('click', () => {
        alert('Zamówienie zapisane!');
    });

    updateOrderSummary();
});
