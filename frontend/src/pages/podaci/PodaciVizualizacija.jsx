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

const chartColors = [
  'rgb(255, 99, 132)',   // pink
  'rgb(54, 162, 235)',   // blue
  'rgb(75, 192, 192)',   // teal
  'rgb(153, 102, 255)',  // purple
  'rgb(255, 159, 64)',   // orange
  'rgb(255, 99, 255)',   // magenta
  'rgb(99, 255, 132)',   // light green
  'rgb(45, 192, 255)',   // light blue
];

const emptyChartConfig = {
  labels: [],
  datasets: []
};

export default function PodaciVizualizacija() {
  const [podaciPoStanicama, setPodaciPoStanicama] = useState({});
  const [meteostanice, setMeteostanice] = useState([]);
  const [odabraneStanice, setOdabraneStanice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  useEffect(() => {
    const dohvatiMeteostanice = async () => {
      const response = await MeteostanicaService.get();
      if (!response.greska) {
        setMeteostanice(response.poruka);
      }
    };
    dohvatiMeteostanice();
  }, []);

  useEffect(() => {
    const dohvatiPodatke = async () => {
      if (odabraneStanice.length === 0) {
        setPodaciPoStanicama({});
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const noviPodaci = {};
      
      for (const stanicaSifra of odabraneStanice) {
        const response = await PodatakService.getByMeteostanica(stanicaSifra);
        
        if (!response.greska && Array.isArray(response.poruka)) {
          const sortiraniPodaci = response.poruka.sort((a, b) => 
            new Date(a.vrijeme) - new Date(b.vrijeme)
          );
          noviPodaci[stanicaSifra] = sortiraniPodaci;
        }
      }
      
      setPodaciPoStanicama(noviPodaci);
      setLoading(false);
    };
    
    dohvatiPodatke();
  }, [odabraneStanice]);

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

  const createDatasets = (podatciPoVrsti, valueKey, label) => {
    if (Object.keys(podatciPoVrsti).length === 0) return [];

    return Object.entries(podatciPoVrsti).map(([stanicaSifra, podaci], index) => {
      const stanica = meteostanice.find(s => s.sifra === stanicaSifra);
      const stationName = stanica ? stanica.naziv : stanicaSifra;
      
      return {
        label: `${stationName} - ${label}`,
        data: podaci.map(p => p[valueKey]),
        borderColor: chartColors[index % chartColors.length],
        backgroundColor: valueKey === 'kolicinaPadalina' ? chartColors[index % chartColors.length] : undefined,
        tension: 0.1
      };
    });
  };

  const getFilteredDataByType = (valueKey) => {
    if (Object.keys(podaciPoStanicama).length === 0) return {};

    const filteredData = {};
    Object.entries(podaciPoStanicama).forEach(([stanicaSifra, podaci]) => {
      filteredData[stanicaSifra] = filterDataByPeriod(
        podaci.filter(p => p[valueKey] !== null),
        selectedPeriod
      );
    });
    return filteredData;
  };

  const createChartConfig = (valueKey, label) => {
    if (odabraneStanice.length === 0) return emptyChartConfig;

    const filteredData = getFilteredDataByType(valueKey);
    if (Object.keys(filteredData).length === 0) return emptyChartConfig;

    const firstStationData = Object.values(filteredData)[0] || [];
    return {
      labels: firstStationData.map(p => formatDate(p.vrijeme)),
      datasets: createDatasets(filteredData, valueKey, label)
    };
  };

  const temperaturaConfig = createChartConfig('temperatura', 'Temperatura (°C)');
  const padalineConfig = createChartConfig('kolicinaPadalina', 'Količina padalina (mm)');
  const vjetarConfig = createChartConfig('brzinaVjetra', 'Brzina vjetra (km/h)');
  const vlagaConfig = createChartConfig('relativnaVlaga', 'Relativna vlaga (%)');

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

  const handleStationToggle = (stanicaSifra) => {
    setOdabraneStanice(prev => {
      if (prev.includes(stanicaSifra)) {
        return prev.filter(sifra => sifra !== stanicaSifra);
      } else {
        return [...prev, stanicaSifra];
      }
    });
  };

  if (loading) {
    return <div>Učitavanje podataka...</div>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Vizualizacija meteoroloških podataka</h2>
      
      <div className="mb-4">
        <Form.Label>Odaberi meteorološke stanice:</Form.Label>
        <div style={{ 
          border: '1px solid #ced4da', 
          borderRadius: '0.25rem',
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {meteostanice.map((stanica) => (
            <div key={stanica.sifra} style={{ minWidth: 'fit-content' }}>
              <Form.Check
                type="checkbox"
                id={`stanica-${stanica.sifra}`}
                label={stanica.naziv}
                checked={odabraneStanice.includes(stanica.sifra)}
                onChange={() => handleStationToggle(stanica.sifra)}
                style={{ margin: 0, whiteSpace: 'nowrap' }}
              />
            </div>
          ))}
        </div>
      </div>

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
