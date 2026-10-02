//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            uuendaKorviSummat();
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

        }
    });
    uuendaKorviSummat();
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi && korvArtikkel.kogus > 1) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
        }
    });
    uuendaKorviSummat();
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    } else {
        uuendaKorviSummat();
    }
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <div class="korv-summad">
          <p>Ostukorv: <span data-role="korv-vahesumma">0,00</span> €</p>
          <p>Tarne: <span data-role="tarne-hind">0,00</span> €</p>
          <p><strong>Kokku tasuda: <span data-role="korv-summa">0,00</span> €</strong></p>
        </div>
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();
    korv = [];

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaOstukorviNupp.innerText = 'Lisa ostukorvi';
        lisaOstukorviNupp.disabled = false;
    });
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function uuendaKorviSummat() {
    const vahesumma = korv.reduce((kokku, korvArtikkel) => {
        return kokku + Number(korvArtikkel.hind) * korvArtikkel.kogus;
    }, 0);
    const valitudTarne = document.querySelector('input[name="tarneviis"]:checked');
    const tarneHind = valitudTarne === null ? 0 : Number(valitudTarne.dataset.hind);
    const summa = vahesumma + tarneHind;

    const vahesummaElement = document.querySelector('[data-role="korv-vahesumma"]');
    const tarneHinnaElement = document.querySelector('[data-role="tarne-hind"]');
    const summaElement = document.querySelector('[data-role="korv-summa"]');
    if (vahesummaElement !== null && tarneHinnaElement !== null && summaElement !== null) {
        vahesummaElement.innerText = vahesumma.toFixed(2).replace('.', ',');
        tarneHinnaElement.innerText = tarneHind.toFixed(2).replace('.', ',');
        summaElement.innerText = summa.toFixed(2).replace('.', ',');
    }
}


//-------------------------2. osa Taimer ------------------------

//taimer
let taimeriIntervall = null;

function alustaTaimer(kestvus, kuva) {
    const lopp = Date.now() + kestvus * 1000;

    if (taimeriIntervall !== null) {
        clearInterval(taimeriIntervall);
    }

    function taimer() {
        const vahe = Math.max(0, Math.ceil((lopp - Date.now()) / 1000));
        let minutid = Math.floor(vahe / 60);
        let sekundid = vahe % 60;

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe === 0) {
            clearInterval(taimeriIntervall);
            taimeriIntervall = null;
            kuva.textContent = "alusta uuesti";
        }
    }

    taimeriIntervall = setInterval(taimer, 1000);
    taimer();
}

function kassa() {
    const taimeriAeg = 60 * 2;
    const kuva = document.getElementById("time");
    alustaTaimer(taimeriAeg, kuva);
}


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
// minu kood: postiindeksi väli
const postiindeks = document.getElementById("postiindeks");
const tarneviisid = document.querySelectorAll('input[name="tarneviis"]');

const errorMessage = document.getElementById("errorMessage");

tarneviisid.forEach(tarneviis => {
    tarneviis.addEventListener('change', () => uuendaKorviSummat());
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi");
    } else if (/\d/.test(eesnimi.value)) {
        errors.push("Eesnimi ei tohi sisaldada numbreid");
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi");
    } else if (/\d/.test(perenimi.value)) {
        errors.push("Perenimi ei tohi sisaldada numbreid");
    }

    if (!/^\d{6,}$/.test(telefon.value.trim())) {
        errors.push("Telefon peab sisaldama vähemalt 6 numbrit");
    }

    if (document.querySelector('input[name="tarneviis"]:checked') === null) {
        errors.push("Vali tarneviis");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    // minu kood: postiindeksi kontroll
    if (!/^\d{5}$/.test(postiindeks.value.trim())) {
        errors.push("Postiindeks peab sisaldama täpselt 5 numbrit");
    }

    if (errors.length > 0) {
        errorMessage.innerText = errors.join(', ');
    } else {
        errorMessage.innerText = "";
    }
});

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



