import { useEffect, useState } from "react";
import {
  AiFillFastBackward,
  AiFillFastForward,
  AiFillForward,
  AiOutlineBackward,
} from "react-icons/ai";
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { Product } from "src/common/model/Product";
import Card from "src/components/Card";
import Carousel from "src/components/Carousel";
import UserLayout from "src/components/Layout/UserLayout";
import { useFetch } from "src/util/CustomHook";
import { Col, Row } from "react-bootstrap";
import "./Home.css";

interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements?: number;
}

const Home = () => {
  const [data, setData] = useState<ProductPage | null>(null);
  const [page, setPage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const { data: result } = await useFetch.get<ProductPage>(
          `/api/products?p=${page}`
        );
        if (active) {
          setData(result);
        }
      } catch (requestError) {
        console.error("Failed to load homepage products:", requestError);
        if (active) {
          setError("Chưa thể tải danh sách sản phẩm. Vui lòng thử lại.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [page, retryCount]);

  const lastPage = Math.max((data?.totalPages ?? 1) - 1, 0);

  return (
    <UserLayout>
      <main className="home-page">
        <div className="home-shell">
          <Carousel />

          <section className="home-benefits" aria-label="Lợi ích mua sắm">
            <div className="home-benefit">
              <span className="home-benefit__icon"><i className="bi bi-patch-check"></i></span>
              <span><strong>Chính hãng an tâm</strong><small>Thông tin sản phẩm rõ ràng</small></span>
            </div>
            <div className="home-benefit">
              <span className="home-benefit__icon"><i className="bi bi-chat-dots"></i></span>
              <span><strong>Tư vấn đúng nhu cầu</strong><small>Dễ dàng tìm lựa chọn phù hợp</small></span>
            </div>
            <div className="home-benefit">
              <span className="home-benefit__icon"><i className="bi bi-lightning-charge"></i></span>
              <span><strong>Cập nhật sản phẩm mới</strong><small>Khám phá công nghệ mới nhất</small></span>
            </div>
          </section>

          <section className="home-products" id="featured-products">
            <div className="home-products__heading">
              <div>
                <p className="home-section-eyebrow">LỰA CHỌN DÀNH CHO BẠN</p>
                <h2>Sản phẩm nổi bật</h2>
                <p className="home-products__description">
                  Tìm chiếc laptop đồng hành cùng công việc và đam mê của bạn.
                </p>
              </div>
              <Link className="home-products__all" to="/search">
                Xem tất cả <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {loading ? (
              <div className="home-products__state" role="status">
                <SyncLoader color="#2563eb" size={9} />
                <span>Đang tải sản phẩm...</span>
              </div>
            ) : error ? (
              <div className="home-products__state home-products__state--error" role="alert">
                <p>{error}</p>
                <button
                  type="button"
                  className="home-retry-button"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Thử lại
                </button>
              </div>
            ) : data?.content?.length ? (
              <>
                <Row className="g-4">
                  {data.content.map((product) => (
                    <Col key={product.id} xs={12} sm={6} xl={3}>
                      <Card id={product.id} className="home-product-card" data={product} />
                    </Col>
                  ))}
                </Row>

                {data.totalPages > 1 && (
                  <nav className="home-pagination" aria-label="Phân trang sản phẩm">
                    <button
                      type="button"
                      aria-label="Trang đầu"
                      disabled={page === 0}
                      onClick={() => setPage(0)}
                    >
                      <AiFillFastBackward />
                    </button>
                    <button
                      type="button"
                      aria-label="Trang trước"
                      disabled={page === 0}
                      onClick={() => setPage((current) => Math.max(current - 1, 0))}
                    >
                      <AiOutlineBackward />
                    </button>
                    <span>
                      {page + 1} <span className="home-pagination__total">/ {data.totalPages}</span>
                    </span>
                    <button
                      type="button"
                      aria-label="Trang tiếp theo"
                      disabled={page >= lastPage}
                      onClick={() => setPage((current) => Math.min(current + 1, lastPage))}
                    >
                      <AiFillForward />
                    </button>
                    <button
                      type="button"
                      aria-label="Trang cuối"
                      disabled={page >= lastPage}
                      onClick={() => setPage(lastPage)}
                    >
                      <AiFillFastForward />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="home-products__state">
                <span>Hiện chưa có sản phẩm để hiển thị.</span>
              </div>
            )}
          </section>
        </div>
      </main>
    </UserLayout>
  );
};

export default Home;
