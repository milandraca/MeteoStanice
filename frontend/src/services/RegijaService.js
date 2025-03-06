import { HttpService } from "./HttpService";

async function get() {
  try {
    const odgovor = await HttpService.get("/Regija");
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja regija:", e);
    return {
      greska: true,
      poruka: "Problem kod dohvaćanja regija: " + e.message,
    };
  }
}

async function getBySifra(sifra) {
  try {
    const odgovor = await HttpService.get("/Regija/" + sifra);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja regije:", e);
    return { greska: true, poruka: "Ne postoji regija: " + e.message };
  }
}

async function obrisi(sifra) {
  try {
    const odgovor = await HttpService.delete("/Regija/" + sifra);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom brisanja regije:", e);
    return { greska: true, poruka: "Regija se ne može obrisati: " + e.message };
  }
}

async function dodaj(regija) {
  try {
    const odgovor = await HttpService.post("/Regija", regija);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dodavanja regije:", e);
    if (e.status === 400 && e.response && e.response.data.errors) {
      let poruke = "";
      for (const kljuc in e.response.data.errors) {
        poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
      }
      return { greska: true, poruka: poruke };
    } else {
      return {
        greska: true,
        poruka: "Regija se ne može dodati: " + e.message,
      };
    }
  }
}

async function promjena(sifra, regija) {
  try {
    const odgovor = await HttpService.put("/Regija/" + sifra, regija);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom promjene regije:", e);
    if (e.status === 400 && e.response && e.response.data.errors) {
      let poruke = "";
      for (const kljuc in e.response.data.errors) {
        poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
      }
      return { greska: true, poruka: poruke };
    } else {
      return {
        greska: true,
        poruka: "Regija se ne može promijeniti: " + e.message,
      };
    }
  }
}

export default {
  get,
  obrisi,
  dodaj,
  getBySifra,
  promjena,
};