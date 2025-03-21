import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MeteostanicaService from '../services/MeteostanicaService';
import { GOOGLE_MAPS_API } from '../constants';
import { AuthService } from '../services/AuthService';

const mapContainerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const center = {
  lat: 45.4900,
  lng: 19.0614
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true
};

export default function Pocetna() {
    const navigate = useNavigate();
    const [map, setMap] = useState(null);
    const [meteostanice, setMeteostanice] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStation, setSelectedStation] = useState(null);
    const [isInfoWindowHovered, setIsInfoWindowHovered] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    let mouseOutTimer = null;

    const handleMarkerClick = (stanica) => {
        navigate('/podaci/vizualizacija', { state: { selectedStanica: stanica.sifra } });
    };

    const handleMarkerMouseOver = (stanica) => {
        if (mouseOutTimer) {
            clearTimeout(mouseOutTimer);
        }
        setSelectedStation(stanica);
    };

    const handleMarkerMouseOut = () => {
        if (!isInfoWindowHovered) {
            mouseOutTimer = setTimeout(() => {
                setSelectedStation(null);
            }, 300);
        }
    };

    const handleInfoWindowMouseOver = () => {
        setIsInfoWindowHovered(true);
        if (mouseOutTimer) {
            clearTimeout(mouseOutTimer);
        }
    };

    const handleInfoWindowMouseOut = () => {
        setIsInfoWindowHovered(false);
        mouseOutTimer = setTimeout(() => {
            setSelectedStation(null);
        }, 300);
    };

    useEffect(() => {
        // Check authentication status
        setIsAuthenticated(AuthService.isAuthenticated());
        
        const dohvatiMeteostanice = async () => {
            // Only fetch meteo stations if user is authenticated
            if (AuthService.isAuthenticated()) {
                const response = await MeteostanicaService.get();
                if (!response.greska) {
                    setMeteostanice(response.poruka);
                }
            }
            setIsLoading(false);
        };
        dohvatiMeteostanice();
        
        // Listen for authentication changes
        const handleStorageChange = () => {
            const isAuth = AuthService.isAuthenticated();
            setIsAuthenticated(isAuth);
            
            // If user logs in, fetch meteo stations
            if (isAuth && meteostanice.length === 0) {
                dohvatiMeteostanice();
            } else if (!isAuth) {
                // If user logs out, clear meteo stations
                setMeteostanice([]);
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_API);

    const onLoad = useCallback(map => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(map => {
        setMap(null);
    }, []);

    if (loadError || !isLoaded) {
        return (
            <Container fluid className="py-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Učitavanje...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="text-center mb-4">Meteo stanice</h1>
                    
                    {!isAuthenticated && (
                        <Alert variant="info" className="mb-4">
                            Prijavite se da biste vidjeli meteo stanice na karti.
                        </Alert>
                    )}
                    
                    <div className="map-container">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={9}
                            options={options}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                        >
                            {isAuthenticated && meteostanice.map((stanica, index) => (
                                <Marker
                                    key={stanica.sifra}
                                    position={{
                                        lat: parseFloat(stanica.latitude),
                                        lng: parseFloat(stanica.longitude)
                                    }}
                                    label={{
                                        text: (index + 1).toString(),
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                    //onClick={() => handleMarkerClick(stanica)}
                                    onMouseOver={() => handleMarkerMouseOver(stanica)}
                                    //onMouseOut={handleMarkerMouseOut}
                                />
                            ))}
                            {isAuthenticated && selectedStation && (
                                <InfoWindow
                                    position={{
                                        lat: parseFloat(selectedStation.latitude),
                                        lng: parseFloat(selectedStation.longitude)
                                    }}
                                    options={{
                                        closeButton: false
                                    }}
                                >
                                    <div
                                       // onMouseOver={handleInfoWindowMouseOver}
                                        onMouseOut={handleInfoWindowMouseOut}
                                        onClick={() => handleMarkerClick(selectedStation)}
                                        style={{ 
                                            padding: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <h6 style={{ margin: 0 }}>{selectedStation.naziv}</h6>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
