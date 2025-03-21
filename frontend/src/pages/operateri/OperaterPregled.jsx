import { useEffect, useState } from "react"
import OperaterService from "../../services/OperaterService"
import { Table } from "react-bootstrap";

export default function OperaterPregled(){

    const[operateri, setOperateri] = useState([]);

    async function dohvatiOperatere() {
        try {
            const odgovor = await OperaterService.get();
            setOperateri(odgovor || []); // Ako je undefined, postavi na prazan niz
        } catch (error) {
            console.error("Greška prilikom dohvaćanja operatera:", error);
            alert("Neuspjelo dohvaćanje podataka!");
        }
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu Operateri
    useEffect(()=>{
        dohvatiOperatere();
    },[])

    return(
        <>
        <h2>Pregled korisnika</h2>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Šifra</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {operateri && operateri.map((operater,index)=>(
                    <tr key={index}>
                        <td>
                            {operater.sifra}
                        </td>
                        <td>
                            {operater.email}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
