import { useState } from "react";
import { formatter } from "src/util/formatCurrency";

const formatOrderDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value || "Chưa có thông tin";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};

const ProductItem = ({ object, quantity }: any) => (
    <div className="account-order-product">
        <div className="account-order-product__image">
            {object.logo
                ? <img src={object.logo} alt={object.name || "Sản phẩm"} />
                : <i className="bi bi-laptop" aria-hidden="true"></i>}
        </div>
        <div className="account-order-product__info">
            <strong>{object.name || "Sản phẩm"}</strong>
            <span>
                {[
                    object.color?.name,
                    object.ram && `RAM ${object.ram}`,
                    object.rom && `Ổ cứng ${object.rom}`,
                ].filter(Boolean).join(" · ") || "Thông tin sản phẩm"}
            </span>
        </div>
        <div className="account-order-product__quantity">SL: {quantity}</div>
        <strong className="account-order-product__price">
            {formatter.format((object.price || 0) * quantity)}
        </strong>
    </div>
);

const OrderItem = ({ object }: any) => {
    const [show, setShow] = useState(false);
    const details = object.order_details ?? [];

    return (
        <article className="account-order">
            <div className="account-order__header">
                <div className="account-order__meta">
                    <span className="account-order__id">Đơn hàng #{object.id}</span>
                    <span className="account-order__date">
                        <i className="bi bi-calendar3"></i> {formatOrderDate(object.buyDate)}
                    </span>
                </div>
                <button
                    type="button"
                    className="account-order__toggle"
                    onClick={() => setShow((current) => !current)}
                    aria-expanded={show}
                >
                    {show ? "Thu gọn" : "Chi tiết"}
                    <i className={`bi ${show ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </button>
            </div>

            {show && (
                <div className="account-order__products">
                    {details.length > 0
                        ? details.map((item: any, index: number) => (
                            <ProductItem
                                key={item.id ?? item.orderid ?? `${object.id}-${index}`}
                                object={item.product ?? {}}
                                quantity={item.quantity ?? 0}
                            />
                        ))
                        : <p className="account-order__empty">Đơn hàng chưa có thông tin sản phẩm.</p>}
                </div>
            )}

            <div className="account-order__footer">
                <span><i className="bi bi-geo-alt"></i> Địa chỉ nhận hàng</span>
                <strong>{object.place || "Chưa cập nhật địa chỉ"}</strong>
            </div>
        </article>
    );
};

export default OrderItem;
