import { useEffect, useState } from "react";
import { notification } from "antd";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "src/common/model/Product";
import UserLayout from "src/components/Layout/UserLayout";
import { useFetch, useQuery } from "src/util/CustomHook";
import { formatter } from "src/util/formatCurrency";
import "./DetailProduct.css";

const DetailProduct = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [cookie] = useCookies(["user"]);
  const [data, setData] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const productId = useQuery().get("id");

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError("");
      setData(null);

      if (!productId) {
        setError("Không tìm thấy mã sản phẩm.");
        setIsLoading(false);
        return;
      }

      try {
        const { data: result } = await useFetch.get<Product>(`/api/product/${productId}`);
        if (active) {
          if (result) {
            setData(result);
          } else {
            setError("Không tìm thấy sản phẩm này.");
          }
        }
      } catch (requestError) {
        console.error("Failed to load product details:", requestError);
        if (active) {
          setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [productId, retryCount]);

  const handleAddToCart = async () => {
    if (!cookie.user?.id) {
      navigate("/login");
      return;
    }

    if (!productId || !data || isAdding) {
      return;
    }

    setIsAdding(true);
    try {
      const { data: result } = await useFetch.post("/api/cart/save", {
        productId,
        quantity,
        userId: cookie.user.id,
      });

      if (result === 0) {
        navigate("/cart");
      } else {
        api.error({ message: "Chưa thể thêm sản phẩm vào giỏ hàng." });
      }
    } catch (requestError) {
      console.error("Failed to add product to cart:", requestError);
      api.error({
        message: "Không thể thêm sản phẩm vào giỏ hàng.",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const updateQuantity = (value: number) => {
    if (Number.isFinite(value)) {
      setQuantity(Math.max(1, Math.floor(value)));
    }
  };

  return (
    <UserLayout>
      {contextHolder}
      <main className="product-detail-page">
        <div className="product-detail-shell">
          <nav className="product-breadcrumb" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
            <Link to="/search">Sản phẩm</Link>
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
            <span aria-current="page">{data?.name || "Chi tiết sản phẩm"}</span>
          </nav>

          {isLoading ? (
            <section className="product-detail-state" role="status" aria-busy="true">
              <span className="product-detail-state__icon">
                <i className="bi bi-arrow-repeat" aria-hidden="true"></i>
              </span>
              <p>Đang tải thông tin sản phẩm...</p>
            </section>
          ) : error ? (
            <section className="product-detail-state product-detail-state--error" role="alert">
              <span className="product-detail-state__icon">
                <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
              </span>
              <p>{error}</p>
              {productId && (
                <button
                  type="button"
                  className="product-detail-retry"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Thử lại
                </button>
              )}
            </section>
          ) : data ? (
            <>
              <section className="product-detail-card" aria-labelledby="product-name">
                <div className="product-detail-image">
                  {data.logo ? (
                    <img src={data.logo} alt={data.name} />
                  ) : (
                    <i className="bi bi-laptop" aria-hidden="true"></i>
                  )}
                  <span className="product-detail-image__label">
                    <i className="bi bi-patch-check" aria-hidden="true"></i>
                    Laptop chính hãng
                  </span>
                </div>

                <div className="product-detail-info">
                  <p className="product-detail-eyebrow">ZUHOT LAPTOP</p>
                  <h1 id="product-name">{data.name}</h1>
                  <p className="product-detail-intro">
                    Thông tin cấu hình rõ ràng, giúp bạn chọn thiết bị phù hợp với nhu cầu.
                  </p>

                  <div className="product-detail-price" aria-label={`Giá ${formatter.format(data.price)}`}>
                    {formatter.format(data.price)}
                  </div>

                  <div className="product-detail-highlights" aria-label="Cấu hình nổi bật">
                    {[data.ram, data.rom, data.screen].filter(Boolean).map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </div>

                  <div className="product-detail-purchase">
                    <div className="product-quantity">
                      <label htmlFor="product-quantity">Số lượng</label>
                      <div className="product-quantity__control">
                        <button
                          type="button"
                          aria-label="Giảm số lượng"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(quantity - 1)}
                        >
                          <i className="bi bi-dash" aria-hidden="true"></i>
                        </button>
                        <input
                          id="product-quantity"
                          type="number"
                          min={1}
                          step={1}
                          value={quantity}
                          onChange={(event) => updateQuantity(Number(event.target.value))}
                        />
                        <button
                          type="button"
                          aria-label="Tăng số lượng"
                          onClick={() => updateQuantity(quantity + 1)}
                        >
                          <i className="bi bi-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="product-add-button"
                      onClick={handleAddToCart}
                      disabled={isAdding}
                    >
                      <i className={`bi ${isAdding ? "bi-arrow-repeat" : "bi-bag-plus"}`} aria-hidden="true"></i>
                      {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                    </button>
                  </div>

                  <div className="product-detail-assurance">
                    <span><i className="bi bi-shield-check" aria-hidden="true"></i> Sản phẩm chính hãng</span>
                    <span><i className="bi bi-headset" aria-hidden="true"></i> Hỗ trợ tư vấn</span>
                  </div>
                </div>
              </section>

              <section className="product-specifications" aria-labelledby="product-specifications-title">
                <div>
                  <p className="product-detail-eyebrow">THÔNG SỐ CHI TIẾT</p>
                  <h2 id="product-specifications-title">Cấu hình sản phẩm</h2>
                </div>
                <dl>
                  <div><dt>RAM</dt><dd>{data.ram || "Đang cập nhật"}</dd></div>
                  <div><dt>Bộ nhớ</dt><dd>{data.rom || "Đang cập nhật"}</dd></div>
                  <div><dt>Màn hình</dt><dd>{data.screen || "Đang cập nhật"}</dd></div>
                  <div><dt>Hệ điều hành</dt><dd>{data.os || "Đang cập nhật"}</dd></div>
                </dl>
              </section>
            </>
          ) : null}
        </div>
      </main>
    </UserLayout>
  );
};

export default DetailProduct;
