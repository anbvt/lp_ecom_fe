import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import { Link, useNavigate } from 'react-router-dom';
import "./index.css";
const Navbar = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cookie, setCookie, removeCookie] = useCookies(['user', 'admin']);

    const navigate = useNavigate();
    useEffect(() => {
        if (window.location.pathname.includes("cart")) {
            checkLogin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookie]);

    const checkLogin = () => {
        if (cookie.user == null || cookie.user === undefined) {
            navigate("/login");
        }
    }
    const logout = () => {
        removeCookie("user");
        removeCookie("admin");
    }
    return (
        <div className="navAll">
            {/* ===== MAIN NAV ===== */}
            <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
                <div className="container">

                    {/* Logo */}
                    <Link className="navbar-brand fw-bold fs-4" to="/">
                        <i className="fa-solid fa-shop me-2"></i> Zu Hot
                    </Link>

                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNav">

                        {/* Search */}
                        <div className="mx-auto my-3 my-lg-0" style={{ maxWidth: "500px", width: "100%" }}>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search products..." />
                                <button className="btn btn-dark">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>

                        {/* Right menu */}
                        <ul className="navbar-nav ms-auto align-items-lg-center">

                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/search">
                                    Products
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link onClick={checkLogin} className="nav-link fw-bold" to="/cart">
                                    <i className="bi bi-cart3 me-1"></i> Giỏ hàng
                                </Link>
                            </li>

                            {/* User dropdown */}
                            <li className="nav-item dropdown">
                                <button className="nav-link dropdown-toggle fw-bold" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle me-1"></i>
                                    {cookie.user?.fullname || "Tài khoản"}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end">

                                    {!cookie.user && (
                                        <li>
                                            <Link className="dropdown-item" to="/login">
                                                Đăng nhập
                                            </Link>
                                        </li>
                                    )}

                                    {cookie.user && (
                                        <>
                                            <li>
                                                <Link className="dropdown-item" to="/my-account">
                                                    Tài khoản của tôi
                                                </Link>
                                            </li>

                                            {cookie.user.admin === true && (
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        to={cookie.admin ? "/admin" : "/admin/login"}
                                                    >
                                                        Admin Panel
                                                    </Link>
                                                </li>
                                            )}

                                            <li>
                                                <button className="dropdown-item text-danger" onClick={logout}>
                                                    Đăng xuất
                                                </button>
                                            </li>
                                        </>
                                    )}

                                </ul>
                            </li>

                        </ul>

                    </div>
                </div>
            </nav>

        </div>
    );
}
export default Navbar;