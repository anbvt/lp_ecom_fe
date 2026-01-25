import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillFastBackward, AiFillFastForward, AiFillForward, AiOutlineBackward } from "react-icons/ai";
import { findBy_Brands_Products } from "src/api/SearchPage/route";
import { Brand } from "src/common/model/Brand";
import { Product } from "src/common/model/Product";
import { ProductFilter } from "src/common/types/ProductFilterProps";
import SelectInput from "src/components/Select";
import { useFetch } from "src/util/CustomHook";
import Card from "src/components/Card";
import UserLayout from "src/components/Layout/UserLayout";
import { SyncLoader } from "react-spinners";
interface Data {
    brands: Brand[],
    products: Product[]
}

const Search = () => {
    // INIT
    const ram = ["4GB", "8GB", "16GB", "32GB", "64GB"]
    const rom = ["256GB", "512GB", "1TB", "2TB"]
    const display = ["13.3 inch", "14 inch", "15.6 inch"]
    const os = ["window 11", "macOS Big Sur"]
    // useState
    const [products, setProducts] = useState<any>();
    const [flag, setFlag] = useState("list");
    const [filter, setFilter] = useState<Product[]>();
    const [data, setData] = useState<Data>({ brands: [], products: [] });
    const [page, setPage] = useState(0);
    // useForm
    const { register, handleSubmit } = useForm<ProductFilter>();
    // LOADING
    useEffect(() => {
        findBy_Brands_Products(page).then((result) => {
            setData(result);
            setProducts(result.products)
        }).catch(error => console.log(error));
    }, [page]);
    // SUBMIT FORM
    const onSubmit: SubmitHandler<ProductFilter> = (data) => {
        if (data.brandid === "") data.brandid = null;
        if (data.display === "") data.display = null;
        if (data.os === "") data.os = null;
        if (data.ram === "") data.ram = null;
        if (data.rom === "") data.rom = null;

        async function init() {
            const { data: result } = await useFetch.post("/api/products/filter", data);
            setFilter(result);
            setFlag("filter")
        }
        init();
    }

    return (
        <>
            <UserLayout>
    {!products ? (
        <div className="vh-100 d-flex align-items-center justify-content-center">
            <SyncLoader color="#3b82f6" />
        </div>
    ) : (
        <div className="container-fluid py-4">
            <div className="row">
                {/* FILTER SIDEBAR */}
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 rounded-4 p-3 sticky-top" style={{ top: "80px" }}>
                        <h5 className="fw-bold mb-3 text-primary">🔍 Filter</h5>

                        <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">

                            <SelectInput id="brand" name="brand" register={register("brandid")} defaultValue=""
                                            options={data.brands.map((b, i) => ({ value: i + 1, label: b.name }))} className={""} />

                            <SelectInput id="ram" name="ram" register={register("ram")} defaultValue=""
                                            options={ram.map(v => ({ value: v, label: v }))} className={""} />

                            <SelectInput id="rom" name="rom" register={register("rom")} defaultValue=""
                                            options={rom.map(v => ({ value: v, label: v }))} className={""} />

                            <SelectInput id="display" name="display" register={register("display")} defaultValue=""
                                            options={display.map(v => ({ value: v, label: v }))} className={""} />

                            <SelectInput id="os" name="os" register={register("os")} defaultValue=""
                                            options={os.map(v => ({ value: v, label: v }))} className={""} />

                            <button className="btn btn-primary w-100 py-2 rounded-pill">
                                <i className="bi bi-search me-2"></i> Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="col-md-9">
                    <div className="row g-4">
                        {(flag === "list" ? products.content : filter)?.map((value: any, key: number) => (
                            <div key={key} className="col-lg-4 col-md-6">
                                <Card id={value.id} data={value} />
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    {flag === "list" && (
                        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                            <button onClick={() => setPage(0)} className="btn btn-light shadow-sm">
                                <AiFillFastBackward />
                            </button>
                            <button onClick={() => page > 0 && setPage(page - 1)} className="btn btn-light shadow-sm">
                                <AiOutlineBackward />
                            </button>

                            <span className="fw-bold">
                                {page + 1} / {products.totalPages}
                            </span>

                            <button onClick={() => page < products.totalPages - 1 && setPage(page + 1)} className="btn btn-light shadow-sm">
                                <AiFillForward />
                            </button>
                            <button onClick={() => setPage(products.totalPages - 1)} className="btn btn-light shadow-sm">
                                <AiFillFastForward />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )}
</UserLayout>

        </>
    );
}

export default Search;