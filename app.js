document.addEventListener("DOMContentLoaded", () => {
    const menu = [
        { id: 1, name: 'Pizza Margherita', price: 25 },
        { id: 2, name: 'Spaghetti Bolognese', price: 30 },
        { id: 3, name: 'Burger', price: 20 },
        { id: 4, name: 'Sałatka grecka', price: 15 }
    ];

    const menuContainer = document.getElementById("menu");
    const orderList = document.getElementById("order-list");

    menu.forEach(item => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        menuItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Cena: ${item.price} zł</p>
            <button onclick="addToOrder(${item.id})">Dodaj do zamówienia</button>
        `;
        menuContainer.appendChild(menuItem);
    });

    const order = [];

    window.addToOrder = (id) => {
        const item = menu.find(m => m.id === id);
        if (item) {
            order.push(item);
            updateOrder();
        }
    };

    function updateOrder() {
        orderList.innerHTML = "";
        order.forEach(item => {
            const orderItem = document.createElement("li");
            orderItem.innerText = `${item.name} - ${item.price} zł`;
            orderList.appendChild(orderItem);
        });
    }
});
