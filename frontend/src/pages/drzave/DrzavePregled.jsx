import { useEffect, useState } from "react"
import DrzaveService from "../../services/DrzaveService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function DrzavePregled(){

    const[drzave, setDrzave] = useState();
    const navigate = useNavigate();

    async function dohvatiDrzave(){
        const odgovor = await DrzaveService.get()
        setDrzave(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu Smjerovi
    useEffect(()=>{
        dohvatiDrzave();
    },[])


    function formatirajDatum(datum){
        if(datum==null){
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD. MM. YYYY.')
    }

    

    

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeDrzave(sifra);
    }

    async function brisanjeDrzave(sifra) {
        const odgovor = await DrzaveService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiDrzave();
    }


    return(
        <>
        <Link
        to={RouteNames.DRZAVE_NOVI}
        className="btn btn-success siroko"
        >Dodaj novu drzavu</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Šifra</th>
                    <th>Akcija</th>
                    
                </tr>
            </thead>
            <tbody>
                {naziv && naziv.map((naziv,index)=>(
                    <tr key={index}>
                        <td>
                            {naziv.Hrvatska}
                        </td>
                        <td>
                            {naziv.Srbija}
                        </td>
                      
                        
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/drzave/${naziv.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(naziv.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )


}