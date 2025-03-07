import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import PodatakService from '../../services/PodatakService';
import MeteostanicaService from '../../services/MeteostanicaService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PodaciVizualizacija() {
  const [podaci, setPodaci] = useState([]);
  const [meteostanice, setMeteostanice] = useState([]);
  const [odabranaStanica, setOdabranaStanica] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dohvatiMeteostanice = async () => {
      const response = await MeteostanicaService.get();
      if (!response.greska) {
        setMeteostanice(response.poruka);
        if (response.poruka.length > 0) {
          setOdabranaStanica(response.poruka[0].sifra);
        }
      }
    };
    dohvatiMeteostanice();
  }, []);

  useEffect(() => {
    const dohvatiPodatke = async () => {
      if (!odabranaStanica) return;
      
      setLoading(true);
      console.log('Dohvaćam podatke za stanicu:', odabranaStanica);
      const response = await PodatakService.getByMeteostanica(odabranaStanica);
      console.log('API odgovor:', response);
      
      if (!response.greska && Array.isArray(response.poruka)) {
        console.log('Dobiveni podaci:', response.poruka);
        // Sort data by time
        const sortiraniPodaci = response.poruka.sort((a, b) => 
          new Date(a.vrijeme) - new Date(b.vrijeme)
        );
        console.log('Sortirani podaci:', sortiraniPodaci);
        setPodaci(sortiraniPodaci);
      } else {
        console.error('Greška prilikom dohvaćanja podataka:', response);
        setPodaci([]);
      }
      setLoading(false);
    };
    dohvatiPodatke();
  }, [odabranaStanica]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('hr');
  };

  const temperaturaConfig = {
    labels: podaci.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Temperatura (°C)',
      data: podaci.map(p => p.temperatura || 0),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
  };

  const padalineConfig = {
    labels: podaci.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Količina padalina (mm)',
      data: podaci.map(p => p.kolicinaPadalina || 0),
      backgroundColor: 'rgb(53, 162, 235)'
    }]
  };

  const vjetarConfig = {
    labels: podaci.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Brzina vjetra (km/h)',
      data: podaci.map(p => p.brzinaVjetra || 0),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const vlagaConfig = {
    labels: podaci.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Relativna vlaga (%)',
      data: podaci.map(p => p.relativnaVlaga || 0),
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <div>Učitavanje podataka...</div>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Vizualizacija meteoroloških podataka</h2>
      
      <Form.Group className="mb-4">
        <Form.Label>Odaberi meteorološku stanicu:</Form.Label>
        <Form.Select 
          value={odabranaStanica} 
          onChange={(e) => setOdabranaStanica(e.target.value)}
        >
          {meteostanice.map((stanica) => (
            <option key={stanica.sifra} value={stanica.sifra}>
              {stanica.naziv}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row>
        <Col md={6} className="mb-4">
          <div className="chart-container">
            <h4>Temperatura</h4>
            <Line data={temperaturaConfig} options={options} />
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="chart-container">
            <h4>Padaline</h4>
            <Bar data={padalineConfig} options={options} />
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="chart-container">
            <h4>Brzina vjetra</h4>
            <Line data={vjetarConfig} options={options} />
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="chart-container">
            <h4>Relativna vlaga</h4>
            <Line data={vlagaConfig} options={options} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
