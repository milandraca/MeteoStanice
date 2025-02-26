import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import DrzavaService from "../../services/DrzavaService";
import { useEffect, useState } from "react";


export default function DrzavePromjena()
{

    const navigate = useNavigate();
    const [drzava,setDrzava] = useState({});
    const [sifra,setSifra] = useState({});
    
    const routeParams = useParams();

    async function dohvatiDrzava(){
        const odgovor = await DrzavaService.getBySifra(routeParams.sifra)

        setDrzave(odgovor)

    useEffect(()=>{
        dohvatiDrzava();
    },[])}

    async function promjena(drzave){
        const odgovor = await DrzavaService.promjena(routeParams.sifra,drzava);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.DRZAVA_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        promjena(
            {
                naziv: podaci.get('naziv'),
               
            }
        );
    }

    return(
    <>
    Promjena drzave
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" required 
            defaultValue={drzava.naziv}/>
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
                    Promjeni državu
                </Button>
            </Col>
        </Row>


    </Form>




   
    </>
    )
}
