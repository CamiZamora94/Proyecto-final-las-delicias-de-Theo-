import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";


export const LayoutPrincipal = () => { 
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="ml-64 p-6 w-full">
                <header>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Panel Principal</h2>
                    </div>
                    <div></div>
                </header>
                <Outlet />
            </div>
        </div>
    );
}