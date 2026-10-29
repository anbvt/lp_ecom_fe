import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import UserLayout from "src/components/Layout/UserLayout";
import { useFetch } from "src/util/CustomHook";
import OrderItem from "./OrderItem";
import "./index.css";

interface AccountOrder {
    id: number;
    status?: number;
    [key: string]: any;
}

const MyAccount = () => {
    const navigate = useNavigate();
    const [cookie] = useCookies(["user"]);
    const [orders, setOrders] = useState<AccountOrder[]>([]);
    const [pendingOrders, setPendingOrders] = useState<AccountOrder[]>([]);
    const [shippingOrders, setShippingOrders] = useState<AccountOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = cookie.user?.id;
        if (userId == null) {
            navigate("/login");
            return;
        }

        let active = true;
        const loadAccountOrders = async () => {
            setIsLoading(true);
            setError("");

            try {
                const [allResult, pendingResult, shippingResult] = await Promise.all([
                    useFetch.get<AccountOrder[]>("/api/order", { params: { userId } }),
                    useFetch.get<AccountOrder[]>("/api/order/fillOrdersByStatus", {
                        params: { userId, status: 0 },
                    }),
                    useFetch.get<AccountOrder[]>("/api/order/fillOrdersByStatus", {
                        params: { userId, status: 1 },
                    }),
                ]);

                if (active) {
                    setOrders(allResult.data ?? []);
                    setPendingOrders(pendingResult.data ?? []);
                    setShippingOrders(shippingResult.data ?? []);
                }
            } catch (requestError) {
                console.error("Failed to load account orders:", requestError);
                if (active) {
                    setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadAccountOrders();
        return () => {
            active = false;
        };
    }, [cookie.user, navigate]);

    const initials = cookie.user?.fullname
        ?.trim()
        .split(/\s+/)
        .slice(-2)
        .map((part: string) => part.charAt(0))
        .join("")
        .toUpperCase() || "ZH";

    const renderOrders = (items: AccountOrder[], emptyMessage: string) => {
        if (isLoading) {
            return (
                <div className="account-state" role="status">
                    <span className="account-state__icon"><i className="bi bi-arrow-repeat"></i></span>
                    <p>Đang tải đơn hàng...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="account-state account-state--error" role="alert">
                    <span className="account-state__icon"><i className="bi bi-exclamation-circle"></i></span>
                    <p>{error}</p>
                </div>
            );
        }

        if (items.length === 0) {
            return (
                <div className="account-state">
                    <span className="account-state__icon"><i className="bi bi-box-seam"></i></span>
                    <p>{emptyMessage}</p>
                    <Link to="/search">Khám phá sản phẩm <i className="bi bi-arrow-right"></i></Link>
                </div>
            );
        }

        return (
            <div className="account-order-list">
                {items.map((order) => <OrderItem key={order.id} object={order} />)}
            </div>
        );
    };

    return (
        <UserLayout>
            <main className="account-page">
                <div className="account-shell">
                    <div className="account-heading">
                        <div>
                            <p className="account-eyebrow">TÀI KHOẢN CỦA BẠN</p>
                            <h1>Xin chào, {cookie.user?.fullname || "bạn"}!</h1>
                            <p className="account-heading__description">
                                Theo dõi thông tin và tình trạng các đơn hàng của bạn.
                            </p>
                        </div>
                        <Link className="account-heading__link" to="/">
                            <i className="bi bi-arrow-left"></i> Tiếp tục mua sắm
                        </Link>
                    </div>

                    <section className="account-profile" aria-label="Thông tin tài khoản">
                        <div className="account-profile__identity">
                            <div className="account-avatar" aria-hidden="true">{initials}</div>
                            <div className="account-profile__details">
                                <span className="account-profile__label">TÀI KHOẢN KHÁCH HÀNG</span>
                                <h2>{cookie.user?.fullname || "Khách hàng"}</h2>
                                <p><i className="bi bi-telephone"></i> {cookie.user?.phone || "Chưa cập nhật số điện thoại"}</p>
                            </div>
                        </div>
                        <div className="account-profile__summary">
                            <span className="account-profile__summary-icon"><i className="bi bi-receipt"></i></span>
                            <div>
                                <strong>{isLoading ? "—" : orders.length}</strong>
                                <span>Tổng đơn hàng</span>
                            </div>
                        </div>
                    </section>

                    <section className="account-orders" aria-labelledby="account-orders-title">
                        <div className="account-orders__heading">
                            <div>
                                <h2 id="account-orders-title">Đơn hàng của tôi</h2>
                                <p>Theo dõi tiến trình giao hàng và xem lại đơn hàng.</p>
                            </div>
                            <span className="account-orders__count">
                                {isLoading ? "Đang cập nhật" : `${orders.length} đơn hàng`}
                            </span>
                        </div>

                        <Tabs className="account-tabs">
                            <TabList className="account-tabs__list">
                                <Tab>Đang xử lý <span>{pendingOrders.length}</span></Tab>
                                <Tab>Đang giao <span>{shippingOrders.length}</span></Tab>
                                <Tab>Đã giao</Tab>
                            </TabList>

                            <TabPanel className="account-tabs__panel">
                                {renderOrders(pendingOrders, "Bạn chưa có đơn hàng đang xử lý.")}
                            </TabPanel>
                            <TabPanel className="account-tabs__panel">
                                {renderOrders(shippingOrders, "Bạn chưa có đơn hàng đang giao.")}
                            </TabPanel>
                            <TabPanel className="account-tabs__panel">
                                <div className="account-state">
                                    <span className="account-state__icon"><i className="bi bi-box-seam"></i></span>
                                    <p>Đơn hàng đã giao sẽ được hiển thị tại đây.</p>
                                    <Link to="/search">Khám phá sản phẩm <i className="bi bi-arrow-right"></i></Link>
                                </div>
                            </TabPanel>
                        </Tabs>
                    </section>
                </div>
            </main>
        </UserLayout>
    );
};

export default MyAccount;
