import React, { useEffect, useState } from "react";
import RegijaService from "../../services/RegijaService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function RegijePregled() {
  const [regije, setRegije] = useState([]); // Inicijalizirajte kao prazan niz
  const navigate = useNavigate();

  const dohvatiRegije = async () => {
    try {
      const odgovor = await RegijaService.get();
      if (odgovor.greska) {
        alert(odgovor.poruka);
        return;
      }
      setRegije(odgovor.poruka || []); // Data is in the poruka property
    } catch (error) {
      console.error("Greška prilikom dohvaćanja regija:", error);
      alert("Neuspjelo dohvaćanje podataka!");
    }
  };

  useEffect(() => {
    dohvatiRegije();
  }, []);

  const obrisi = async (sifra) => {
    if (!window.confirm("Sigurno želite obrisati ovu regiju?")) return;

    try {
      const odgovor = await RegijaService.obrisi(sifra);
      if (odgovor.greska) {
        alert(odgovor.poruka);
      } else {
        setRegije((prethodneRegije) =>
          prethodneRegije.filter((regija) => regija.sifra !== sifra)
        );
      }
    } catch (error) {
      console.error("Greška prilikom brisanja regije:", error);
      alert("Neuspjelo brisanje!");
    }
  };

  return (
    <>
      <Link to={RouteNames.REGIJA_NOVI} className="btn btn-success siroko">
        Dodaj novu regiju
      </Link>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Šifra</th>
            <th>Naziv</th>
            <th>Država</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {regije.map((regija) => (
            <tr key={regija.sifra}>
              <td>{regija.sifra}</td>
              <td>{regija.naziv}</td>
              <td>{regija.drzavaNaziv || 'Nije definirano'}</td>
              <td>
                <Button
                  onClick={() => navigate(`/regija/${regija.sifra}`)}
                  className="me-2" // Dodajte marginu s desne strane
                >
                  Promjena
                </Button>
                <Button
                  variant="danger"
                  onClick={() => obrisi(regija.sifra)}
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
