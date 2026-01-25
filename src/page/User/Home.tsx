import { useEffect, useState } from "react";
import { AiFillFastBackward, AiFillFastForward, AiFillForward, AiOutlineBackward } from "react-icons/ai";
import { SyncLoader } from "react-spinners";
import Card from "src/components/Card";
import Carousel from "src/components/Carousel";
import { useFetch } from "src/util/CustomHook";
import UserLayout from "src/components/Layout/UserLayout";
import { Col, Row } from "react-bootstrap";

const Home = () => {
  const [data, setData] = useState<any>();
  const [page, setPage] = useState(0);
  useEffect(() => {
    async function init() {
      const { data: result } = await useFetch.get("/api/products?p=" + page);
      setData(result);
    }
    init();
  }, [page]);
  return (
    <UserLayout>
      {
        !data ? <div className="container w-100 bg-white mx-auto text-center" style={{ height: "500px", paddingTop: "200px" }}><SyncLoader color="#36d7b7" className="text-center" style={{ marginTop: "200" }} /></div> : <>
          <div className="card mb-3">
            <div className="card-body">
              <Carousel />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="row w-100 m-auto p-3">
                <h4 className="card-title text-danger">Khuyến mãi HOT 💥</h4>
                <Row>
                  {
                    data?.content?.map((s: any, key: any) => {
                      return (
                        <Col key={key} md="4">
                          <Card id={s.id} className="mt-3" data={s} />
                        </Col>
                      )
                    })
                  }
                </Row>
              </div>
              <div className="row mt-5">
                <div className="col d-flex justify-content-center">

                  <div className="d-flex align-items-center gap-3 bg-white px-4 py-2 rounded-pill shadow-sm">

                    {/* First */}
                    <button
                      className="btn btn-light rounded-circle"
                      disabled={page === 0}
                      onClick={() => setPage(0)}
                    >
                      <AiFillFastBackward />
                    </button>

                    {/* Prev */}
                    <button
                      className="btn btn-light rounded-circle"
                      disabled={page === 0}
                      onClick={() => page > 0 && setPage(page - 1)}
                    >
                      <AiOutlineBackward />
                    </button>

                    {/* Page indicator */}
                    <span className="fw-bold px-3">
                      {page + 1} <span className="text-muted">/ {data.totalPages}</span>
                    </span>

                    {/* Next */}
                    <button
                      className="btn btn-light rounded-circle"
                      disabled={page === data.totalPages - 1}
                      onClick={() => page < data.totalPages - 1 && setPage(page + 1)}
                    >
                      <AiFillForward />
                    </button>

                    {/* Last */}
                    <button
                      className="btn btn-light rounded-circle"
                      disabled={page === data.totalPages - 1}
                      onClick={() => setPage(data.totalPages - 1)}
                    >
                      <AiFillFastForward />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </UserLayout>

  );
}
export default Home;