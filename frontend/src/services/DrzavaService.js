import SmjeroviPregled from "../pages/drzave/DrzavePregled";
import { HttpService } from "./HttpService";


async function get(){
    return await HttpService.get('/Drzava')
    .then((odgovor)=>{
        //console.table(odgovor.data)
        return odgovor.data;
    })
    .catch((e)=>{})
}

async function getBySifra(sifra){
    return await HttpService.get('/Drzava/' + sifra)
    .then((odgovor)=>{
        return odgovor.data;
    })
    .catch((e)=>{})
}


async function dodaj(drzave){
    return HttpService.post('/Drzava',drzave)
    .then(()=>{return {greska: false, poruka: 'Dodano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod dodavanja'}})
}

async function promjena(sifra,drzava){
    return HttpService.put('/Drzava/'+sifra,drzava)
    .then(()=>{return {greska: false, poruka: 'Promjenjeno'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod promjene'}})
}

async function obrisi(sifra){
    return HttpService.delete('/Drzava/'+sifra)
    .then(()=>{return {greska: false, poruka: 'Obrisano'}})
    .catch(()=>{return {greska: true, poruka:'Problem kod brisanja'}})
}



export default{
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi
}