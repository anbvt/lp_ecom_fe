import { Link } from "react-router-dom";
import { CardProps } from "src/common/types/CartProps";
import { formatter } from "src/util/formatCurrency";
import Card from "react-bootstrap/Card";
import "./index.css";
const CardProduct = (props: CardProps) => {
    return (
        <Card
            className={`border-0 shadow-sm h-100 product-card ${props.className}`}
            id={`card_${props.id}`}
        >
            {/* Image */}
            <div className="position-relative overflow-hidden">
                <Card.Img
                    variant="top"
                    src={props.data.logo}
                    alt={props.data.name}
                    className="product-img"
                />

                {/* Hover overlay */}
                <div className="product-overlay d-flex align-items-center justify-content-center">
                    <Link
                        to={"/product?id=" + props.data.id}
                        className="btn btn-dark btn-sm"
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </div>

            <Card.Body className="text-center">
                <Link
                    className="text-decoration-none fw-bold text-dark d-block mb-2"
                    to={"/product?id=" + props.data.id}
                >
                    {props.data.name}
                </Link>

                <div className="text-danger fw-bold fs-5">
                    {formatter.format(props.data.price)}
                </div>
            </Card.Body>
        </Card>
    );

}
export default CardProduct;