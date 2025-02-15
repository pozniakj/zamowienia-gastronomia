document.addEventListener("DOMContentLoaded", () => {
    const savedOrdersContainer = document.getElementById("saved-orders-container");
    const orderList = document.getElementById("order-list");
    const totalPriceElem = document.getElementById("total-price");
    const saveOrderButton = document.getElementById("save-order");
    const orderNoteInput = document.getElementById("order-note");

    let order = JSON.parse(localStorage.getItem("currentOrder")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

    // 🔥 Upewnij się, że zamówienie pobiera się poprawnie
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

    // ✅ Zapisuje zamówienie i notatkę
    saveOrderButton?.addEventListener("click", () => {
        if (!order || order.length === 0) {
            alert("Nie można zapisać pustego zamówienia!");
            return;
        }

        const orderNote = orderNoteInput.value.trim();

        // Dodanie zamówienia do listy zapisanych zamówień
        savedOrders.push({ items: [...order], note: orderNote });
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));

        // Zapis do historii zamówień według daty
        const today = new Date().toISOString().split("T")[0]; 
        let historyOrders = JSON.parse(localStorage.getItem("historyOrders")) || {};

        if (!historyOrders[today]) {
            historyOrders[today] = [];
        }

        historyOrders[today].push({ items: [...order], note: orderNote });
        localStorage.setItem("historyOrders", JSON.stringify(historyOrders));

        // ✅ Resetowanie zamówienia po zapisaniu
        order = [];
        localStorage.setItem("currentOrder", JSON.stringify(order));
        orderNoteInput.value = "";
        updateSavedOrders();
        updateOrderSummary();
    });

    // ✅ Aktualizacja zapisanych zamówień
    const updateSavedOrders = () => {
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
            if (orderData.note) {
                orderContent += `<p class="note"><strong>Notatka:</strong> ${orderData.note}</p>`;
            }
            orderCard.innerHTML = orderContent;

            // ✅ Dodanie przycisku usuwania zamówienia
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
