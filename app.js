document.addEventListener("DOMContentLoaded", () => {
    const orderList = document.getElementById("order-list");
    const totalPriceElem = document.getElementById("total-price");
    const saveOrderButton = document.getElementById("save-order");
    const savedOrdersContainer = document.getElementById("saved-orders-container");

    let order = JSON.parse(localStorage.getItem("currentOrder")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

    function updateOrderSummary() {
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
    }

    window.addToOrder = (name, price) => {
        let existingItem = order.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            order.push({ name, price, quantity: 1 });
        }

        updateOrderSummary();
    };

    window.removeFromOrder = (index) => {
        order.splice(index, 1);
        updateOrderSummary();
    };

    saveOrderButton?.addEventListener("click", () => {
        if (!order || order.length === 0) {
            alert("Nie można zapisać pustego zamówienia!");
            return;
        }

        savedOrders.push({ items: [...order] });
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));

        order = [];
        updateSavedOrders();
        updateOrderSummary();
    });

    function updateSavedOrders() {
        if (!savedOrdersContainer) return;

        savedOrdersContainer.innerHTML = "";

        if (savedOrders.length === 0) {
            savedOrdersContainer.innerHTML = "<p>Brak zapisanych zamówień.</p>";
            return;
        }

        savedOrders.forEach((orderData, index) => {
            const orderCard = document.createElement("div");
            orderCard.classList.add("order-card");

            let orderContent = `<h3>📝 Zamówienie #${index + 1}</h3><ul>`;
            let totalPrice = 0;

            orderData.items.forEach(item => {
                orderContent += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                totalPrice += item.price * item.quantity;
            });

            orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;
            orderCard.innerHTML = orderContent;

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-order-btn");
            removeButton.innerHTML = 'Usuń';
            removeButton.onclick = () => {
                savedOrders.splice(index, 1);
                localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
                updateSavedOrders();
            };

            orderCard.appendChild(removeButton);
            savedOrdersContainer.appendChild(orderCard);
        });
    }

    updateOrderSummary();
    updateSavedOrders();
});
