const listaUl = document.getElementById("listaPunktowUl");

// Wczytaj dane
let ministranci = JSON.parse(localStorage.getItem("ministranci")) || [];
let punkty = JSON.parse(localStorage.getItem("punkty")) || {};

const modalPunkty = document.getElementById("modalPunkty");
const zamknijModalPunkty = document.getElementById("zamknijModalPunkty");
const modalTekst = document.getElementById("modalTekst");
const iloscPunktowInput = document.getElementById("iloscPunktow");
const zatwierdzPunkty = document.getElementById("zatwierdzPunkty");

let aktualnyKey = null;
let tryb = null; // "plus" albo "minus"

function wyswietlListePunktow() {
  listaUl.innerHTML = "";

  // sortowanie po punktach malejąco
  ministranci.sort((a, b) => {
    const keyA = a.imie + " " + a.nazwisko;
    const keyB = b.imie + " " + b.nazwisko;
    return (punkty[keyB] || 0) - (punkty[keyA] || 0);
  });

  ministranci.forEach((osoba) => {
    const key = osoba.imie + " " + osoba.nazwisko;
    if (punkty[key] === undefined) punkty[key] = 0;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${key} - ${punkty[key]} pkt`;

    const btnDodaj = document.createElement("button");
    btnDodaj.textContent = "+";
    btnDodaj.classList.add("btnPlus");
    btnDodaj.addEventListener("click", () => {
      aktualnyKey = key;
      tryb = "plus";
      modalTekst.textContent = `Dodaj punkty dla ${key}:`;
      modalPunkty.style.display = "block";
    });

    const btnOdejmij = document.createElement("button");
    btnOdejmij.textContent = "-";
    btnOdejmij.classList.add("btnMinus");
    btnOdejmij.addEventListener("click", () => {
      aktualnyKey = key;
      tryb = "minus";
      modalTekst.textContent = `Odejmij punkty dla ${key}:`;
      modalPunkty.style.display = "block";
    });

    li.appendChild(span);
    li.appendChild(btnDodaj);
    li.appendChild(btnOdejmij);
    listaUl.appendChild(li);
  });
}

// zamykanie modala
zamknijModalPunkty.addEventListener("click", () => {
  modalPunkty.style.display = "none";
});

// kliknięcie poza modal zamyka
window.addEventListener("click", (e) => {
  if (e.target === modalPunkty) {
    modalPunkty.style.display = "none";
  }
});

// zatwierdzanie punktów
zatwierdzPunkty.addEventListener("click", () => {
  const ile = parseInt(iloscPunktowInput.value);
  if (!isNaN(ile) && aktualnyKey) {
    if (tryb === "plus") {
      punkty[aktualnyKey] += ile;
    } else if (tryb === "minus") {
      punkty[aktualnyKey] = Math.max(0, punkty[aktualnyKey] - ile);
    }
    localStorage.setItem("punkty", JSON.stringify(punkty));
    wyswietlListePunktow();
  }
  iloscPunktowInput.value = "";
  modalPunkty.style.display = "none";
});

async function pobierzTXT() {
    const { Document, Packer, Paragraph, TextRun } = window.docx;

    const doc = new Document();

    ministranci.forEach((osoba, index) => {
        const key = osoba.imie + " " + osoba.nazwisko;
        const punktyOsoby = punkty[key] || 0;
        doc.addSection({
            children: [
                new Paragraph({
                    children: [
                        new TextRun(`${index + 1}. ${key} - ${punktyOsoby} pkt`)
                    ]
                })
            ]
        });
    });

    const packer = new Packer();
    const blob = await packer.toBlob(doc);

    const teraz = new Date();
    const rok = teraz.getFullYear();
    const miesiac = String(teraz.getMonth() + 1).padStart(2, '0');
    const dzien = String(teraz.getDate()).padStart(2, '0');
    const godzina = String(teraz.getHours()).padStart(2, '0');
    const minuta = String(teraz.getMinutes()).padStart(2, '0');

    const nazwaPliku = `punktacja_${rok}-${miesiac}-${dzien}_${godzina}-${minuta}.docx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nazwaPliku;
    link.click();
}



// Podpinamy pod przycisk
document.getElementById("pobierzTXT").addEventListener("click", pobierzTXT);


// start
wyswietlListePunktow();


