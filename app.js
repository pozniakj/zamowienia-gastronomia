document.addEventListener("DOMContentLoaded", () => {
    const savedOrdersContainer = document.getElementById("saved-orders-container");
    const orderList = document.getElementById("order-list");
    const totalPriceElem = document.getElementById("total-price");
    const saveOrderButton = document.getElementById("save-order");
    const orderDescription = document.getElementById("order-description");

    let order = JSON.parse(localStorage.getItem("currentOrder")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

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
        orderList.innerHTML = "";
        let totalPrice = 0;

        order.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${item.name} x${item.quantity} - ${item.price * item.quantity} PLN 
                <button class="remove-btn" onclick="removeFromOrder(${index})">🗑</button>`;
            orderList.appendChild(listItem);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElem.textContent = `Cena całkowita: ${totalPrice} PLN`;
        localStorage.setItem("currentOrder", JSON.stringify(order));
    };

    saveOrderButton?.addEventListener("click", () => {
        if (order.length === 0) {
            alert("Nie można zapisać pustego zamówienia!");
            return;
        }

        const orderNote = orderDescription?.value || "";

        savedOrders.push({ items: [...order], note: orderNote });
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));

        order = [];
        orderDescription.value = "";
        localStorage.setItem("currentOrder", JSON.stringify(order));

        updateOrderSummary();
        updateSavedOrders();
    });

    const updateSavedOrders = () => {
        savedOrdersContainer.innerHTML = "";

        let savedOrders = JSON.parse(localStorage.getItem("savedOrders"));
        if (!Array.isArray(savedOrders)) savedOrders = [];

        if (savedOrders.length === 0) {
            savedOrdersContainer.innerHTML = "<p>Brak zapisanych zamówień.</p>";
            return;
        }

        savedOrders.forEach((order, index) => {
            const orderCard = document.createElement("div");
            orderCard.classList.add("order-card");

            let orderContent = `<h3>📝 Zamówienie #${index + 1}</h3><ul>`;
            let totalPrice = 0;

            order.items.forEach(item => {
                orderContent += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                totalPrice += item.price * item.quantity;
            });

            orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;

            if (order.note) {
                orderContent += `<p><strong>📝 Opis:</strong> ${order.note}</p>`;
            }

            orderCard.innerHTML = orderContent;

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-order-btn");
            removeButton.innerHTML = '<i class="fas fa-trash"></i> Usuń';
            removeButton.onclick = () => {
                savedOrders.splice(index, 1);
                localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
                updateSavedOrders();
            };

            orderCard.appendChild(removeButton);
            savedOrdersContainer.appendChild(orderCard);
        });
    };

    updateOrderSummary();
    updateSavedOrders();
});
