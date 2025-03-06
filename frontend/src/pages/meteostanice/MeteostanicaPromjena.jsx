import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import MeteostanicaService from "../../services/MeteostanicaService";
import MjestoService from "../../services/MjestoService";

export default function MeteostanicaPromjena() {
  const navigate = useNavigate();
  const [meteostanica, setMeteostanica] = useState(null);
  const [mjesta, setMjesta] = useState([]);
  const [greska, setGreska] = useState(null);
  const [uspjeh, setUspjeh] = useState(null);
  const [loading, setLoading] = useState(true);
  const routeParams = useParams();
  const nazivRef = useRef(null);
  const longitudeRef = useRef(null);
  const latitudeRef = useRef(null);
  const mjestoRef = useRef(null);

  function validateCoordinate(value, isLatitude) {
    if (!value) return true; // Allow empty values
    const num = Number(value);
    if (isNaN(num)) return false;
    if (isLatitude) {
      return num >= -90 && num <= 90;
    }
    return num >= -180 && num <= 180;
  }

  async function dohvatiMjesta() {
    try {
      console.log("Dohvaćam mjesta...");
      const data = await MjestoService.get();
      console.log("Primljeni podaci mjesta:", data);
      if (data.greska) {
        console.error("Greška od servisa:", data.poruka);
        setGreska("Neuspjelo dohvaćanje mjesta: " + data.poruka);
        return;
      }
      if (!data.poruka || !Array.isArray(data.poruka)) {
        console.error("Neispravan format podataka:", data);
        setGreska("Neuspjeh: Neispravan format podataka");
        return;
      }
      setMjesta(data.poruka);
      console.log("Mjesta postavljena:", data.poruka);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja mjesta:", error);
      setGreska("Neuspjelo dohvaćanje mjesta: " + (error.message || "Nepoznata greška"));
    }
  }

  async function dohvatiMeteostanica() {
    setLoading(true);
    setGreska(null);
    try {
      const odgovor = await MeteostanicaService.getBySifra(routeParams.sifra);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
        return;
      }
      setMeteostanica(odgovor.poruka);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja meteostanice:", error);
      setGreska("Došlo je do pogreške prilikom dohvaćanja meteostanice.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    dohvatiMeteostanica();
    dohvatiMjesta();
  }, []);

  async function promjena(meteostanica) {
    setLoading(true);
    setGreska(null);
    setUspjeh(null);
    try {
      const odgovor = await MeteostanicaService.promjena(routeParams.sifra, meteostanica);
      if (odgovor.greska) {
        setGreska(odgovor.poruka);
      } else {
        setUspjeh("Meteostanica uspješno promijenjena!");
        setTimeout(() => {
          navigate(RouteNames.METEOSTANICA_PREGLED);
        }, 1500);
      }
    } catch (error) {
      console.error("Greška prilikom promjene meteostanice:", error);
      setGreska("Došlo je do pogreške prilikom promjene meteostanice.");
    } finally {
      setLoading(false);
    }
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const longitude = longitudeRef.current.value;
    const latitude = latitudeRef.current.value;

    if (!validateCoordinate(latitude, true)) {
      setGreska("Geografska širina mora biti broj između -90 i 90");
      return;
    }

    if (!validateCoordinate(longitude, false)) {
      setGreska("Geografska dužina mora biti broj između -180 i 180");
      return;
    }

    promjena({
      naziv: nazivRef.current.value,
      longitude: longitude ? Number(longitude) : null,
      latitude: latitude ? Number(latitude) : null,
      mjestoSifra: parseInt(mjestoRef.current.value)
    });
  }

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (!meteostanica) {
    return <div>Meteostanica nije pronađena.</div>;
  }

  return (
    <>
      Promjena meteostanice
      {greska && <Alert variant="danger">{greska}</Alert>}
      {uspjeh && <Alert variant="success">{uspjeh}</Alert>}
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="mjesto" className="mb-3">
          <Form.Label>Mjesto</Form.Label>
          <Form.Select 
            ref={mjestoRef} 
            required
            defaultValue={meteostanica.mjestoSifra}
          >
            <option value="">Odaberite mjesto</option>
            {mjesta.map((mjesto) => (
              <option key={mjesto.sifra} value={mjesto.sifra}>
                {mjesto.naziv} ({mjesto.regija?.naziv || 'Nepoznata regija'})
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
            defaultValue={meteostanica.naziv}
            ref={nazivRef}
          />
        </Form.Group>

        <Form.Group controlId="latitude" className="mb-3">
          <Form.Label>Geografska širina</Form.Label>
          <Form.Control 
            type="text"
            name="latitude"
            defaultValue={meteostanica.latitude}
            ref={latitudeRef}
            placeholder="Npr. 45.123456"
          />
          <Form.Text className="text-muted">
            Vrijednost između -90 i 90 s do 6 decimala
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="longitude" className="mb-3">
          <Form.Label>Geografska dužina</Form.Label>
          <Form.Control 
            type="text"
            name="longitude"
            defaultValue={meteostanica.longitude}
            ref={longitudeRef}
            placeholder="Npr. 18.123456"
          />
          <Form.Text className="text-muted">
            Vrijednost između -180 i 180 s do 6 decimala
          </Form.Text>
        </Form.Group>

        <Row>
          <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
            <Link
              to={RouteNames.METEOSTANICA_PREGLED}
              className="btn btn-danger siroko"
            >
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Promijeni meteostanicu
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
