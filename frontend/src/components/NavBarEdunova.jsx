import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { PRODUKCIJA, RouteNames } from '../constants';



export default function NavBarEdunova(){

    const navigate = useNavigate(); // ; u pravilu i ne treba


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
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}
