// --- Zapis do pliku ---
document.getElementById("zapiszPlik").addEventListener("click", () => {
    const ministranci = JSON.parse(localStorage.getItem("ministranci")) || [];
    const punkty = JSON.parse(localStorage.getItem("punkty")) || {};
    const dyzury = JSON.parse(localStorage.getItem("dyzury")) || [];
    const wzoryPunktow = JSON.parse(localStorage.getItem("wzoryPunktow")) || [];
    const punktyDyzur = localStorage.getItem("punktyDyzur") || "2";

    const dane = {
        ministranci,
        punkty,
        dyzury,
        wzoryPunktow,
        punktyDyzur
    };

    const blob = new Blob([JSON.stringify(dane, null, 2)], { type: "application/json" });

    const teraz = new Date();
    const nazwaPliku = `liturgia_app_backup_${teraz.getFullYear()}-${String(teraz.getMonth() + 1).padStart(2, '0')}-${String(teraz.getDate()).padStart(2, '0')}_${String(teraz.getHours()).padStart(2, '0')}-${String(teraz.getMinutes()).padStart(2, '0')}.json`;

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

function pokazInfo(tekst) {
    tekstModalInfo.textContent = tekst;
    modalInfo.style.display = "block";
}

okModalInfo.addEventListener("click", () => { modalInfo.style.display = "none"; });

// --- Modal potwierdzenia ---
const modalPotwierdzenie = document.getElementById("modalPotwierdzenie");
const tekstPotwierdzenia = document.getElementById("tekstPotwierdzenia");
const zamknijPotwierdzenie = document.getElementById("zamknijPotwierdzenie");
const potwierdzAkcjeBtn = document.getElementById("potwierdzAkcjeBtn");
const anulujAkcjeBtn = document.getElementById("anulujAkcjeBtn");

let akcjaDoWykonania = null;

function pokazPotwierdzenie(tekst, akcja) {
    tekstPotwierdzenia.textContent = tekst;
    akcjaDoWykonania = akcja;
    modalPotwierdzenie.style.display = "block";
}

function zamknijModalPotwierdzenia() {
    modalPotwierdzenie.style.display = "none";
    akcjaDoWykonania = null;
}

zamknijPotwierdzenie.addEventListener("click", zamknijModalPotwierdzenia);
anulujAkcjeBtn.addEventListener("click", zamknijModalPotwierdzenia);

potwierdzAkcjeBtn.addEventListener("click", () => {
    if (typeof akcjaDoWykonania === "function") {
        akcjaDoWykonania();
    }
    zamknijModalPotwierdzenia();
});

// --- Obsługa otwierania i zamykania modali ---
importBtn.addEventListener("click", () => modalImport.style.display = "block");
zamknijImport.addEventListener("click", () => modalImport.style.display = "none");

window.addEventListener("click", (e) => {
    if (e.target === modalImport) modalImport.style.display = "none";
    if (e.target === modalInfo) modalInfo.style.display = "none";
    if (e.target === modalPotwierdzenie) zamknijModalPotwierdzenia();
});

// --- Zatwierdzenie importu ---
zatwierdzImport.addEventListener("click", () => {
    const plik = importPlik.files[0];
    if (!plik) {
        pokazInfo("Wybierz plik JSON!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const dane = JSON.parse(event.target.result);

            if (dane.ministranci) localStorage.setItem("ministranci", JSON.stringify(dane.ministranci));
            if (dane.punkty) localStorage.setItem("punkty", JSON.stringify(dane.punkty));
            if (dane.dyzury) localStorage.setItem("dyzury", JSON.stringify(dane.dyzury));

            if (dane.wzoryPunktow) {
                localStorage.setItem("wzoryPunktow", JSON.stringify(dane.wzoryPunktow));
                wzory = dane.wzoryPunktow;
                renderujListeWzorow();
            }

            if (dane.punktyDyzur !== undefined) {
                localStorage.setItem("punktyDyzur", dane.punktyDyzur);
                punktyDyzurInput.value = dane.punktyDyzur;
            }

            pokazInfo("Dane zostały zaimportowane!");
            modalImport.style.display = "none";
        } catch (err) {
            pokazInfo("Błąd: plik nie zawiera poprawnego JSONa!");
        }
    };
    reader.readAsText(plik);
});

// --- Punkty za dyżur ---
const punktyDyzurInput = document.getElementById("punktyDyzur");
const zapiszDyzurBtn = document.getElementById("zapiszDyzur");

const zapisaneDyzur = localStorage.getItem("punktyDyzur") || 2;
punktyDyzurInput.value = zapisaneDyzur;

zapiszDyzurBtn.addEventListener("click", () => {
    const ile = parseInt(punktyDyzurInput.value);
    if (!isNaN(ile) && ile >= 0) {
        localStorage.setItem("punktyDyzur", ile);
        pokazInfo(`Punkty za dyżur ustawione na ${ile}`);
    }
});

// --- Wzory punktów ---
const nazwaWzoruInput = document.getElementById("nazwaWzoru");
const punktyWzoruInput = document.getElementById("punktyWzoru");
const dodajWzorBtn = document.getElementById("dodajWzor");
const listaWzorowUl = document.getElementById("listaWzorow");

let wzory = JSON.parse(localStorage.getItem("wzoryPunktow")) || [];

function renderujListeWzorow() {
    listaWzorowUl.innerHTML = "";
    wzory.forEach((wzor, index) => {
        const li = document.createElement("li");
        li.textContent = `${wzor.nazwa} - ${wzor.punkty} pkt `;

        const btnUsun = document.createElement("button");
        btnUsun.textContent = "Usuń";
        btnUsun.classList.add("btnUsun");
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
    pokazInfo(`Dodano nowy wzór: ${nazwa} (${punkty} pkt)`);
});

renderujListeWzorow();

// --- ZARZĄDZANIE DANYMI (Reset punktów / Usuwanie ministrantów) ---
const resetPunktyBtn = document.getElementById("resetPunktyBtn");
const usunMinistrantowBtn = document.getElementById("usunMinistrantowBtn");

// Wyzerowanie/usunięcie punktów
resetPunktyBtn.addEventListener("click", () => {
    pokazPotwierdzenie("Czy na pewno chcesz usunąć wszystkim ministrantom punkty?", () => {
        localStorage.removeItem("punkty");
        pokazInfo("Usunięto punkty wszystkim ministrantom!");
    });
});

// Usuwanie całej listy ministrantów (razem z ich punktami)
usunMinistrantowBtn.addEventListener("click", () => {
    pokazPotwierdzenie("Czy na pewno chcesz usunąć WSZYSTKICH ministrantów z listy?", () => {
        localStorage.removeItem("ministranci");
        localStorage.removeItem("punkty");
        pokazInfo("Usunięto wszystkich ministrantów!");
    });
});