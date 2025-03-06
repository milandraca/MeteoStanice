import React, { useEffect, useState } from "react";
import MeteostanicaService from "../../services/MeteostanicaService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function MeteostanicaPregled() {
  const [meteostanice, setMeteostanice] = useState([]);
  const navigate = useNavigate();

  const dohvatiMeteostanice = async () => {
    try {
      const odgovor = await MeteostanicaService.get();
      if (odgovor.greska) {
        alert(odgovor.poruka);
        return;
      }
      setMeteostanice(odgovor.poruka || []);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja meteostanica:", error);
      alert("Neuspjelo dohvaćanje podataka!");
    }
  };

  useEffect(() => {
    dohvatiMeteostanice();
  }, []);

  const obrisi = async (sifra) => {
    if (!window.confirm("Sigurno želite obrisati ovu meteostanicu?")) return;

    try {
      const odgovor = await MeteostanicaService.obrisi(sifra);
      if (odgovor.greska) {
        alert(odgovor.poruka);
      } else {
        setMeteostanice((prethodneMeteostanice) =>
          prethodneMeteostanice.filter((stanica) => stanica.sifra !== sifra)
        );
      }
    } catch (error) {
      console.error("Greška prilikom brisanja meteostanice:", error);
      alert("Neuspjelo brisanje!");
    }
  };

  return (
    <>
      <Link to={RouteNames.METEOSTANICA_NOVI} className="btn btn-success siroko">
        Dodaj novu meteostanicu
      </Link>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Mjesto</th>
            <th>Geografska širina</th>
            <th>Geografska dužina</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {meteostanice.map((stanica) => (
            <tr key={stanica.sifra}>
              <td>{stanica.naziv}</td>
              <td>{stanica.mjestoNaziv || 'Nije definirano'}</td>
              <td>{stanica.latitude ?? 'Nije definirano'}</td>
              <td>{stanica.longitude ?? 'Nije definirano'}</td>
              <td>
                <Button
                  onClick={() => navigate(`/meteostanica/${stanica.sifra}`)}
                  className="me-2"
                >
                  Promjena
                </Button>
                <Button
                  variant="danger"
                  onClick={() => obrisi(stanica.sifra)}
                >
                  Obriši
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
