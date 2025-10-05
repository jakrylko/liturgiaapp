// --- Zapis do pliku ---
document.getElementById("zapiszPlik").addEventListener("click", () => {
    const ministranci = JSON.parse(localStorage.getItem("ministranci")) || [];
    const punkty = JSON.parse(localStorage.getItem("punkty")) || {};
    const dyzury = JSON.parse(localStorage.getItem("dyzury")) || [];
    const dane = {ministranci, punkty, dyzury};

    const blob = new Blob([JSON.stringify(dane, null, 2)], {type: "application/json"});

    const teraz = new Date();
    const nazwaPliku = `liturgia_app_backup_${teraz.getFullYear()}-${String(teraz.getMonth()+1).padStart(2,'0')}-${String(teraz.getDate()).padStart(2,'0')}_${String(teraz.getHours()).padStart(2,'0')}-${String(teraz.getMinutes()).padStart(2,'0')}.json`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nazwaPliku;
    link.click();
});

// --- Import z pliku ---
const modalImport = document.getElementById("modalImport");
const importBtn = document.getElementById("importPlikBtn");
const zamknijImport = document.getElementById("zamknijImport");
const importPlik = document.getElementById("importPlik");
const zatwierdzImport = document.getElementById("zatwierdzImport");

// --- Modal informacyjny ---
const modalInfo = document.getElementById("modalInfo");
const tekstModalInfo = document.getElementById("tekstModalInfo");
const okModalInfo = document.getElementById("okModalInfo");

// Funkcja do wyświetlania modala
function pokazInfo(tekst) {
    tekstModalInfo.textContent = tekst;
    modalInfo.style.display = "block";
}

// Zamknięcie modala
okModalInfo.addEventListener("click", () => { modalInfo.style.display = "none"; });

// --- Obsługa otwierania i zamykania modali ---
importBtn.addEventListener("click", () => modalImport.style.display = "block");
zamknijImport.addEventListener("click", () => modalImport.style.display = "none");

window.addEventListener("click", (e) => {
    if(e.target === modalImport) modalImport.style.display = "none";
    if(e.target === modalInfo) modalInfo.style.display = "none";
});

// --- Zatwierdzenie importu ---
zatwierdzImport.addEventListener("click", () => {
    const plik = importPlik.files[0];
    if(!plik){
        pokazInfo("Wybierz plik JSON!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const dane = JSON.parse(event.target.result);
            if(dane.ministranci) localStorage.setItem("ministranci", JSON.stringify(dane.ministranci));
            if(dane.punkty) localStorage.setItem("punkty", JSON.stringify(dane.punkty));
            if(dane.dyzury) localStorage.setItem("dyzury", JSON.stringify(dane.dyzury));
            pokazInfo("Dane zostały zaimportowane!");
            modalImport.style.display = "none";
        } catch(err) {
            pokazInfo("Błąd: plik nie zawiera poprawnego JSONa!");
        }
    };
    reader.readAsText(plik);
});

// --- Punkty za dyżur ---
const punktyDyzurInput = document.getElementById("punktyDyzur");
const zapiszDyzurBtn = document.getElementById("zapiszDyzur");

// Wczytanie poprzedniej wartości
const zapisaneDyzur = localStorage.getItem("punktyDyzur") || 2; // domyślnie 2
punktyDyzurInput.value = zapisaneDyzur;

zapiszDyzurBtn.addEventListener("click", () => {
    const ile = parseInt(punktyDyzurInput.value);
    if(!isNaN(ile) && ile >= 0){
        localStorage.setItem("punktyDyzur", ile);
        pokazInfo(`Punkty za dyżur ustawione na ${ile}`);
    }
});

// --- Wzory punktów ---
const nazwaWzoruInput = document.getElementById("nazwaWzoru");
const punktyWzoruInput = document.getElementById("punktyWzoru");
const dodajWzorBtn = document.getElementById("dodajWzor");
const listaWzorowUl = document.getElementById("listaWzorow");

// Wczytanie zapisanych wzorów
let wzory = JSON.parse(localStorage.getItem("wzoryPunktow")) || [];

// Funkcja odświeżenia listy w HTML z przyciskiem usuń
function renderujListeWzorow() {
    listaWzorowUl.innerHTML = "";
    wzory.forEach((wzor, index) => {
        const li = document.createElement("li");
        li.textContent = `${wzor.nazwa} - ${wzor.punkty} pkt `;

        // Przycisk usuń
        const btnUsun = document.createElement("button");
        btnUsun.textContent = "Usuń";
        btnUsun.style.marginLeft = "10px";
        btnUsun.addEventListener("click", () => {
            wzory.splice(index, 1);
            localStorage.setItem("wzoryPunktow", JSON.stringify(wzory));
            renderujListeWzorow();
        });

        li.appendChild(btnUsun);
        listaWzorowUl.appendChild(li);
    });
}

// Dodawanie nowego wzoru
dodajWzorBtn.addEventListener("click", () => {
    const nazwa = nazwaWzoruInput.value.trim();
    const punkty = parseInt(punktyWzoruInput.value);

    if (!nazwa || isNaN(punkty)) {
        pokazInfo("Błąd: podaj nazwę i liczbę punktów!");
        return;
    }

    wzory.push({ nazwa, punkty });
    localStorage.setItem("wzoryPunktow", JSON.stringify(wzory));

    nazwaWzoruInput.value = "";
    punktyWzoruInput.value = "";

    renderujListeWzorow();

    // Pokaż modal informacyjny
    pokazInfo(`Dodano nowy wzór: ${nazwa} (${punkty} pkt)`);
});

// Wywołanie przy starcie
renderujListeWzorow();



