import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

interface AdminNavbarProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
}

const Navbar = ({ onMenuToggle, isMenuOpen }: AdminNavbarProps) => {
    const [, , removeCookie] = useCookies(["admin"]);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie("admin", { path: "/" });
        navigate("/admin/login");
    };

    return (
        <header className="admin-topbar">
            <div className="admin-topbar__brand-group">
                <button
                    className="admin-topbar__menu-toggle"
                    type="button"
                    onClick={onMenuToggle}
                    aria-controls="admin-sidebar"
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? "Đóng menu quản trị" : "Mở menu quản trị"}
                >
                    <i className="bi bi-list"></i>
                </button>
                <Link className="admin-topbar__brand" to="/admin">
                    <span className="admin-topbar__brand-mark"><i className="bi bi-laptop"></i></span>
                    <span>ZUHOT <span className="admin-topbar__brand-accent">ADMIN</span></span>
                </Link>
            </div>

            <div className="admin-topbar__actions">
                <span className="admin-topbar__status">
                    <span></span> Hệ thống quản trị
                </span>
                <Link className="admin-topbar__store-link" to="/">
                    <i className="bi bi-box-arrow-up-right"></i> Trang bán hàng
                </Link>
                <button className="admin-topbar__logout" type="button" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
