import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, ButtonGroup } from 'react-bootstrap';
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
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

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
        console.log('Dobiveni podaci (sirovi):', response.poruka);
        console.log('Temperature (sirove):', response.poruka.map(p => ({
          vrijeme: p.vrijeme,
          temperatura: p.temperatura
        })));
        
        // Sort data by time
        const sortiraniPodaci = response.poruka.sort((a, b) => 
          new Date(a.vrijeme) - new Date(b.vrijeme)
        );
        console.log('Sortirani podaci:', sortiraniPodaci);
        console.log('Temperature (sortirane):', sortiraniPodaci.map(p => ({
          vrijeme: p.vrijeme,
          temperatura: p.temperatura
        })));
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
    const date = new Date(dateString);
    return date.toLocaleDateString('hr', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const filterDataByPeriod = (data, period) => {
    const now = new Date();
    const periodInHours = {
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30,
      '1y': 24 * 365
    };
    
    const cutoffTime = new Date(now.getTime() - (periodInHours[period] * 60 * 60 * 1000));
    
    return data.filter(p => new Date(p.vrijeme) > cutoffTime);
  };

  const filtriraniPodaci = filterDataByPeriod(
    podaci.filter(p => p.temperatura !== null),
    selectedPeriod
  );

const temperaturaConfig = {
    labels: filtriraniPodaci.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Temperatura (°C)',
      data: filtriraniPodaci.map(p => p.temperatura),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
};


  const filtriraniPodaciPadaline = filterDataByPeriod(
    podaci.filter(p => p.kolicinaPadalina !== null)
      .sort((a, b) => new Date(a.vrijeme) - new Date(b.vrijeme)),
    selectedPeriod
  );

  const padalineConfig = {
    labels: filtriraniPodaciPadaline.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Količina padalina (mm)',
      data: filtriraniPodaciPadaline.map(p => p.kolicinaPadalina),
      backgroundColor: 'rgb(53, 162, 235)'
    }]
  };

  const filtriraniPodaciVjetar = filterDataByPeriod(
    podaci.filter(p => p.brzinaVjetra !== null)
      .sort((a, b) => new Date(a.vrijeme) - new Date(b.vrijeme)),
    selectedPeriod
  );

  const vjetarConfig = {
    labels: filtriraniPodaciVjetar.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Brzina vjetra (km/h)',
      data: filtriraniPodaciVjetar.map(p => p.brzinaVjetra),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const filtriraniPodaciVlaga = filterDataByPeriod(
    podaci.filter(p => p.relativnaVlaga !== null)
      .sort((a, b) => new Date(a.vrijeme) - new Date(b.vrijeme)),
    selectedPeriod
  );

  const vlagaConfig = {
    labels: filtriraniPodaciVlaga.map(p => formatDate(p.vrijeme)),
    datasets: [{
      label: 'Relativna vlaga (%)',
      data: filtriraniPodaciVlaga.map(p => p.relativnaVlaga),
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
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6
        }
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

      <Row className="mb-4">
        <Col>
          <ButtonGroup className="w-100">
            <Button 
              variant={selectedPeriod === '24h' ? 'dark' : 'outline-dark'}
              onClick={() => setSelectedPeriod('24h')}
              className="flex-grow-1 custom-btn"
              style={{
                backgroundColor: selectedPeriod === '24h' ? '#e9ecef' : 'white',
                borderColor: '#212529',
                color: '#212529'
              }}
            >
              24 sata
            </Button>
            <Button 
              variant={selectedPeriod === '7d' ? 'dark' : 'outline-dark'}
              onClick={() => setSelectedPeriod('7d')}
              className="flex-grow-1 custom-btn"
              style={{
                backgroundColor: selectedPeriod === '7d' ? '#e9ecef' : 'white',
                borderColor: '#212529',
                color: '#212529'
              }}
            >
              7 dana
            </Button>
            <Button 
              variant={selectedPeriod === '30d' ? 'dark' : 'outline-dark'}
              onClick={() => setSelectedPeriod('30d')}
              className="flex-grow-1 custom-btn"
              style={{
                backgroundColor: selectedPeriod === '30d' ? '#e9ecef' : 'white',
                borderColor: '#212529',
                color: '#212529'
              }}
            >
              30 dana
            </Button>
            <Button 
              variant={selectedPeriod === '1y' ? 'dark' : 'outline-dark'}
              onClick={() => setSelectedPeriod('1y')}
              className="flex-grow-1 custom-btn"
              style={{
                backgroundColor: selectedPeriod === '1y' ? '#e9ecef' : 'white',
                borderColor: '#212529',
                color: '#212529'
              }}
            >
              1 godina
            </Button>
          </ButtonGroup>
          <style>
            {`
              .custom-btn:hover {
                background-color: #e9ecef !important;
                color: #212529 !important;
                border-color: #212529 !important;
              }
            `}
          </style>
        </Col>
      </Row>

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
