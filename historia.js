document.addEventListener("DOMContentLoaded", () => {
    const datePicker = document.getElementById("date-picker");
    const historyOrdersContainer = document.getElementById("history-orders-container");

    datePicker.addEventListener("change", () => {
        const selectedDate = datePicker.value;
        const historyOrders = JSON.parse(localStorage.getItem("historyOrders")) || {};

        historyOrdersContainer.innerHTML = "";

        if (historyOrders[selectedDate]) {
            historyOrders[selectedDate].forEach((order, index) => {
                const orderCard = document.createElement("div");
                orderCard.classList.add("order-card");

                let orderContent = `<h3>📝 Zamówienie #${index + 1}</h3><ul>`;
                let totalPrice = 0;

                order.items.forEach(item => {
                    let removedText = item.removedIngredients?.length ? ` (Bez: ${item.removedIngredients.join(", ")})` : "";
                    orderContent += `<li>${item.name}${removedText} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                    totalPrice += item.price * item.quantity;
                });

                orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;

                if (order.note) {
                    orderContent += `<p><strong>Notatka:</strong> ${order.note}</p>`;
                }

                orderCard.innerHTML = orderContent;

                // Przycisk usuwania zamówienia
                const removeButton = document.createElement("button");
                removeButton.classList.add("remove-order-btn");
                removeButton.innerHTML = "🗑 Usuń zamówienie";
                removeButton.onclick = () => {
                    historyOrders[selectedDate].splice(index, 1);
                    if (historyOrders[selectedDate].length === 0) delete historyOrders[selectedDate];
                    localStorage.setItem("historyOrders", JSON.stringify(historyOrders));
                    datePicker.dispatchEvent(new Event("change"));
                };

                orderCard.appendChild(removeButton);
                historyOrdersContainer.appendChild(orderCard);
            });
        } else {
            historyOrdersContainer.innerHTML = "<p>Brak zamówień tego dnia.</p>";
        }
    });

    // Automatycznie załaduj dzisiejsze zamówienia
    const today = new Date().toISOString().split("T")[0];
    datePicker.value = today;
    datePicker.dispatchEvent(new Event("change"));
});
