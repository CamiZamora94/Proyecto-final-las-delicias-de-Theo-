import { Link } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, ClipboardList, Cookie } from "lucide-react";
import {Logo} from "./Logo.jsx";


export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed flex flex-col p-5">
      <Logo/>
      <nav className="space-y-4">
        <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all">
          <LayoutDashboard size={20} /> <span className="font-bold">Resumen</span>
        </Link>
        <Link to="/ventas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all">
          <ShoppingCart size={20} /> <span className="font-bold">Ventas</span>
        </Link>
        <Link to="/inventario" className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all">
          <ClipboardList size={20} /> <span className="font-bold">Inventario</span>
        </Link>
        <Link to="/recetario" className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all">
          <Cookie size={20} /> <span className="font-bold">Recetario</span>
        </Link>
      </nav>
    </div>
  );
}