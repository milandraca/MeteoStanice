import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import DrzavaService from "../../services/DrzavaService";


export default function DrzaveDodaj(){

    const navigate = useNavigate();

    async function dodaj(drzava){
        const odgovor = await DrzavaService.dodaj(drzava);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.DRZAVA_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        dodaj(
            {
                naziv: podaci.get('naziv'),
                
                
            }
        );
    }

    return(
    <>
    Dodavanje drzave
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" required />
        </Form.Group>
        

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.DRZAVA_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj drzavu
                </Button>
            </Col>
        </Row>


    </Form>




   
    </>
    )
}