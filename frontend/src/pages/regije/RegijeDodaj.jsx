import React, { useState, useRef, useEffect } from "react";
import RegijaService from "../../services/RegijaService";
import DrzavaService from "../../services/DrzavaService";
import { Button, Row, Col, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function RegijeDodaj() {
  const navigate = useNavigate();
  const [greska, setGreska] = useState(null);
  const [uspjeh, setUspjeh] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drzave, setDrzave] = useState([]);
  const nazivRef = useRef(null);
  const drzavaRef = useRef(null);

  useEffect(() => {
    const getDrzave = async () => {
      try {
        const data = await DrzavaService.get();
        setDrzave(data || []);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja država:", error);
        setGreska("Neuspjelo dohvaćanje država");
      }
    };
    getDrzave();
  }, []);

  async function dodaj(regija) {
    setLoading(true);
    setGreska(null);
    setUspjeh(null);
    try {
      const odgovor = await RegijaService.dodaj(regija);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
      } else {
        setUspjeh("Regija uspješno dodana!");
        setTimeout(() => {
          navigate(RouteNames.REGIJA_PREGLED);
        }, 1500);
      }
    } catch (error) {
      console.error("Greška prilikom dodavanja regije:", error);
      setGreska("Došlo je do pogreške prilikom dodavanja regije.");
    } finally {
      setLoading(false);
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();
    dodaj({
      naziv: nazivRef.current.value,
      drzavaSifra: parseInt(drzavaRef.current.value)
    });
  }

  return (
    <>
      Dodavanje regije
      {greska && <Alert variant="danger">{greska}</Alert>}
      {uspjeh && <Alert variant="success">{uspjeh}</Alert>}
      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="drzava" className="mb-3">
          <Form.Label>Država</Form.Label>
          <Form.Select ref={drzavaRef} required>
            <option value="">Odaberite državu</option>
            {drzave.map((drzava) => (
              <option key={drzava.sifra} value={drzava.sifra}>
                {drzava.naziv}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control type="text" name="naziv" required ref={nazivRef} />
        </Form.Group>

        <Row className="akcije">
          <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.REGIJA_PREGLED} className="btn btn-danger siroko">
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
              {loading ? "Dodavanje..." : "Dodaj regiju"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
