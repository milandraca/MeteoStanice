import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import DrzavePregled from './pages/drzave/DrzavePregled'
import DrzaveDodaj from './pages/drzave/DrzaveDodaj'
import DrzavePromjena from './pages/drzave/DrzavePromjena'
import RegijePregled from './pages/regije/RegijePregled'
import RegijeDodaj from './pages/regije/RegijeDodaj'
import RegijePromjena from './pages/regije/RegijePromjena'
import MjestaPregled from './pages/mjesta/MjestaPregled'
import MjestaDodaj from './pages/mjesta/MjestaDodaj'
import MjestaPromjena from './pages/mjesta/MjestaPromjena'
import MeteostanicaPregled from './pages/meteostanice/MeteostanicaPregled'
import MeteostanicaDodaj from './pages/meteostanice/MeteostanicaDodaj'
import MeteostanicaPromjena from './pages/meteostanice/MeteostanicaPromjena'
import PodaciVizualizacija from './pages/podaci/PodaciVizualizacija'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { useEffect } from 'react'
import { AuthService } from './services/AuthService'



function App() {
  // Initialize authentication state when the app loads
  useEffect(() => {
    AuthService.initAuth();
  }, []);

  return (
    <>
      <Container>
        <NavBarEdunova />
        
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          <Route path={RouteNames.LOGIN} element={<Login />} />
          <Route path={RouteNames.REGISTER} element={<Register />} />
          
          <Route path={RouteNames.DRZAVA_PREGLED} element={<DrzavePregled />} />
          <Route path={RouteNames.DRZAVA_NOVI} element={<DrzaveDodaj />} />
          <Route path={RouteNames.DRZAVA_PROMJENA} element={<DrzavePromjena />} />

          
          <Route path={RouteNames.REGIJA_PREGLED} element={<RegijePregled />} />
          <Route path={RouteNames.REGIJA_NOVI} element={<RegijeDodaj />} />
          <Route path={RouteNames.REGIJA_PROMJENA} element={<RegijePromjena />} />

          <Route path={RouteNames.MJESTO_PREGLED} element={<MjestaPregled />} />
          <Route path={RouteNames.MJESTO_NOVI} element={<MjestaDodaj />} />
          <Route path={RouteNames.MJESTO_PROMJENA} element={<MjestaPromjena />} />

          <Route path={RouteNames.METEOSTANICA_PREGLED} element={<MeteostanicaPregled />} />
          <Route path={RouteNames.METEOSTANICA_NOVI} element={<MeteostanicaDodaj />} />
          <Route path={RouteNames.METEOSTANICA_PROMJENA} element={<MeteostanicaPromjena />} />
          <Route path={RouteNames.PODACI_VIZUALIZACIJA} element={<PodaciVizualizacija />} />
        </Routes>

        <hr />
        &copy; Svi po malo 2025
      </Container>
     
    </>
  )
}

export default App
