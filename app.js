document.addEventListener("DOMContentLoaded", () => {
    const savedOrdersContainer = document.getElementById("saved-orders-container");
    const ordersSection = document.getElementById("orders-section");
    const orderList = document.getElementById("order-list");
    const totalPriceElem = document.getElementById("total-price");
    const saveOrderButton = document.getElementById("save-order");
    const burgerContainer = document.getElementById("burger-items");
    const friesContainer = document.getElementById("fries-items");
    const sidesContainer = document.getElementById("sides-items");
    const orderNoteInput = document.getElementById("order-note");

    if (!burgerContainer && !friesContainer && !sidesContainer) {
        console.error("Błąd: Nie znaleziono kontenerów produktów. Sprawdź HTML.");
        return;
    }

    let order = JSON.parse(localStorage.getItem("currentOrder")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];
    let historyOrders = JSON.parse(localStorage.getItem("historyOrders")) || {};

    const menu = {
        burgers: [
            { name: "Classic", price: 28 },
            { name: "BBQ", price: 32 },
            { name: "Oklahoma", price: 28 },
            { name: "Chipotle", price: 30 },
            { name: "Truffla", price: 30 },
            { name: "Piekielny", price: 32 },
            { name: "KimCheese", price: 32 },
            { name: "Bydlak", price: 35 }
        ],
        fries: [
            { name: "Małe", price: 7 },
            { name: "Duże", price: 10 }
        ],
        sides: [
            { name: "Dodatkowe Mięso", price: 12 },
            { name: "Składnik 2zł", price: 2 },
            { name: "Składnik 4zł", price: 4 }
        ]
    };

    const ingredients = ["Sałata", "Cebula", "Sos", "Ogórek"];

    const showCustomizationOptions = (item) => {
        const customOptions = prompt(`Wybierz składniki do usunięcia (oddziel przecinkiem) lub zostaw puste, aby nie usuwać: ${ingredients.join(", ")}`);
        let removedIngredients = customOptions ? customOptions.split(",").map(i => i.trim()).filter(i => i !== "") : [];
        addToOrder(item, removedIngredients);
    };

    const createItems = (container, items) => {
        if (!container) return;
        container.innerHTML = "";
        items.forEach(item => {
            const button = document.createElement("button");
            button.classList.add("product-button");
            button.textContent = `${item.name} - ${item.price} PLN`;
            button.onclick = () => showCustomizationOptions(item);
            container.appendChild(button);
        });
    };

    const addToOrder = (item, removedIngredients = []) => {
        order.push({ ...item, quantity: 1, removedIngredients });
        updateOrderSummary();
    };

    const updateOrderSummary = () => {
        if (!orderList || !totalPriceElem) return;
        orderList.innerHTML = "";
        let totalPrice = 0;

        order.forEach((item, index) => {
            let removedText = item.removedIngredients.length ? ` (Bez: ${item.removedIngredients.join(", ")})` : " (Bez zmian)";
            const listItem = document.createElement("li");
            listItem.innerHTML = `${item.name}${removedText} x${item.quantity} - ${item.price * item.quantity} PLN 
                <button class="remove-btn" onclick="removeFromOrder(${index})">🗑</button>`;
            orderList.appendChild(listItem);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElem.textContent = `Cena całkowita: ${totalPrice} PLN`;
        localStorage.setItem("currentOrder", JSON.stringify(order));
    };

    window.removeFromOrder = (index) => {
        order.splice(index, 1);
        updateOrderSummary();
    };

    saveOrderButton?.addEventListener("click", () => {
        if (order.length === 0) {
            alert("Nie można zapisać pustego zamówienia!");
            return;
        }

        const orderNote = orderNoteInput?.value.trim() || ""; 

        const orderData = {
            items: [...order],
            note: orderNote,
            timestamp: new Date().toLocaleString()
        };

        savedOrders.push(orderData);
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));

        order = [];
        localStorage.setItem("currentOrder", JSON.stringify(order));
        updateOrderSummary();
        updateSavedOrders();

        orderNoteInput.value = ""; 
    });

    const updateSavedOrders = () => {
        savedOrdersContainer.innerHTML = "";

        let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

        if (!Array.isArray(savedOrders)) savedOrders = [];  

        if (savedOrders.length === 0) {
            savedOrdersContainer.innerHTML = "<p>Brak zapisanych zamówień.</p>";
            return;
        }

        savedOrders.forEach((orderData, index) => {
            const orderCard = document.createElement("div");
            orderCard.classList.add("order-card");

            let orderContent = `<h3>📝 Zamówienie #${index + 1} (${orderData.timestamp})</h3><ul>`;
            let totalPrice = 0;

            orderData.items.forEach(item => {
                let removedText = item.removedIngredients?.length ? ` (Bez: ${item.removedIngredients.join(", ")})` : " (Bez zmian)";
                orderContent += `<li>${item.name}${removedText} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                totalPrice += item.price * item.quantity;
            });

            orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;

            if (orderData.note) {
                orderContent += `<p><strong>Notatka:</strong> ${orderData.note}</p>`;
            }

            orderCard.innerHTML = orderContent;

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-order-btn");
            removeButton.textContent = "🗑 Usuń";
            removeButton.onclick = () => {
                savedOrders.splice(index, 1);
                localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
                updateSavedOrders();
            };

            orderCard.appendChild(removeButton);
            savedOrdersContainer.appendChild(orderCard);
        });
    };

    updateSavedOrders();

    if (burgerContainer) createItems(burgerContainer, menu.burgers);
    if (friesContainer) createItems(friesContainer, menu.fries);
    if (sidesContainer) createItems(sidesContainer, menu.sides);
});
