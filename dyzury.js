// ===== Dyżury.js =====

// Pobranie elementów modala
const btnDodajDyzur = document.getElementById("dodajDyzur");
const modalDyzur = document.getElementById("modalDodajDyzur");
const zamknijModalDyzur = modalDyzur.querySelector(".zamknij");
const selectMinistrant = document.getElementById("wybierzMinistranta");
const btnZapiszDyzur = document.getElementById("zapiszDyzur");

// Modal usuwania dyżuru
const modalUsun = document.getElementById("modalUsun");
const potwierdzUsun = document.getElementById("potwierdzUsun");
const anulujUsun = document.getElementById("anulujUsun");

// Modal potwierdzenia przydzielenia punktów
const modalPotwierdz = document.getElementById("modalPotwierdz");
const btnTak = document.getElementById("potwierdzTak");
const btnNie = document.getElementById("potwierdzNie");

let indexDoUsuniecia = null;

// Punkty i dyżury
let ministranci = JSON.parse(localStorage.getItem("ministranci")) || [];
let punkty = JSON.parse(localStorage.getItem("punkty")) || {};
let dyzury = JSON.parse(localStorage.getItem("dyzury")) || []; // przechowujemy dyżury

// --- Funkcje ---
function aktualizujSelectMinistrantow() {
    selectMinistrant.innerHTML = "";
    ministranci.forEach(osoba => {
        const option = document.createElement("option");
        option.value = `${osoba.imie} ${osoba.nazwisko}`;
        option.textContent = `${osoba.imie} ${osoba.nazwisko}`;
        selectMinistrant.appendChild(option);
    });
}

// Renderowanie dyżurów z localStorage
function renderujDyzury() {
    const tabela = document.getElementById("tabelaDyzury");
    const dni = ["Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

    // Czyścimy tabelę
    tabela.querySelectorAll("tbody tr").forEach(row => {
        for(let i=1;i<=6;i++) row.cells[i].innerHTML = "";
    });

    dyzury.forEach(d => {
        const row = Array.from(tabela.querySelectorAll("tbody tr"))
                         .find(r => r.cells[0].textContent === d.godzina);
        if(!row) return;

        const colIndex = dni.indexOf(d.dzien) + 1;
        let cell = row.cells[colIndex];

        let container = cell.querySelector(".dyzur-lista");
        if(!container){
            container = document.createElement("div");
            container.classList.add("dyzur-lista");
            cell.appendChild(container);
        }

        const div = document.createElement("div");
        div.classList.add("dyzur");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("obecnoscCheckbox");
        checkbox.style.marginRight = "5px";

        const span = document.createElement("span");
        span.textContent = d.ministrant;
        span.style.marginRight = "5px";

        const btnUsun = document.createElement("button");
        btnUsun.textContent = "Usuń";
        btnUsun.classList.add("btnUsunDyzur"); // styl w CSS
        btnUsun.addEventListener("click", () => {
            indexDoUsuniecia = d;
            modalUsun.style.display = "block";
        });

        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(btnUsun);
        container.appendChild(div);
    });
}

// --- Obsługa modali ---
btnDodajDyzur.addEventListener("click", () => {
    aktualizujSelectMinistrantow();
    modalDyzur.style.display = "block";
});

zamknijModalDyzur.addEventListener("click", () => modalDyzur.style.display = "none");

window.addEventListener("click", e => {
    if(e.target == modalDyzur) modalDyzur.style.display = "none";
    if(e.target == modalUsun) modalUsun.style.display = "none";
    if(e.target == modalPotwierdz) modalPotwierdz.style.display = "none";
});

// --- Dodawanie dyżuru ---
btnZapiszDyzur.addEventListener("click", () => {
    const ministrant = selectMinistrant.value;
    const dzien = document.getElementById("dzien").value;
    const godzina = document.getElementById("godzina").value;

    dyzury.push({ministrant, dzien, godzina});
    localStorage.setItem("dyzury", JSON.stringify(dyzury));

    renderujDyzury();
    modalDyzur.style.display = "none";
});

// --- Usuwanie dyżuru ---
potwierdzUsun.addEventListener("click", () => {
    if(indexDoUsuniecia){
        dyzury = dyzury.filter(d => d !== indexDoUsuniecia);
        localStorage.setItem("dyzury", JSON.stringify(dyzury));
        renderujDyzury();
        indexDoUsuniecia = null;
        modalUsun.style.display = "none";
    }
});

anulujUsun.addEventListener("click", () => {
    indexDoUsuniecia = null;
    modalUsun.style.display = "none";
});

// --- Zatwierdzanie obecności z potwierdzeniem ---
document.getElementById("zatwierdzObecnosc").addEventListener("click", () => {
    modalPotwierdz.style.display = "block";
});

btnTak.addEventListener("click", () => {
    const wszystkieDyzury = document.querySelectorAll(".dyzur-lista .dyzur");
    wszystkieDyzury.forEach(div => {
        const checkbox = div.querySelector(".obecnoscCheckbox");
        const span = div.querySelector("span");
        if(checkbox && checkbox.checked && span){
            const nazwisko = span.textContent;
            if(!punkty[nazwisko]) punkty[nazwisko] = 0;
            punkty[nazwisko] += 2;
            checkbox.checked = false;
        }
    });

    localStorage.setItem("punkty", JSON.stringify(punkty));
    modalPotwierdz.style.display = "none";
});

btnNie.addEventListener("click", () => modalPotwierdz.style.display = "none");

// --- Start ---
renderujDyzury();
