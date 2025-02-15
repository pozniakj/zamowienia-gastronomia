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

                order.forEach(item => {
                    orderContent += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                    totalPrice += item.price * item.quantity;
                });

                orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;
                orderCard.innerHTML = orderContent;

                historyOrdersContainer.appendChild(orderCard);
            });
        } else {
            historyOrdersContainer.innerHTML = "<p>Brak zamówień tego dnia.</p>";
        }
    });
});
