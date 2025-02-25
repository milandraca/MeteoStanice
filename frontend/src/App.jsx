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



function App() {

  return (
    <>
      <Container>
        <NavBarEdunova />
        
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          <Route path={RouteNames.DRZAVE_PREGLED} element={<DrzavePregled />} />
          <Route path={RouteNames.DRZAVA_NOVI} element={<DrzaveDodaj />} />
          <Route path={RouteNames.DRZAVA_PROMJENA} element={<DrzavePromjena />} />
        </Routes>

        <hr />
        &copy; Svi po malo 2025
      </Container>
     
    </>
  )
}

export default App
