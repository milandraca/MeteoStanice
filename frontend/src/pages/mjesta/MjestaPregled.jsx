import React, { useEffect, useState } from "react";
import MjestoService from "../../services/MjestoService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { AuthService } from "../../services/AuthService";

export default function MjestaPregled() {
  const [mjesta, setMjesta] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const dohvatiMjesta = async () => {
    try {
      const odgovor = await MjestoService.get();
      if (odgovor.greska) {
        alert(odgovor.poruka);
        return;
      }
      setMjesta(odgovor.poruka || []);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja mjesta:", error);
      alert("Neuspjelo dohvaćanje podataka!");
    }
  };

  useEffect(() => {
    dohvatiMjesta();
    setIsAdmin(AuthService.isAdmin());
  }, []);

  const obrisi = async (sifra) => {
    if (!window.confirm("Sigurno želite obrisati ovo mjesto?")) return;

    try {
      const odgovor = await MjestoService.obrisi(sifra);
      if (odgovor.greska) {
        alert(odgovor.poruka);
      } else {
        setMjesta((prethodnoMjesta) =>
          prethodnoMjesta.filter((mjesto) => mjesto.sifra !== sifra)
        );
      }
    } catch (error) {
      console.error("Greška prilikom brisanja mjesta:", error);
      alert("Neuspjelo brisanje!");
    }
  };

  return (
    <>
      {isAdmin && (
        <Link to={RouteNames.MJESTO_NOVI} className="btn btn-success siroko">
          Dodaj novo mjesto
        </Link>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Šifra</th>
            <th>Naziv</th>
            <th>Broj pošte</th>
            <th>Regija</th>
            {isAdmin && <th>Akcija</th>}
          </tr>
        </thead>
        <tbody>
          {mjesta.map((mjesto) => (
            <tr key={mjesto.sifra}>
              <td>{mjesto.sifra}</td>
              <td>{mjesto.naziv}</td>
              <td>{mjesto.brojPoste || 'Nije definirano'}</td>
              <td>{mjesto.regijaNaziv || 'Nije definirano'}</td>
              {isAdmin && (
                <td>
                  <Button
                    onClick={() => navigate(`/mjesto/${mjesto.sifra}`)}
                    className="me-2"
                  >
                    Promjena
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => obrisi(mjesto.sifra)}
                  >
                    Obriši
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
