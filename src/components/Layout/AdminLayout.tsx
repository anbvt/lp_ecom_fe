import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Admin/Navbar";
import SideMenu from "../Admin/Sidebar";
import "./AdminLayout.css";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [cookie] = useCookies(["admin"]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!cookie.admin) {
            navigate("/admin/login");
        }
    }, [cookie.admin, navigate]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    if (!cookie.admin) {
        return null;
    }

    return (
        <div className="admin-app">
            <Navbar onMenuToggle={() => setIsMenuOpen((open) => !open)} />
            <div className="admin-workspace">
                <SideMenu isOpen={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
                <main className="admin-main">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
