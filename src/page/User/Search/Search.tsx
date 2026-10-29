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
          setError("Unable to load products. Please try again.");
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
      setError("Unable to filter products. Please try again.");
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
      <div className="bg-light min-vh-100 py-4 py-lg-5">
        <div className="container">
          {/* Page heading */}
          <div className="mb-4">
            <p className="text-primary fw-semibold text-uppercase small mb-2">
              ZUHOT LAPTOP
            </p>

            <h2 className="fw-bold mb-2">Find Your Laptop</h2>

            <p className="text-secondary mb-0">
              Explore our collection and find the right laptop for your needs.
            </p>
          </div>

          <div className="row g-4">
            {/* Filter sidebar */}

            {/* FILTER SIDEBAR */}
            <aside className="col-lg-3">
              <div className="laptop-filter">
                <div className="laptop-filter__header">
                  <div className="d-flex align-items-center gap-3">
                    <div className="laptop-filter__icon">
                      <i className="bi bi-sliders"></i>
                    </div>

                    <div>
                      <h5 className="laptop-filter__title">Filter Products</h5>
                      <p className="laptop-filter__subtitle mb-0">
                        Find your perfect laptop
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="laptop-filter__clear"
                    onClick={handleReset}
                  >
                    Clear all
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
                      Brand
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
                      Memory (RAM)
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
                      Storage
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
                      Display size
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
                      Operating system
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
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Apply Filters
                      </>
                    )}
                  </button>

                  <p className="laptop-filter__hint">
                    <i className="bi bi-info-circle me-1"></i>
                    Select your preferences to narrow down the results.
                  </p>
                </form>
              </div>
            </aside>

            {/* Product section */}
            <section className="col-lg-9">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    {isFiltering ? "Search Results" : "Our Laptops"}
                  </h4>

                  <p className="text-secondary small mb-0">
                    {isFiltering
                      ? `${displayedProducts.length} product(s) found`
                      : `${products?.totalElements ?? displayedProducts.length} product(s) available`}
                  </p>
                </div>

                {isFiltering && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={handleReset}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i>
                    Show all products
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
                  className="d-flex flex-column align-items-center justify-content-center py-5"
                  style={{ minHeight: "300px" }}
                >
                  <SyncLoader color="#6351ce" />
                  <p className="text-secondary mt-3 mb-0">Loading laptops...</p>
                </div>
              ) : filterLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <SyncLoader color="#6351ce" />
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
                      aria-label="Product pagination"
                    >
                      <button
                        type="button"
                        onClick={() => setPage(0)}
                        disabled={page === 0 || loading}
                        className="btn btn-white border shadow-sm"
                        aria-label="First page"
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
                        aria-label="Previous page"
                      >
                        <AiOutlineBackward />
                      </button>

                      <span className="small fw-semibold px-2">
                        Page {page + 1} of {products.totalPages}
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
                        aria-label="Next page"
                      >
                        <AiFillForward />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPage(products.totalPages - 1)}
                        disabled={page >= products.totalPages - 1 || loading}
                        className="btn btn-white border shadow-sm"
                        aria-label="Last page"
                      >
                        <AiFillFastForward />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 text-center py-5 px-3">
                  <i className="bi bi-laptop display-4 text-secondary"></i>

                  <h5 className="fw-bold mt-3">No laptops found</h5>

                  <p className="text-secondary mb-4">
                    Try changing your filters to find products that match your
                    needs.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 align-self-center"
                    onClick={handleReset}
                  >
                    View all laptops
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Search;
