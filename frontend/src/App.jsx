import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutPrincipal } from './layout/LayoutPrincipal.jsx';
import { Resumen } from './pages/Resumen.jsx';
// Importa correctamente los componentes de Tarjeta
// Asegúrate de que exista el componente Inventario (nota: los componentes deben empezar con mayúscula)
import { Inventario } from "./pages/Inventario.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Ventas } from './pages/Ventas.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ingreso" element={<h1>pagina de ingreso</h1>} />
        
        {/* Ruta principal con Layout */}
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<Resumen />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="recetario" element={<h1>pagina de recetario</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App