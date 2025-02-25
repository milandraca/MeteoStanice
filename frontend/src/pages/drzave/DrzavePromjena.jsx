import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import DrzaveService from "../../services/DrzaveService";
import { useEffect, useState } from "react";


export default function DrzavePromjena()
{

    const navigate = useNavigate();
    const [drzave,setDrzave] = useState({});
    
    const routeParams = useParams();

    async function dohvatiDrzavu(){
        const odgovor = await DrzaveService.getBySifra(routeParams.drzave)

        setDrzave(odgovor)

    useEffect(()=>{
        dohvatiDrzavu();
    },[])}

    async function promjena(drzave){
        const odgovor = await DrzaveService.promjena(routeParams.sifra,drzave);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.DRZAVE_PREGLED)
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
            defaultValue={drzave.naziv}/>
        </Form.Group>

       

       


       
        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.DRZAVE_PREGLED}
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
