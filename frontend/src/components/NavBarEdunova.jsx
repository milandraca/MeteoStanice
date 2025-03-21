import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { PRODUKCIJA, RouteNames } from '../constants';
import { AuthService } from '../services/AuthService';
import { useState, useEffect } from 'react';



export default function NavBarEdunova(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Check authentication status when component mounts
    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(AuthService.isAuthenticated());
        };
        
        // Check initially
        checkAuth();
        
        // Set up event listener for storage changes (for when user logs in/out in another tab)
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        navigate(RouteNames.HOME);
    };

    return(
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand 
                className='ruka'
                onClick={()=>navigate(RouteNames.HOME)}
                >Meteo Stanice</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title="Control Panel" id="basic-nav-dropdown">
                        <NavDropdown.Item
                        onClick={()=>navigate(RouteNames.DRZAVA_PREGLED)}
                    >Države</NavDropdown.Item>

                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.REGIJA_PREGLED)}
                    >Regije</NavDropdown.Item>

                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.MJESTO_PREGLED)}
                    >Mjesta</NavDropdown.Item>

                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.METEOSTANICA_PREGLED)}
                    >Meteostanice</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link 
                        onClick={()=>navigate(RouteNames.PODACI_VIZUALIZACIJA)}
                        >Vizualizacija</Nav.Link>
                    <Nav.Link href={PRODUKCIJA + '/swagger'} target='_blank'>Swagger</Nav.Link>
                </Nav>
                <Nav>
                    {isAuthenticated ? (
                        <Nav.Link onClick={handleLogout}>Odjava</Nav.Link>
                    ) : (
                        <>
                            <Nav.Link onClick={() => navigate(RouteNames.LOGIN)}>Prijava</Nav.Link>
                            <Nav.Link onClick={() => navigate(RouteNames.REGISTER)}>Registracija</Nav.Link>
                        </>
                    )}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}
