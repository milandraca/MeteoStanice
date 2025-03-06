import { HttpService } from "./HttpService";

async function get() {
  try {
    const odgovor = await HttpService.get("/Meteostanica");
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja meteostanica:", e);
    return {
      greska: true,
      poruka: "Problem kod dohvaćanja meteostanica: " + e.message,
    };
  }
}

async function getBySifra(sifra) {
  try {
    const odgovor = await HttpService.get("/Meteostanica/" + sifra);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja meteostanice:", e);
    return { greska: true, poruka: "Ne postoji meteostanica: " + e.message };
  }
}

async function obrisi(sifra) {
  try {
    const odgovor = await HttpService.delete("/Meteostanica/" + sifra);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom brisanja meteostanice:", e);
    return { greska: true, poruka: "Meteostanica se ne može obrisati: " + e.message };
  }
}

async function dodaj(meteostanica) {
  try {
    const odgovor = await HttpService.post("/Meteostanica", meteostanica);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dodavanja meteostanice:", e);
    if (e.status === 400 && e.response && e.response.data.errors) {
      let poruke = "";
      for (const kljuc in e.response.data.errors) {
        poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
      }
      return { greska: true, poruka: poruke };
    } else {
      return {
        greska: true,
        poruka: "Meteostanica se ne može dodati: " + e.message,
      };
    }
  }
}

async function promjena(sifra, meteostanica) {
  try {
    const odgovor = await HttpService.put("/Meteostanica/" + sifra, meteostanica);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom promjene meteostanice:", e);
    if (e.status === 400 && e.response && e.response.data.errors) {
      let poruke = "";
      for (const kljuc in e.response.data.errors) {
        poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
      }
      return { greska: true, poruka: poruke };
    } else {
      return {
        greska: true,
        poruka: "Meteostanica se ne može promijeniti: " + e.message,
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
