document.addEventListener("DOMContentLoaded", () => {
    const zamowienieDiv = document.getElementById("zamowienie");
    const sumaCenaSpan = document.getElementById("suma-cena");
    const przyciskiDodaj = document.querySelectorAll(".dodaj-do-zamowienia");
    
    let zamowienie = JSON.parse(localStorage.getItem("zamowienie")) || [];

    function aktualizujZamowienie() {
        zamowienieDiv.innerHTML = "";
        let suma = 0;
        
        zamowienie.forEach((pozycja, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.textContent = `${pozycja.nazwa} - ${pozycja.cena} zł (x${pozycja.ilosc})`;
            
            const usunBtn = document.createElement("button");
            usunBtn.textContent = "❌";
            usunBtn.onclick = () => {
                zamowienie.splice(index, 1);
                localStorage.setItem("zamowienie", JSON.stringify(zamowienie));
                aktualizujZamowienie();
            };
            
            itemDiv.appendChild(usunBtn);
            zamowienieDiv.appendChild(itemDiv);
            suma += pozycja.cena * pozycja.ilosc;
        });

        sumaCenaSpan.textContent = `${suma} zł`;
        localStorage.setItem("zamowienie", JSON.stringify(zamowienie));
    }

    przyciskiDodaj.forEach(przycisk => {
        przycisk.addEventListener("click", () => {
            const nazwa = przycisk.dataset.nazwa;
            const cena = parseFloat(przycisk.dataset.cena);
            
            const istniejącaPozycja = zamowienie.find(item => item.nazwa === nazwa);
            if (istniejącaPozycja) {
                istniejącaPozycja.ilosc++;
            } else {
                zamowienie.push({ nazwa, cena, ilosc: 1 });
            }

            aktualizujZamowienie();
        });
    });

    aktualizujZamowienie();
});
