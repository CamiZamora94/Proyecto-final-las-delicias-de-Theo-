import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import inventario from "./pages/inventario.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { LayoutPrincipal } from './layout/LayoutPrincipal.jsx';
import { Resumen } from './pages/Resumen.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ingreso" element={<h1>pagina de ingreso</h1>} />
        <Route path="/" element={<LayoutPrincipal /> }> 
          <Route index element={<Resumen />} />
          <Route path="/ventas" element={<h1>pagina de ventas</h1>} />
          <Route path="/inventario" element={<h1>pagina de inventario</h1>} />
          <Route path="/recetario" element={<h1>pagina de recetario</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
