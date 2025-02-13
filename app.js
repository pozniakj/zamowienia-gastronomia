document.addEventListener("DOMContentLoaded", () => {
    const savedOrdersContainer = document.getElementById("saved-orders-container");
    const saveOrderButton = document.getElementById("save-order-main");
    let order = JSON.parse(localStorage.getItem("order")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

    const updateSavedOrders = () => {
        savedOrdersContainer.innerHTML = "";

        savedOrders.forEach((order, index) => {
            const orderCard = document.createElement("div");
            orderCard.classList.add("order-card");

            let orderContent = "<h3>📝 Zamówienie #" + (index + 1) + "</h3><ul>";
            let totalPrice = 0;

            order.forEach(item => {
                orderContent += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                totalPrice += item.price * item.quantity;
            });

            orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;
            orderCard.innerHTML = orderContent;

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-order-btn");
            removeButton.textContent = "🗑 Usuń zamówienie";
            removeButton.onclick = () => {
                savedOrders.splice(index, 1);
                localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
                updateSavedOrders();
            };

            orderCard.appendChild(removeButton);
            savedOrdersContainer.appendChild(orderCard);
        });
    };

    saveOrderButton.addEventListener("click", () => {
        if (order.length === 0) {
            alert("Nie można zapisać pustego zamówienia!");
            return;
        }

        savedOrders.push(order);
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));

        order = [];
        localStorage.setItem("order", JSON.stringify(order));
        updateSavedOrders();
    });

    updateSavedOrders();
});
