import { HttpService } from "./HttpService";

async function get() {
  try {
    const odgovor = await HttpService.get("/Mjesto");
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja mjesta:", e);
    return {
      greska: true,
      poruka: "Problem kod dohvaćanja mjesta: " + e.message,
    };
  }
}

async function getBySifra(sifra) {
  try {
    const odgovor = await HttpService.get("/Mjesto/" + sifra);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja mjesta:", e);
    return { greska: true, poruka: "Ne postoji mjesto: " + e.message };
  }
}

async function obrisi(sifra) {
  try {
    const odgovor = await HttpService.delete("/Mjesto/" + sifra);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom brisanja mjesta:", e);
    return { greska: true, poruka: "Mjesto se ne može obrisati: " + e.message };
  }
}

async function dodaj(mjesto) {
  try {
    const odgovor = await HttpService.post("/Mjesto", mjesto);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dodavanja mjesta:", e);
    if (e.status === 400 && e.response && e.response.data.errors) {
      let poruke = "";
      for (const kljuc in e.response.data.errors) {
        poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
      }
      return { greska: true, poruka: poruke };
    } else {
      return {
        greska: true,
        poruka: "Mjesto se ne može dodati: " + e.message,
      };
    }
  }
}

async function promjena(sifra, mjesto) {
  try {
    const odgovor = await HttpService.put("/Mjesto/" + sifra, mjesto);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom promjene mjesta:", e);
    if (e.status === 400 && e.response && e.response.data.errors) {
      let poruke = "";
      for (const kljuc in e.response.data.errors) {
        poruke += kljuc + ": " + e.response.data.errors[kljuc][0] + "\n";
      }
      return { greska: true, poruka: poruke };
    } else {
      return {
        greska: true,
        poruka: "Mjesto se ne može promijeniti: " + e.message,
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
