import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import { Link, useNavigate } from 'react-router-dom';
import "./index.css";
const Navbar = () => {
    const [cookie, , removeCookie] = useCookies(['user', 'admin']);

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
            <div className="site-announcement">
                <strong>ZUHOT LAPTOP</strong> <span className="mx-1">·</span> Chọn thiết bị phù hợp cho mọi hành trình
            </div>
            <nav className="navbar navbar-expand-lg sticky-top site-navbar">
                <div className="container">
                    <Link className="navbar-brand site-brand" to="/" aria-label="ZUHOT Laptop - Trang chủ">
                        <span className="site-brand__mark"><i className="bi bi-laptop"></i></span>
                        <span>ZUHOT<span className="site-brand__suffix"> LAPTOP</span></span>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNav"
                        aria-controls="mainNav"
                        aria-expanded="false"
                        aria-label="Mở menu điều hướng"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNav">
                        <Link className="header-search-link mx-lg-auto" to="/search">
                            <i className="bi bi-search"></i>
                            <span>Khám phá laptop theo nhu cầu</span>
                        </Link>
                        <ul className="navbar-nav ms-lg-auto align-items-lg-center">
                            <li className="nav-item">
                                <Link className="nav-link" to="/search">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link onClick={checkLogin} className="nav-link" to="/cart">
                                    <i className="bi bi-bag"></i> Giỏ hàng
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <button
                                    type="button"
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-person"></i>
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