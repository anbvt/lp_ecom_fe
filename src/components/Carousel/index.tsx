import { Link } from "react-router-dom";
import "./index.css";

const Carousel = () => (
  <section className="home-hero" aria-labelledby="home-hero-title">
    <div className="home-hero__copy">
      <p className="home-hero__eyebrow">
        <span className="home-hero__eyebrow-dot"></span>
        Laptop cho mọi mục tiêu
      </p>
      <h1 id="home-hero-title">
        Công nghệ tốt.
        <br />
        <span>Hành trình tốt hơn.</span>
      </h1>
      <p className="home-hero__description">
        Khám phá những chiếc laptop phù hợp với công việc, học tập và giải trí
        của bạn.
      </p>
      <div className="home-hero__actions">
        <Link className="home-hero__primary" to="/search">
          Khám phá sản phẩm <i className="bi bi-arrow-up-right"></i>
        </Link>
        <a className="home-hero__secondary" href="#featured-products">
          Xem ưu đãi <i className="bi bi-arrow-down"></i>
        </a>
      </div>
      <div className="home-hero__trust">
        <span><i className="bi bi-patch-check"></i> Sản phẩm chính hãng</span>
        <span><i className="bi bi-headset"></i> Tư vấn tận tâm</span>
      </div>
    </div>

    <div className="home-hero__visual" aria-hidden="true">
      <div className="home-hero__orbit home-hero__orbit--outer"></div>
      <div className="home-hero__orbit home-hero__orbit--inner"></div>
      <div className="home-hero__device">
        <div className="home-hero__device-screen">
          <div className="home-hero__screen-top">
            <span></span><span></span><span></span>
          </div>
          <i className="bi bi-laptop"></i>
          <span className="home-hero__screen-caption">YOUR NEXT LAPTOP</span>
        </div>
        <div className="home-hero__device-base"></div>
      </div>
      <div className="home-hero__floating-card">
        <span className="home-hero__floating-icon"><i className="bi bi-stars"></i></span>
        <span><strong>Chọn đúng thiết bị</strong><small>Cho riêng nhu cầu của bạn</small></span>
      </div>
      <span className="home-hero__visual-label">TECH THAT MOVES YOU</span>
    </div>
  </section>
);

export default Carousel;
