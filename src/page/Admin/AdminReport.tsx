import { FormEvent, useEffect, useMemo, useState } from "react";
import { useFetch } from "src/util/CustomHook";
import Customer from "src/common/model/Customer";
import { Product } from "src/common/model/Product";
import { ProductReport } from "src/common/model/ProductReport";
import "./AdminReport.css";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const AdminReport = () => {
  const [sales, setSales] = useState<ProductReport[]>([]);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedRange, setAppliedRange] = useState({ startDate: "", endDate: "" });
  const [isSalesLoading, setIsSalesLoading] = useState(true);
  const [isRankingLoading, setIsRankingLoading] = useState(true);
  const [salesError, setSalesError] = useState("");
  const [rankingError, setRankingError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchSales = async () => {
      setIsSalesLoading(true);
      setSalesError("");
      try {
        const params = new URLSearchParams({
          startDate: appliedRange.startDate,
          endDate: appliedRange.endDate,
        });
        const { data } = await useFetch.get<ProductReport[]>(
          `/api/order-detail/products-sold?${params.toString()}`
        );
        if (active) {
          setSales(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        console.error("Failed to load sales report:", requestError);
        if (active) {
          setSalesError("Không thể tải báo cáo bán hàng. Vui lòng thử lại.");
        }
      } finally {
        if (active) {
          setIsSalesLoading(false);
        }
      }
    };

    fetchSales();
    return () => {
      active = false;
    };
  }, [appliedRange]);

  useEffect(() => {
    let active = true;
    const fetchRankings = async () => {
      setIsRankingLoading(true);
      setRankingError("");
      try {
        const [customerResponse, productResponse] = await Promise.all([
          useFetch.get<Customer[]>("/api/users/customers-buy-most-in-month"),
          useFetch.get<Product[]>("/api/products-buy-most-in-month"),
        ]);
        if (active) {
          setTopCustomers(Array.isArray(customerResponse.data) ? customerResponse.data : []);
          setTopProducts(Array.isArray(productResponse.data) ? productResponse.data : []);
        }
      } catch (requestError) {
        console.error("Failed to load monthly rankings:", requestError);
        if (active) {
          setRankingError("Không thể tải bảng xếp hạng tháng này.");
        }
      } finally {
        if (active) {
          setIsRankingLoading(false);
        }
      }
    };

    fetchRankings();
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => ({
    quantity: sales.reduce((total, item) => total + (item.totalQuantity || 0), 0),
    revenue: sales.reduce((total, item) => total + (item.totalPrice || 0), 0),
  }), [sales]);

  const handleApplyDates = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (startDate && endDate && startDate > endDate) {
      setSalesError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }
    setAppliedRange({ startDate, endDate });
  };

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
    setAppliedRange({ startDate: "", endDate: "" });
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">TRUNG TÂM ĐIỀU HÀNH</p>
          <h1>Tổng quan</h1>
          <p className="dashboard-heading__description">
            Theo dõi tình hình kinh doanh và hoạt động của cửa hàng.
          </p>
        </div>
        <div className="dashboard-heading__date">
          <i className="bi bi-calendar3"></i>
          {new Intl.DateTimeFormat("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Thống kê bán hàng">
        <article className="dashboard-stat">
          <div className="dashboard-stat__top">
            <span className="dashboard-stat__icon dashboard-stat__icon--purple">
              <i className="bi bi-currency-exchange"></i>
            </span>
            <span className="dashboard-stat__caption">Theo khoảng ngày đã chọn</span>
          </div>
          <span className="dashboard-stat__label">Tổng doanh thu</span>
          <strong className="dashboard-stat__value">
            {isSalesLoading ? "—" : currencyFormatter.format(summary.revenue)}
          </strong>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat__top">
            <span className="dashboard-stat__icon dashboard-stat__icon--blue">
              <i className="bi bi-box-seam"></i>
            </span>
            <span className="dashboard-stat__caption">Theo khoảng ngày đã chọn</span>
          </div>
          <span className="dashboard-stat__label">Sản phẩm đã bán</span>
          <strong className="dashboard-stat__value">
            {isSalesLoading ? "—" : summary.quantity.toLocaleString("vi-VN")}
            {!isSalesLoading && <small> sản phẩm</small>}
          </strong>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat__top">
            <span className="dashboard-stat__icon dashboard-stat__icon--green">
              <i className="bi bi-laptop"></i>
            </span>
            <span className="dashboard-stat__caption">Trong kỳ báo cáo</span>
          </div>
          <span className="dashboard-stat__label">Mặt hàng đã phát sinh</span>
          <strong className="dashboard-stat__value">
            {isSalesLoading ? "—" : sales.length}
            {!isSalesLoading && <small> mặt hàng</small>}
          </strong>
        </article>
        <article className="dashboard-stat">
          <div className="dashboard-stat__top">
            <span className="dashboard-stat__icon dashboard-stat__icon--orange">
              <i className="bi bi-people"></i>
            </span>
            <span className="dashboard-stat__caption">Xếp hạng tháng này</span>
          </div>
          <span className="dashboard-stat__label">Khách hàng nổi bật</span>
          <strong className="dashboard-stat__value">
            {isRankingLoading ? "—" : topCustomers.length}
            {!isRankingLoading && <small> khách hàng</small>}
          </strong>
        </article>
      </section>

      <section className="dashboard-panel dashboard-report">
        <div className="dashboard-panel__heading">
          <div>
            <span className="dashboard-section-tag">BÁO CÁO</span>
            <h2>Sản phẩm đã bán</h2>
            <p>Thống kê số lượng và doanh thu theo từng sản phẩm.</p>
          </div>
          <span className="dashboard-panel__count">
            {isSalesLoading ? "Đang tải..." : `${sales.length} mặt hàng`}
          </span>
        </div>

        <form className="dashboard-date-filter" onSubmit={handleApplyDates}>
          <label>
            <span>Từ ngày</span>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label>
            <span>Đến ngày</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
          <button type="submit" className="dashboard-button">
            <i className="bi bi-funnel"></i> Lọc báo cáo
          </button>
          <button type="button" className="dashboard-button dashboard-button--secondary" onClick={handleResetDates}>
            Đặt lại
          </button>
        </form>

        {salesError ? (
          <div className="dashboard-inline-state dashboard-inline-state--error" role="alert">
            <i className="bi bi-exclamation-circle"></i> {salesError}
          </div>
        ) : isSalesLoading ? (
          <div className="dashboard-inline-state" role="status">
            <i className="bi bi-arrow-repeat"></i> Đang tải báo cáo bán hàng...
          </div>
        ) : sales.length === 0 ? (
          <div className="dashboard-inline-state">
            <i className="bi bi-inbox"></i> Không có dữ liệu bán hàng trong khoảng thời gian này.
          </div>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Mã</th>
                  <th className="dashboard-table__number">Đã bán</th>
                  <th className="dashboard-table__number">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <div className="dashboard-product-cell">
                        <div className="dashboard-product-cell__image">
                          {item.productLogo
                            ? <img src={item.productLogo} alt={item.productName} />
                            : <i className="bi bi-laptop"></i>}
                        </div>
                        <strong>{item.productName}</strong>
                      </div>
                    </td>
                    <td className="dashboard-table__muted">#{item.productId}</td>
                    <td className="dashboard-table__number">{item.totalQuantity.toLocaleString("vi-VN")}</td>
                    <td className="dashboard-table__number dashboard-table__revenue">
                      {currencyFormatter.format(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Tổng cộng</td>
                  <td className="dashboard-table__number">{summary.quantity.toLocaleString("vi-VN")}</td>
                  <td className="dashboard-table__number">{currencyFormatter.format(summary.revenue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-ranking-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel__heading">
            <div>
              <span className="dashboard-section-tag">THÁNG NÀY</span>
              <h2>Sản phẩm bán chạy</h2>
            </div>
            <span className="dashboard-ranking-icon dashboard-ranking-icon--blue">
              <i className="bi bi-trophy"></i>
            </span>
          </div>
          {rankingError ? (
            <div className="dashboard-inline-state dashboard-inline-state--error">{rankingError}</div>
          ) : isRankingLoading ? (
            <div className="dashboard-inline-state" role="status">Đang tải xếp hạng...</div>
          ) : topProducts.length === 0 ? (
            <div className="dashboard-inline-state">Chưa có dữ liệu sản phẩm bán chạy.</div>
          ) : (
            <ol className="dashboard-ranking-list">
              {topProducts.slice(0, 5).map((product, index) => (
                <li key={product.id}>
                  <span className={`dashboard-ranking-list__rank${index === 0 ? " dashboard-ranking-list__rank--top" : ""}`}>
                    {index + 1}
                  </span>
                  <div className="dashboard-ranking-list__image">
                    {product.logo ? <img src={product.logo} alt="" /> : <i className="bi bi-laptop"></i>}
                  </div>
                  <div className="dashboard-ranking-list__info">
                    <strong>{product.name}</strong>
                    <span>{product.ram ? `RAM ${product.ram}` : "Sản phẩm laptop"}</span>
                  </div>
                  <i className="bi bi-arrow-up-right dashboard-ranking-list__arrow"></i>
                </li>
              ))}
            </ol>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__heading">
            <div>
              <span className="dashboard-section-tag">THÁNG NÀY</span>
              <h2>Khách hàng thân thiết</h2>
            </div>
            <span className="dashboard-ranking-icon dashboard-ranking-icon--orange">
              <i className="bi bi-stars"></i>
            </span>
          </div>
          {rankingError ? (
            <div className="dashboard-inline-state dashboard-inline-state--error">{rankingError}</div>
          ) : isRankingLoading ? (
            <div className="dashboard-inline-state" role="status">Đang tải xếp hạng...</div>
          ) : topCustomers.length === 0 ? (
            <div className="dashboard-inline-state">Chưa có dữ liệu khách hàng trong tháng này.</div>
          ) : (
            <ol className="dashboard-ranking-list dashboard-ranking-list--customers">
              {topCustomers.slice(0, 5).map((customer, index) => (
                <li key={customer.id}>
                  <span className={`dashboard-ranking-list__rank${index === 0 ? " dashboard-ranking-list__rank--top" : ""}`}>
                    {index + 1}
                  </span>
                  <span className="dashboard-customer-avatar">
                    {customer.fullname?.trim().split(/\s+/).slice(-1)[0]?.slice(0, 1).toUpperCase() || "K"}
                  </span>
                  <div className="dashboard-ranking-list__info">
                    <strong>{customer.fullname || "Khách hàng"}</strong>
                    <span>{customer.phone || customer.email || "Khách hàng ZUHOT"}</span>
                  </div>
                  <i className="bi bi-person-check dashboard-ranking-list__arrow"></i>
                </li>
              ))}
            </ol>
          )}
        </article>
      </section>
    </div>
  );
};

export default AdminReport;
