import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutPrincipal } from './layout/LayoutPrincipal.jsx';
import { Resumen } from './pages/Resumen.jsx';
import { Inventario } from "./pages/inventario.jsx";
import { Ventas } from './pages/Ventas.jsx';
import { Login } from './pages/login.jsx';
import { Privado } from './utils/Privado.jsx';
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/ingreso" element={<Login />} />
          <Route path="/" element={<Privado><LayoutPrincipal /></Privado>}>
            <Route index element={<Resumen />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="recetario" element={<h1>Página de Recetario</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;