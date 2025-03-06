import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import RegijaService from "../../services/RegijaService";
import DrzavaService from "../../services/DrzavaService";

export default function RegijePromjena() {
  const navigate = useNavigate();
  const [regija, setRegija] = useState(null);
  const [greska, setGreska] = useState(null);
  const [uspjeh, setUspjeh] = useState(null);
  const [loading, setLoading] = useState(true);
  const routeParams = useParams();
  const [drzave, setDrzave] = useState([]);
  const nazivRef = useRef(null);
  const drzavaRef = useRef(null);

  async function dohvatiDrzave() {
    try {
      const data = await DrzavaService.get();
      setDrzave(data || []);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja država:", error);
      setGreska("Neuspjelo dohvaćanje država");
    }
  }

  async function dohvatiRegija() {
    setLoading(true);
    setGreska(null);
    try {
      const odgovor = await RegijaService.getBySifra(routeParams.sifra);
      setRegija(odgovor.poruka);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja regije:", error);
      setGreska("Došlo je do pogreške prilikom dohvaćanja regije.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    dohvatiRegija();
    dohvatiDrzave();
  }, []);

  async function promjena(regija) {
    setLoading(true);
    setGreska(null);
    setUspjeh(null);
    try {
      const odgovor = await RegijaService.promjena(routeParams.sifra, regija);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
      } else {
        setUspjeh("Regija uspješno promijenjena!");
        setTimeout(() => {
          navigate(RouteNames.REGIJA_PREGLED);
        }, 1500);
      }
    } catch (error) {
      console.error("Greška prilikom promjene regije:", error);
      setGreska("Došlo je do pogreške prilikom promjene regije.");
    } finally {
      setLoading(false);
    }
  }

  function odradiSubmit(e) {
    e.preventDefault();
    promjena({
      naziv: nazivRef.current.value,
      drzavaSifra: parseInt(drzavaRef.current.value)
    });
  }

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (!regija) {
    return <div>Regija nije pronađena.</div>;
  }

  return (
    <>
      Promjena regije
      {greska && <Alert variant="danger">{greska}</Alert>}
      {uspjeh && <Alert variant="success">{uspjeh}</Alert>}
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="drzava" className="mb-3">
          <Form.Label>Država</Form.Label>
          <Form.Select 
            ref={drzavaRef} 
            required
            defaultValue={regija.drzavaSifra}
          >
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
          <Form.Control
            type="text"
            name="naziv"
            required
            defaultValue={regija.naziv}
            ref={nazivRef}
          />
        </Form.Group>

        <hr />

        <Row>
          <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
            <Link
              to={RouteNames.REGIJA_PREGLED}
              className="btn btn-danger siroko"
            >
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Promjeni regiju
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
