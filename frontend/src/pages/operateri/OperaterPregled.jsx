import { useEffect, useState } from "react"
import OperaterService from "../../services/OperaterService"
import { Button, Form, Table } from "react-bootstrap";
import { AuthService } from "../../services/AuthService";

export default function OperaterPregled(){

    const[operateri, setOperateri] = useState([]);
    const[isAdmin, setIsAdmin] = useState(false);
    const[loading, setLoading] = useState(false);

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
        setIsAdmin(AuthService.isAdmin());
    },[])

    async function promijeniAdminStatus(sifra, trenutniStatus) {
        if (loading) return;
        
        setLoading(true);
        try {
            const noviStatus = !trenutniStatus;
            const odgovor = await OperaterService.updateAdminStatus(sifra, noviStatus);
            
            if (odgovor.greska) {
                alert(odgovor.poruka);
            } else {
                // Ažuriraj lokalni state
                setOperateri(operateri.map(op => 
                    op.sifra === sifra ? {...op, admin: noviStatus} : op
                ));
            }
        } catch (error) {
            console.error("Greška prilikom promjene admin statusa:", error);
            alert("Neuspjela promjena admin statusa!");
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
        <h2>Pregled korisnika</h2>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Šifra</th>
                    <th>Email</th>
                    {isAdmin && <th>Admin status</th>}
                    {isAdmin && <th>Akcija</th>}
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
                        {isAdmin && (
                            <td>
                                {operater.admin ? 'Administrator' : 'Korisnik'}
                            </td>
                        )}
                        {isAdmin && (
                            <td>
                                <Button
                                    variant={operater.admin ? "warning" : "success"}
                                    onClick={() => promijeniAdminStatus(operater.sifra, operater.admin)}
                                    disabled={loading}
                                >
                                    {operater.admin ? 'Postavi kao korisnika' : 'Postavi kao administratora'}
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
