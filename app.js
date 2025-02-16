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

    const showCustomizationOptions = (item) => {
        document.querySelector(".custom-options")?.remove();

        const customOptions = document.createElement("div");
        customOptions.classList.add("custom-options");
        customOptions.style.position = "fixed";
        customOptions.style.top = "50%";
        customOptions.style.left = "50%";
        customOptions.style.transform = "translate(-50%, -50%)";
        customOptions.style.background = "#fff";
        customOptions.style.padding = "20px";
        customOptions.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
        customOptions.style.borderRadius = "8px";
        customOptions.style.zIndex = "1000";

        let optionsHTML = `<h3>Wybierz składniki do usunięcia:</h3>`;
        ingredients.forEach(ingredient => {
            optionsHTML += `<label><input type="checkbox" value="${ingredient}"> ${ingredient}</label><br>`;
        });
        optionsHTML += `
            <button id="add-custom-order">Dodaj do zamówienia</button>
            <button id="cancel-custom-order">Anuluj</button>
        `;

        customOptions.innerHTML = optionsHTML;
        document.body.appendChild(customOptions);

        document.getElementById("add-custom-order").onclick = () => addToOrderWithCustomization(item);
        document.getElementById("cancel-custom-order").onclick = () => customOptions.remove();
    };

    const addToOrderWithCustomization = (item) => {
        const selectedOptions = document.querySelectorAll(".custom-options input:checked");
        let removedIngredients = [];
        selectedOptions.forEach(option => removedIngredients.push(option.value));

        order.push({ name: item.name, price: item.price, quantity: 1, removedIngredients });
        document.querySelector(".custom-options").remove();
        updateOrderSummary();
    };

    const updateOrderSummary = () => {
        if (!orderList || !totalPriceElem) return;
        orderList.innerHTML = "";
        let totalPrice = 0;

        order.forEach((item, index) => {
            let removedText = item.removedIngredients?.length ? ` (Bez: ${item.removedIngredients.join(", ")})` : "";
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

    updateOrderSummary();

    if (burgerContainer) {
        console.log("Generowanie burgerów...");
        createItems(burgerContainer, menu.burgers);
    }
    if (friesContainer) {
        console.log("Generowanie frytek...");
        createItems(friesContainer, menu.fries);
    }
    if (sidesContainer) {
        console.log("Generowanie dodatków...");
        createItems(sidesContainer, menu.sides);
    }
});
