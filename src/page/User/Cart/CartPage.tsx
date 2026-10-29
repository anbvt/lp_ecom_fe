import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { notification } from "antd";
import UserLayout from "src/components/Layout/UserLayout";
import { useFetch } from "src/util/CustomHook";
import { formatter } from "src/util/formatCurrency";
import "./CartPage.css";

interface CartProduct {
  id?: number;
  name: string;
  logo?: string;
  price: number;
  color?: { name?: string };
  ram?: string;
  rom?: string;
  screen?: string;
}

interface CartEntry {
  cartId: number;
  quantity: number;
  product: CartProduct;
}

const CartPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [cookie] = useCookies(["user"]);
  const [items, setItems] = useState<CartEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    if (cookie.user?.id == null) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const { data } = await useFetch.get<CartEntry[]>("/api/cart", {
        params: { userId: cookie.user.id },
      });
      setItems(data ?? []);
    } catch (requestError) {
      console.error("Failed to load cart:", requestError);
      setError("Không thể tải giỏ hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [cookie.user?.id]);

  useEffect(() => {
    if (cookie.user == null) {
      navigate("/login");
      return;
    }
    loadCart();
  }, [cookie.user, loadCart, navigate]);

  const total = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [items]
  );
  const itemCount = useMemo(
    () => (items ?? []).reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  const handleDeleteItem = async (id: number) => {
    try {
      const { data: result } = await useFetch.get(`/api/cart/${id}`);
      if (result === 1) {
        await loadCart();
        api.success({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
      } else {
        api.error({ message: "Không thể xóa sản phẩm khỏi giỏ hàng" });
      }
    } catch (requestError) {
      console.error("Failed to remove cart item:", requestError);
      api.error({ message: "Không thể xóa sản phẩm. Vui lòng thử lại." });
    }
  };

  const saveOrder = async () => {
    if (!items?.length || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: result } = await useFetch.post("/api/order/save", {
        customerId: cookie.user.id,
        place: "",
        order_details: items,
      });
      if (result === 1) {
        api.success({ message: "Tạo đơn hàng thành công" });
        window.setTimeout(() => navigate("/my-account"), 1500);
      } else {
        api.error({ message: "Chưa thể tạo đơn hàng. Vui lòng thử lại." });
        setIsSubmitting(false);
      }
    } catch (requestError) {
      console.error("Failed to create order:", requestError);
      api.error({ message: "Không thể tạo đơn hàng. Vui lòng thử lại." });
      setIsSubmitting(false);
    }
  };

  return (
    <UserLayout>
      {contextHolder}
      <main className="cart-page">
        <div className="cart-shell">
          <div className="cart-heading">
            <div>
              <p className="cart-eyebrow">MUA SẮM CỦA BẠN</p>
              <h1>Giỏ hàng</h1>
              <p className="cart-heading__description">
                Kiểm tra sản phẩm trước khi hoàn tất đơn hàng.
              </p>
            </div>
            <Link to="/search" className="cart-continue-link">
              <i className="bi bi-arrow-left"></i> Tiếp tục mua sắm
            </Link>
          </div>

          {isLoading ? (
            <section className="cart-state" role="status">
              <span className="cart-state__icon"><i className="bi bi-arrow-repeat"></i></span>
              <p>Đang tải giỏ hàng...</p>
            </section>
          ) : error ? (
            <section className="cart-state cart-state--error" role="alert">
              <span className="cart-state__icon"><i className="bi bi-exclamation-circle"></i></span>
              <p>{error}</p>
              <button type="button" className="cart-primary-button" onClick={loadCart}>
                Thử lại
              </button>
            </section>
          ) : items?.length ? (
            <div className="cart-layout">
              <section className="cart-items-panel" aria-label="Sản phẩm trong giỏ">
                <div className="cart-items-panel__heading">
                  <div>
                    <h2>Sản phẩm của bạn</h2>
                    <p>{itemCount} sản phẩm trong giỏ hàng</p>
                  </div>
                  <span className="cart-items-panel__count">{itemCount}</span>
                </div>

                <div className="cart-item-list">
                  {items.map((item, index) => (
                    <article
                      className="cart-item"
                      key={item.cartId ?? `${item.product.id ?? item.product.name}-${index}`}
                    >
                      <div className="cart-item__image">
                        {item.product.logo
                          ? <img src={item.product.logo} alt={item.product.name} />
                          : <i className="bi bi-laptop" aria-hidden="true"></i>}
                      </div>
                      <div className="cart-item__info">
                        <span className="cart-item__brand">ZUHOT LAPTOP</span>
                        <h3>{item.product.name}</h3>
                        <p>
                          {[
                            item.product.color?.name,
                            item.product.ram && `RAM ${item.product.ram}`,
                            item.product.rom && `Ổ cứng ${item.product.rom}`,
                            item.product.screen,
                          ].filter(Boolean).join(" · ") || "Sản phẩm chính hãng"}
                        </p>
                        <button
                          type="button"
                          className="cart-item__remove"
                          onClick={() => handleDeleteItem(item.cartId)}
                        >
                          <i className="bi bi-trash3"></i> Xóa sản phẩm
                        </button>
                      </div>
                      <div className="cart-item__pricing">
                        <span className="cart-item__unit-price">
                          {formatter.format(item.product.price)}
                        </span>
                        <span className="cart-item__quantity">Số lượng: {item.quantity}</span>
                        <strong>{formatter.format(item.product.price * item.quantity)}</strong>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-delivery-note">
                  <span className="cart-delivery-note__icon"><i className="bi bi-truck"></i></span>
                  <div>
                    <strong>Giao hàng tận nơi</strong>
                    <p>Phí vận chuyển sẽ được xác nhận khi hoàn tất đơn hàng.</p>
                  </div>
                </div>
              </section>

              <aside className="cart-summary" aria-label="Tóm tắt đơn hàng">
                <div className="cart-summary__heading">
                  <span className="cart-summary__icon"><i className="bi bi-receipt"></i></span>
                  <h2>Tóm tắt đơn hàng</h2>
                </div>
                <div className="cart-summary__row">
                  <span>Tạm tính ({itemCount} sản phẩm)</span>
                  <strong>{formatter.format(total)}</strong>
                </div>
                <div className="cart-summary__row">
                  <span>Vận chuyển</span>
                  <span className="cart-summary__shipping">Xác nhận sau</span>
                </div>
                <div className="cart-summary__total">
                  <span>Tổng cộng <small>(đã gồm VAT)</small></span>
                  <strong>{formatter.format(total)}</strong>
                </div>
                <button
                  type="button"
                  className="cart-primary-button cart-summary__checkout"
                  onClick={saveOrder}
                  disabled={isSubmitting || !items.length}
                >
                  {isSubmitting ? "Đang tạo đơn hàng..." : "Đặt hàng"}
                  {!isSubmitting && <i className="bi bi-arrow-right"></i>}
                </button>
                <p className="cart-summary__secure">
                  <i className="bi bi-shield-check"></i> Thông tin đơn hàng được bảo mật
                </p>
                <Link to="/search" className="cart-summary__continue">
                  <i className="bi bi-arrow-left"></i> Tiếp tục mua sắm
                </Link>
              </aside>
            </div>
          ) : (
            <section className="cart-state cart-state--empty">
              <span className="cart-state__icon"><i className="bi bi-bag"></i></span>
              <h2>Giỏ hàng đang trống</h2>
              <p>Hãy khám phá và chọn sản phẩm phù hợp với bạn.</p>
              <Link to="/search" className="cart-primary-button">
                Khám phá sản phẩm <i className="bi bi-arrow-right"></i>
              </Link>
            </section>
          )}
        </div>
      </main>
    </UserLayout>
  );
};

export default CartPage;
