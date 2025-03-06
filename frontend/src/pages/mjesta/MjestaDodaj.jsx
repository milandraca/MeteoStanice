import React, { useState, useRef, useEffect } from "react";
import MjestoService from "../../services/MjestoService";
import RegijaService from "../../services/RegijaService";
import { Button, Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function MjestaDodaj() {
  const navigate = useNavigate();
  const [greska, setGreska] = useState(null);
  const [uspjeh, setUspjeh] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regije, setRegije] = useState([]);
  const nazivRef = useRef(null);
  const brojPosteRef = useRef(null);
  const regijaRef = useRef(null);

  useEffect(() => {
    const getRegije = async () => {
      try {
        const data = await RegijaService.get();
        if (data.greska) {
          setGreska("Neuspjelo dohvaćanje regija");
          return;
        }
        setRegije(data.poruka || []);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja regija:", error);
        setGreska("Neuspjelo dohvaćanje regija");
      }
    };
    getRegije();
  }, []);

  async function dodaj(mjesto) {
    setLoading(true);
    setGreska(null);
    setUspjeh(null);
    try {
      const odgovor = await MjestoService.dodaj(mjesto);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
      } else {
        setUspjeh("Mjesto uspješno dodano!");
        setTimeout(() => {
          navigate(RouteNames.MJESTO_PREGLED);
        }, 1500);
      }
    } catch (error) {
      console.error("Greška prilikom dodavanja mjesta:", error);
      setGreska("Došlo je do pogreške prilikom dodavanja mjesta.");
    } finally {
      setLoading(false);
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();
    const brojPoste = brojPosteRef.current.value;
    dodaj({
      naziv: nazivRef.current.value,
      brojPoste: brojPoste ? parseInt(brojPoste) : null,
      regijaSifra: parseInt(regijaRef.current.value)
    });
  }

  return (
    <>
      Dodavanje mjesta
      {greska && <Alert variant="danger">{greska}</Alert>}
      {uspjeh && <Alert variant="success">{uspjeh}</Alert>}
      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="regija" className="mb-3">
          <Form.Label>Regija</Form.Label>
          <Form.Select ref={regijaRef} required>
            <option value="">Odaberite regiju</option>
            {regije.map((regija) => (
              <option key={regija.sifra} value={regija.sifra}>
                {regija.naziv}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="naziv" className="mb-3">
          <Form.Label>Naziv</Form.Label>
          <Form.Control type="text" name="naziv" required ref={nazivRef} />
        </Form.Group>

        <Form.Group controlId="brojPoste" className="mb-3">
          <Form.Label>Broj pošte</Form.Label>
          <Form.Control 
            type="number" 
            name="brojPoste"
            ref={brojPosteRef}
            min="0"
          />
        </Form.Group>

        <Row className="akcije">
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.MJESTO_PREGLED} className="btn btn-danger siroko">
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
            <Button
              variant="success"
              type="submit"
              className="siroko"
              disabled={loading}
            >
              {loading ? "Dodavanje..." : "Dodaj mjesto"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
