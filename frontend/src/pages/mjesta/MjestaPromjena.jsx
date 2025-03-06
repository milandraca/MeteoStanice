import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import MjestoService from "../../services/MjestoService";
import RegijaService from "../../services/RegijaService";

export default function MjestaPromjena() {
  const navigate = useNavigate();
  const [mjesto, setMjesto] = useState(null);
  const [regije, setRegije] = useState([]);
  const [greska, setGreska] = useState(null);
  const [uspjeh, setUspjeh] = useState(null);
  const [loading, setLoading] = useState(true);
  const routeParams = useParams();
  const nazivRef = useRef(null);
  const brojPosteRef = useRef(null);
  const regijaRef = useRef(null);

  async function dohvatiRegije() {
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
  }

  async function dohvatiMjesto() {
    setLoading(true);
    setGreska(null);
    try {
      const odgovor = await MjestoService.getBySifra(routeParams.sifra);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
        return;
      }
      setMjesto(odgovor.poruka);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja mjesta:", error);
      setGreska("Došlo je do pogreške prilikom dohvaćanja mjesta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    dohvatiMjesto();
    dohvatiRegije();
  }, []);

  async function promjena(mjesto) {
    setLoading(true);
    setGreska(null);
    setUspjeh(null);
    try {
      const odgovor = await MjestoService.promjena(routeParams.sifra, mjesto);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
      } else {
        setUspjeh("Mjesto uspješno promijenjeno!");
        setTimeout(() => {
          navigate(RouteNames.MJESTO_PREGLED);
        }, 1500);
      }
    } catch (error) {
      console.error("Greška prilikom promjene mjesta:", error);
      setGreska("Došlo je do pogreške prilikom promjene mjesta.");
    } finally {
      setLoading(false);
    }
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const brojPoste = brojPosteRef.current.value;
    promjena({
      naziv: nazivRef.current.value,
      brojPoste: brojPoste ? parseInt(brojPoste) : null,
      regijaSifra: parseInt(regijaRef.current.value)
    });
  }

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (!mjesto) {
    return <div>Mjesto nije pronađeno.</div>;
  }

  return (
    <>
      Promjena mjesta
      {greska && <Alert variant="danger">{greska}</Alert>}
      {uspjeh && <Alert variant="success">{uspjeh}</Alert>}
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="regija" className="mb-3">
          <Form.Label>Regija</Form.Label>
          <Form.Select 
            ref={regijaRef} 
            required
            defaultValue={mjesto.regijaSifra}
          >
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
          <Form.Control
            type="text"
            name="naziv"
            required
            defaultValue={mjesto.naziv}
            ref={nazivRef}
          />
        </Form.Group>

        <Form.Group controlId="brojPoste" className="mb-3">
          <Form.Label>Broj pošte</Form.Label>
          <Form.Control 
            type="number" 
            name="brojPoste"
            defaultValue={mjesto.brojPoste}
            ref={brojPosteRef}
            min="0"
          />
        </Form.Group>

        <Row>
          <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
            <Link
              to={RouteNames.MJESTO_PREGLED}
              className="btn btn-danger siroko"
            >
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Promijeni mjesto
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
