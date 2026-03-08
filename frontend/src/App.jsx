import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutPrincipal } from './layout/LayoutPrincipal.jsx';
import { Resumen } from './pages/Resumen.jsx';
import { Inventario } from "./pages/inventario.jsx"; 
import { Ventas } from './pages/Ventas.jsx';
import { Login } from './pages/login.jsx'; 
import Sidebar from "./components/Sidebar.jsx";

function AppWithSidebar() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/ingreso" element={<Login />} />
            <Route path="/" element={<LayoutPrincipal />}>
              <Route index element={<Resumen />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="recetario" element={<h1>Página de Recetario</h1>} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default AppWithSidebar;