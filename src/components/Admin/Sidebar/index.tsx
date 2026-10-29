import { Link, useLocation } from "react-router-dom";
import "./index.css";

interface SideBarProps {
    isOpen: boolean;
    onNavigate: () => void;
}

const navigationItems = [
    { to: "/admin", label: "Tổng quan", icon: "bi-grid-1x2" },
    { to: "/admin/order", label: "Đơn hàng", icon: "bi-receipt" },
    { to: "/admin/product", label: "Sản phẩm", icon: "bi-laptop" },
    { to: "/admin/brands", label: "Thương hiệu", icon: "bi-tags" },
    { to: "/admin/customer", label: "Khách hàng", icon: "bi-people" },
];

const SideBar = ({ isOpen, onNavigate }: SideBarProps) => {
    const location = useLocation();

    return (
        <>
            {isOpen && (
                <button
                    className="admin-menu-backdrop"
                    type="button"
                    onClick={onNavigate}
                    aria-label="Đóng menu quản trị"
                />
            )}
            <aside className={`admin-sidebar${isOpen ? " admin-sidebar--open" : ""}`}>
                <div className="admin-sidebar__section-label">MENU QUẢN LÝ</div>
                <nav aria-label="Điều hướng quản trị">
                    <ul className="admin-sidebar__nav">
                        {navigationItems.map((item) => {
                            const isActive = item.to === "/admin"
                                ? location.pathname === item.to || location.pathname === "/admin/report"
                                : location.pathname.startsWith(item.to);

                            return (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        onClick={onNavigate}
                                        className={`admin-sidebar__link${isActive ? " admin-sidebar__link--active" : ""}`}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <i className={`bi ${item.icon}`}></i>
                                        <span>{item.label}</span>
                                        {isActive && <span className="admin-sidebar__active-indicator"></span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="admin-sidebar__bottom">
                    <div className="admin-sidebar__help-icon"><i className="bi bi-headset"></i></div>
                    <strong>Cần hỗ trợ?</strong>
                    <p>Liên hệ quản trị hệ thống nếu bạn cần trợ giúp.</p>
                    <Link to="/" onClick={onNavigate}>
                        Mở trang bán hàng <i className="bi bi-arrow-up-right"></i>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default SideBar;
