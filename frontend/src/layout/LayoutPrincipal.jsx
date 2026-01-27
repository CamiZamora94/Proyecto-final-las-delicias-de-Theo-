import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";


export const LayoutPrincipal = () => { 
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="ml-64 p-6 w-full">
                <Outlet />
            </div>
        </div>
    );
}