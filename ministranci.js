const lista = document.getElementById("lista");
const otworzModalBtn = document.getElementById("otworzModal");
const modal = document.getElementById("modal");
const zamknij = document.getElementById("zamknij");
const zatwierdz = document.getElementById("zatwierdz");
const imieInput = document.getElementById("imie");
const nazwiskoInput = document.getElementById("nazwisko");

// Modal usuwania
const modalUsun = document.getElementById("modalUsun");
const zamknijUsun = document.getElementById("zamknijUsun");
const potwierdzUsun = document.getElementById("potwierdzUsun");
const anulujUsun = document.getElementById("anulujUsun");

let ministranci = JSON.parse(localStorage.getItem("ministranci")) || [];
let indexDoUsuniecia = null;

// Funkcja wyświetlania listy z numeracją i przyciskiem usuń
function wyswietlListe() {
    // Sortowanie alfabetyczne po nazwisku
    ministranci.sort((a,b) => a.nazwisko.localeCompare(b.nazwisko));

    lista.innerHTML = "";
    ministranci.forEach((osoba, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${osoba.imie} ${osoba.nazwisko}</span>`;
        
        // Przyciski usuń
        
// Przyciski usuń
const btnUsun = document.createElement("button");
btnUsun.textContent = "Usuń";

// dodaj klasę zgodną z CSS
btnUsun.classList.add("btnUsun"); // <-- uwaga na wielkość liter!

btnUsun.addEventListener("click", () => {
    indexDoUsuniecia = index;
    modalUsun.style.display = "block";
});

li.appendChild(btnUsun);
lista.appendChild(li);

    });
}

// Dodawanie nowego ministranta
otworzModalBtn.addEventListener("click", () => { modal.style.display = "block"; });
zamknij.addEventListener("click", () => { modal.style.display = "none"; });

zatwierdz.addEventListener("click", () => {
    const imie = imieInput.value.trim();
    const nazwisko = nazwiskoInput.value.trim();
    if(imie && nazwisko){
        ministranci.push({imie, nazwisko});
        localStorage.setItem("ministranci", JSON.stringify(ministranci));
        imieInput.value = "";
        nazwiskoInput.value = "";
        modal.style.display = "none";
        wyswietlListe();
    }
});

// Zamknięcie modal usuwania
zamknijUsun.addEventListener("click", () => { modalUsun.style.display = "none"; });
anulujUsun.addEventListener("click", () => { modalUsun.style.display = "none"; });

// Potwierdzenie usuwania
potwierdzUsun.addEventListener("click", () => {
    if(indexDoUsuniecia !== null){
        ministranci.splice(indexDoUsuniecia, 1);
        localStorage.setItem("ministranci", JSON.stringify(ministranci));
        indexDoUsuniecia = null;
        modalUsun.style.display = "none";
        wyswietlListe();
    }
});

// Zamknięcie modal klikając poza
window.addEventListener("click", (e) => {
    if(e.target == modal) modal.style.display = "none";
    if(e.target == modalUsun) modalUsun.style.display = "none";
});

wyswietlListe();
