// Pobranie listy ministrantów i punktów
let ministranci = JSON.parse(localStorage.getItem("ministranci")) || [];
let punkty = JSON.parse(localStorage.getItem("punkty")) || {};

const listaUl = document.getElementById("listaMasowo");

// Modal do wpisania punktów
const modalPunkty = document.getElementById("modalPunkty");
const zamknijModalPunkty = document.getElementById("zamknijModalPunkty");
const modalTekst = document.getElementById("modalTekst");
const iloscPunktowInput = document.getElementById("iloscPunktowModal");
const zatwierdzPunktyModal = document.getElementById("zatwierdzPunktyModal");

// Modal potwierdzenia
const modalPotwierdzenie = document.getElementById("modalPotwierdzenie");
const zamknijPotwierdzenie = document.getElementById("zamknijPotwierdzenie");
const okPotwierdzenie = document.getElementById("okPotwierdzenie");

let zaznaczeniIndexes = [];

// Wyświetlenie listy ministrantów z checkboxami i punktami
function wyswietlListeMasowo() {
    listaUl.innerHTML = "";
    ministranci.forEach((osoba, index) => {
        const li = document.createElement("li");
        const key = osoba.imie + " " + osoba.nazwisko;
        if(punkty[key] === undefined) punkty[key] = 0;
        li.innerHTML = `<label><input type="checkbox" value="${index}"> ${key} - ${punkty[key]} pkt</label>`;
        listaUl.appendChild(li);
    });
}

wyswietlListeMasowo();

// Kliknięcie przycisku dodania punktów wybranym
document.getElementById("zatwierdzMasowo").addEventListener("click", () => {
    zaznaczeniIndexes = Array.from(document.querySelectorAll('#listaMasowo input:checked'))
                              .map(cb => parseInt(cb.value));
    if(zaznaczeniIndexes.length === 0){
        return;
    }
    iloscPunktowInput.value = "";
    modalTekst.textContent = `Dodaj punkty dla zaznaczonych ministrantów:`;
    modalPunkty.style.display = "block";
});

// Zatwierdzenie liczby punktów w modal
zatwierdzPunktyModal.addEventListener("click", () => {
    const ile = parseInt(iloscPunktowInput.value);
    if(isNaN(ile)){

        return;
    }

    zaznaczeniIndexes.forEach(i => {
        const key = ministranci[i].imie + " " + ministranci[i].nazwisko;
        if(!punkty[key]) punkty[key] = 0;
        punkty[key] += ile;
    });

    localStorage.setItem("punkty", JSON.stringify(punkty));

    // Odznaczenie checkboxów
    document.querySelectorAll('#listaMasowo input[type="checkbox"]').forEach(cb => cb.checked = false);

    modalPunkty.style.display = "none";
    modalPotwierdzenie.style.display = "block";

    // Odśwież listę z punktami
    wyswietlListeMasowo();
});

// Zamknięcie modali
zamknijModalPunkty.addEventListener("click", () => { modalPunkty.style.display = "none"; });
zamknijPotwierdzenie.addEventListener("click", () => { modalPotwierdzenie.style.display = "none"; });
okPotwierdzenie.addEventListener("click", () => { modalPotwierdzenie.style.display = "none"; });

window.addEventListener("click", (e) => {
    if(e.target == modalPunkty) modalPunkty.style.display = "none";
    if(e.target == modalPotwierdzenie) modalPotwierdzenie.style.display = "none";
});
