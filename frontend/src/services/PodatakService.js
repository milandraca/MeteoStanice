import { HttpService } from "./HttpService";

async function get() {
  try {
    const odgovor = await HttpService.get("/api/v1/Podatak");
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja podataka:", e);
    return {
      greska: true,
      poruka: "Problem kod dohvaćanja podataka: " + e.message,
    };
  }
}

async function getByMeteostanica(sifraMeteostanice) {
  try {
    const odgovor = await HttpService.get(`/api/v1/Podatak/Meteostanica/${sifraMeteostanice}`);
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja podataka za meteostanicu:", e);
    return {
      greska: true,
      poruka: "Problem kod dohvaćanja podataka za meteostanicu: " + e.message,
    };
  }
}

export default {
  get,
  getByMeteostanica
};
