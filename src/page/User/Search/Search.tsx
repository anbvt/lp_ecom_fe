import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AiFillFastBackward,
  AiFillFastForward,
  AiFillForward,
  AiOutlineBackward,
} from "react-icons/ai";
import { findBy_Brands_Products } from "src/api/SearchPage/route";
import { Brand } from "src/common/model/Brand";
import { Product } from "src/common/model/Product";
import { ProductFilter } from "src/common/types/ProductFilterProps";
import SelectInput from "src/components/Select";
import Card from "src/components/Card";
import UserLayout from "src/components/Layout/UserLayout";
import { useFetch } from "src/util/CustomHook";
import { SyncLoader } from "react-spinners";
import "./index.css";

interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements?: number;
}

interface SearchData {
  brands: Brand[];
}

const RAM_OPTIONS = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const ROM_OPTIONS = ["256GB", "512GB", "1TB", "2TB"];
const DISPLAY_OPTIONS = ["13.3 inch", "14 inch", "15.6 inch"];
const OS_OPTIONS = ["Windows 11", "macOS Big Sur"];

const Search = () => {
  const [products, setProducts] = useState<ProductPage | null>(null);
  const [data, setData] = useState<SearchData>({ brands: [] });
  const [filter, setFilter] = useState<Product[] | null>(null);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm<ProductFilter>({
    defaultValues: {
      brandid: null,
      ram: null,
      rom: null,
      display: null,
      os: null,
    },
  });

  // Fetch products and brands
  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await findBy_Brands_Products(page);

        if (!active) return;

        setData({
          brands: result.brands ?? [],
        });

        setProducts(result.products);
      } catch (err) {
        console.error("Failed to load products:", err);

        if (active) {
          setError("Không thể tải sản phẩm. Vui lòng thử lại.");
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
  }, [page]);

  // Filter products
  const onSubmit: SubmitHandler<ProductFilter> = async (values) => {
    setFilterLoading(true);
    setError("");

    const filterData = {
      ...values,
      brandid: values.brandid || null,
      display: values.display || null,
      os: values.os || null,
      ram: values.ram || null,
      rom: values.rom || null,
    };

    try {
      const response = await useFetch.post("/api/products/filter", filterData);

      setFilter(response.data);
    } catch (err) {
      console.error("Failed to filter products:", err);
      setError("Không thể lọc sản phẩm. Vui lòng thử lại.");
      setFilter(null);
    } finally {
      setFilterLoading(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    reset();
    setFilter(null);
    setError("");
    setPage(0);
  };

  const displayedProducts =
    filter !== null ? filter : (products?.content ?? []);

  const isFiltering = filter !== null;

  return (
    <UserLayout>
      <main className="bg-light min-vh-100 py-4 py-lg-5">
        <div className="container">
          {/* Page heading */}
          <div className="mb-4">
            <p className="text-primary fw-semibold text-uppercase small mb-2">
              ZUHOT LAPTOP
            </p>

            <h1 className="h2 fw-bold mb-2">Tìm laptop phù hợp</h1>

            <p className="text-secondary mb-0">
              Khám phá bộ sưu tập và chọn thiết bị phù hợp với nhu cầu của bạn.
            </p>
          </div>

          <div className="row g-4">
            {/* Filter sidebar */}

            {/* FILTER SIDEBAR */}
            <aside className="col-lg-3" aria-label="Lọc sản phẩm">
              <div className="laptop-filter">
                <div className="laptop-filter__header">
                  <div className="d-flex align-items-center gap-3">
                    <div className="laptop-filter__icon">
                      <i className="bi bi-sliders"></i>
                    </div>

                    <div>
                      <h2 className="laptop-filter__title">Lọc sản phẩm</h2>
                      <p className="laptop-filter__subtitle mb-0">
                        Chọn cấu hình phù hợp với bạn
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="laptop-filter__clear"
                    onClick={handleReset}
                  >
                    Xóa bộ lọc
                  </button>
                </div>

                <div className="laptop-filter__divider"></div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="laptop-filter__form"
                >
                  <div className="laptop-filter__group">
                    <label className="laptop-filter__label" htmlFor="brand">
                      <i className="bi bi-tag me-2"></i>
                      Thương hiệu
                    </label>

                    <SelectInput
                      id="brand"
                      name="brand"
                      register={register("brandid")}
                      defaultValue=""
                      options={data.brands.map((brand, index) => ({
                        value: index + 1,
                        label: brand.name,
                      }))}
                      className=""
                    />
                  </div>

                  <div className="laptop-filter__group">
                    <label className="laptop-filter__label" htmlFor="ram">
                      <i className="bi bi-memory me-2"></i>
                      Bộ nhớ RAM
                    </label>

                    <SelectInput
                      id="ram"
                      name="ram"
                      register={register("ram")}
                      defaultValue=""
                      options={RAM_OPTIONS.map((value) => ({
                        value,
                        label: value,
                      }))}
                      className=""
                    />
                  </div>

                  <div className="laptop-filter__group">
                    <label className="laptop-filter__label" htmlFor="rom">
                      <i className="bi bi-device-hdd me-2"></i>
                      Ổ cứng
                    </label>

                    <SelectInput
                      id="rom"
                      name="rom"
                      register={register("rom")}
                      defaultValue=""
                      options={ROM_OPTIONS.map((value) => ({
                        value,
                        label: value,
                      }))}
                      className=""
                    />
                  </div>

                  <div className="laptop-filter__group">
                    <label className="laptop-filter__label" htmlFor="display">
                      <i className="bi bi-display me-2"></i>
                      Kích thước màn hình
                    </label>

                    <SelectInput
                      id="display"
                      name="display"
                      register={register("display")}
                      defaultValue=""
                      options={DISPLAY_OPTIONS.map((value) => ({
                        value,
                        label: value,
                      }))}
                      className=""
                    />
                  </div>

                  <div className="laptop-filter__group">
                    <label className="laptop-filter__label" htmlFor="os">
                      <i className="bi bi-window me-2"></i>
                      Hệ điều hành
                    </label>

                    <SelectInput
                      id="os"
                      name="os"
                      register={register("os")}
                      defaultValue=""
                      options={OS_OPTIONS.map((value) => ({
                        value,
                        label: value,
                      }))}
                      className=""
                    />
                  </div>

                  <button
                    type="submit"
                    className="laptop-filter__submit"
                    disabled={filterLoading}
                  >
                    {filterLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang lọc...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Lọc sản phẩm
                      </>
                    )}
                  </button>

                  <p className="laptop-filter__hint">
                    <i className="bi bi-info-circle me-1"></i>
                    Chọn cấu hình để thu hẹp kết quả tìm kiếm.
                  </p>
                </form>
              </div>
            </aside>

            {/* Product section */}
            <section className="col-lg-9" aria-labelledby="search-results-title">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                  <h2 className="fw-bold mb-1" id="search-results-title">
                    {isFiltering ? "Kết quả tìm kiếm" : "Danh sách laptop"}
                  </h2>

                  <p className="text-secondary small mb-0">
                    {isFiltering
                      ? `Tìm thấy ${displayedProducts.length} sản phẩm`
                      : `${products?.totalElements ?? displayedProducts.length} sản phẩm`}
                  </p>
                </div>

                {isFiltering && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={handleReset}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i>
                    Xem tất cả sản phẩm
                  </button>
                )}
              </div>

              {error && (
                <div className="alert alert-danger rounded-3" role="alert">
                  {error}
                </div>
              )}

              {loading && !products ? (
                <div
                  className="laptop-search__loading d-flex flex-column align-items-center justify-content-center py-5"
                  role="status"
                  aria-busy="true"
                >
                  <SyncLoader color="#2563eb" />
                  <p className="text-secondary mt-3 mb-0">Đang tải sản phẩm...</p>
                </div>
              ) : filterLoading ? (
                <div className="d-flex justify-content-center py-5" role="status" aria-busy="true">
                  <SyncLoader color="#2563eb" />
                  <span className="visually-hidden">Đang áp dụng bộ lọc...</span>
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <div className="row g-4">
                    {displayedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="col-12 col-sm-6 col-xl-4"
                      >
                        <Card id={product.id} data={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {!isFiltering && products && products.totalPages > 1 && (
                    <nav
                      className="d-flex justify-content-center align-items-center gap-2 mt-5"
                      aria-label="Phân trang sản phẩm"
                    >
                      <button
                        type="button"
                        onClick={() => setPage(0)}
                        disabled={page === 0 || loading}
                        className="btn btn-white border shadow-sm"
                        aria-label="Trang đầu"
                      >
                        <AiFillFastBackward />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) => Math.max(0, current - 1))
                        }
                        disabled={page === 0 || loading}
                        className="btn btn-white border shadow-sm"
                        aria-label="Trang trước"
                      >
                        <AiOutlineBackward />
                      </button>

                      <span className="small fw-semibold px-2">
                        Trang {page + 1} / {products.totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) =>
                            Math.min(products.totalPages - 1, current + 1),
                          )
                        }
                        disabled={page >= products.totalPages - 1 || loading}
                        className="btn btn-white border shadow-sm"
                        aria-label="Trang tiếp theo"
                      >
                        <AiFillForward />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPage(products.totalPages - 1)}
                        disabled={page >= products.totalPages - 1 || loading}
                        className="btn btn-white border shadow-sm"
                        aria-label="Trang cuối"
                      >
                        <AiFillFastForward />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 text-center py-5 px-3" role="status">
                  <i className="bi bi-laptop display-4 text-secondary"></i>

                  <h3 className="fw-bold mt-3">Không tìm thấy sản phẩm</h3>

                  <p className="text-secondary mb-4">
                    Hãy thử thay đổi bộ lọc để tìm sản phẩm phù hợp hơn.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 align-self-center"
                    onClick={handleReset}
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </UserLayout>
  );
};

export default Search;
