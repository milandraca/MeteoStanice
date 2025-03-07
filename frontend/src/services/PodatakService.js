import { HttpService } from "./HttpService";

async function get() {
  try {
    const odgovor = await HttpService.get("/Podatak");
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
    console.log('PodatakService - Pozivam API za stanicu:', sifraMeteostanice);
    const odgovor = await HttpService.get(`/Podatak/Meteostanica/${sifraMeteostanice}`);
    console.log('PodatakService - API odgovor:', odgovor);
    if (!odgovor.data) {
      console.error('PodatakService - Nema podataka u odgovoru');
      return { greska: true, poruka: "Nema podataka za odabranu meteostanicu" };
    }
    return { greska: false, poruka: odgovor.data };
  } catch (e) {
    console.error("PodatakService - Greška prilikom dohvaćanja podataka za meteostanicu:", e);
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
