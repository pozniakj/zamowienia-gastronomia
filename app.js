document.addEventListener("DOMContentLoaded", () => {
    const savedOrdersContainer = document.getElementById("saved-orders-container");
    const ordersSection = document.getElementById("orders-section");
    const orderList = document.getElementById("order-list");
    const totalPriceElem = document.getElementById("total-price");
    const saveOrderButton = document.getElementById("save-order");
    const burgerContainer = document.getElementById("burger-items");
    const friesContainer = document.getElementById("fries-items");
    const sidesContainer = document.getElementById("sides-items");

    let order = JSON.parse(localStorage.getItem("currentOrder")) || [];
    let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

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

    // Funkcja generująca produkty w kategoriach
    const createItems = (container, items) => {
        if (!container) return;
        container.innerHTML = "";
        items.forEach(item => {
            const button = document.createElement("button");
            button.classList.add("menu-item");
            button.textContent = `${item.name} - ${item.price} PLN +`;
            button.onclick = () => addToOrder(item);
            container.appendChild(button);
        });
    };

    // Dodawanie produktów do zamówienia
    const addToOrder = (item) => {
        const existingItem = order.find(o => o.name === item.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            order.push({ ...item, quantity: 1 });
        }
        updateOrderSummary();
    };

    // Usuwanie pojedynczego produktu z zamówienia
    window.removeFromOrder = (index) => {
        order.splice(index, 1);
        updateOrderSummary();
    };

    // Aktualizacja podsumowania zamówienia
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

    // Zapisywanie zamówienia i resetowanie
    saveOrderButton?.addEventListener("click", () => {
        if (order.length === 0) {
            alert("Nie można zapisać pustego zamówienia!");
            return;
        }

        savedOrders.push(order);
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));

        order = [];
        localStorage.setItem("currentOrder", JSON.stringify(order));
        updateOrderSummary();
        updateSavedOrders();
    });

    // Wyświetlanie zapisanych zamówień po kliknięciu w menu
    window.showOrders = () => {
        ordersSection.style.display = "block";
        updateSavedOrders();
    };

    // Aktualizacja sekcji zapisanych zamówień
    const updateSavedOrders = () => {
        savedOrdersContainer.innerHTML = "";

        savedOrders.forEach((order, index) => {
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

    // Inicjalizacja produktów w odpowiednich kategoriach
    if (burgerContainer) {
        createItems(burgerContainer, menu.burgers);
    } else if (friesContainer) {
        createItems(friesContainer, menu.fries);
    } else if (sidesContainer) {
        createItems(sidesContainer, menu.sides);
    }

    updateOrderSummary();
    updateSavedOrders();
});

