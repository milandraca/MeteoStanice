import { useEffect, useState } from "react"
import DrzavaService from "../../services/DrzavaService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function DrzavePregled(){

    const[drzave, setDrzave] = useState();
    const navigate = useNavigate();

    async function dohvatiDrzave() {
        try {
            const odgovor = await DrzavaService.get();
            setDrzave(odgovor || []); // Ako je undefined, postavi na prazan niz
        } catch (error) {
            console.error("Greška prilikom dohvaćanja država:", error);
            alert("Neuspjelo dohvaćanje podataka!");
        }
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu Države
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

    async function obrisi(sifra) {
        if (!window.confirm("Sigurno želite obrisati ovu državu?")) return;
    
        try {
            const odgovor = await DrzavaService.obrisi(sifra);
            if (odgovor.greska) {
                alert(odgovor.poruka);
            } else {
                setDrzave(drzave.filter(d => d.sifra !== sifra));
            }
        } catch (error) {
            console.error("Greška prilikom brisanja države:", error);
            alert("Neuspjelo brisanje!");
        }
    }


    return(
        <>
        <Link
        to={RouteNames.DRZAVA_NOVI}
        className="btn btn-success siroko"
        >Dodaj novu državu</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Šifra</th>
                    <th>Naziv</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {drzave && drzave.map((drzava,index)=>(
                    <tr key={index}>
                        <td>
                            {drzava.sifra}
                        </td>
                        <td>
                            {drzava.naziv}
                        </td>
                        <td>
                            <Button
                            onClick={()=>navigate(`/drzava/${drzava.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(drzava.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )


}
