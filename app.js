document.addEventListener("DOMContentLoaded", () => {
    console.log("🔄 Skrypt załadowany poprawnie."); // Debugowanie

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
        console.error("❌ Błąd: Nie znaleziono kontenerów produktów. Sprawdź HTML!");
        return;
    } else {
        console.log("✅ Kontenery produktów znalezione.");
    }

    let order = JSON.parse(localStorage.getItem("currentOrder")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

    const menu = {
        burgers: [
            { name: "Classic", price: 28 },
            { name: "BBQ", price: 32 },
            { name: "Oklahoma", price: 28 }
        ],
        fries: [
            { name: "Małe", price: 7 },
            { name: "Duże", price: 10 }
        ],
        sides: [
            { name: "Dodatkowe Mięso", price: 12 },
            { name: "Składnik 2zł", price: 2 }
        ]
    };

    const createItems = (container, items) => {
        if (!container) {
            console.error("❌ Błąd: Kontener na produkty nie istnieje.");
            return;
        }
        container.innerHTML = "";
        items.forEach(item => {
            const button = document.createElement("button");
            button.classList.add("product-button");
            button.textContent = `${item.name} - ${item.price} PLN`;
            button.onclick = () => addToOrder(item);
            container.appendChild(button);
        });

        console.log(`✅ Produkty dodane do ${container.id}`);
    };

    const addToOrder = (item) => {
        order.push({ ...item, quantity: 1 });
        updateOrderSummary();
    };

    const updateOrderSummary = () => {
        if (!orderList || !totalPriceElem) return;
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

    window.removeFromOrder = (index) => {
        order.splice(index, 1);
        updateOrderSummary();
    };

    window.showOrders = () => {
        console.log("✅ Kliknięto 'Pokaż zapisane zamówienia'.");
        ordersSection.style.display = "block";
        updateSavedOrders();
    };

    const updateSavedOrders = () => {
        if (!savedOrdersContainer) {
            console.error("❌ Błąd: Nie znaleziono #saved-orders-container w HTML!");
            return;
        }
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

            let orderContent = `<h3>📝 Zamówienie #${index + 1}</h3><ul>`;
            let totalPrice = 0;

            orderData.items.forEach(item => {
                orderContent += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity} PLN</li>`;
                totalPrice += item.price * item.quantity;
            });

            orderContent += `</ul><p><strong>Łączna cena:</strong> ${totalPrice} PLN</p>`;

            if (orderData.note) {
                orderContent += `<p><strong>Notatka:</strong> ${orderData.note}</p>`;
            }

            orderCard.innerHTML = orderContent;
            savedOrdersContainer.appendChild(orderCard);
        });
    };

    updateSavedOrders();

    if (burgerContainer) createItems(burgerContainer, menu.burgers);
    if (friesContainer) createItems(friesContainer, menu.fries);
    if (sidesContainer) createItems(sidesContainer, menu.sides);

    updateOrderSummary();
});
