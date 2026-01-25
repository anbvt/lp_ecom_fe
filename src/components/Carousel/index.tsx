const Carousel = () => {
  const slides = [
    {
      image:
        "https://raw.githubusercontent.com/anbvt/Laptop_eCommerce_FE/refs/heads/master/public/img/Background.png",
      title: "Gaming Laptop RTX Series",
      desc: "Hiệu năng mạnh mẽ – Chiến mọi tựa game",
    },
    {
      image:
        "https://raw.githubusercontent.com/anbvt/Laptop_eCommerce_FE/refs/heads/master/public/img/Background.png",
      title: "Laptop Văn Phòng",
      desc: "Mỏng nhẹ – Pin lâu – Hiệu suất ổn định",
    },
    {
      image:
        "https://raw.githubusercontent.com/anbvt/Laptop_eCommerce_FE/refs/heads/master/public/img/Background.png",
      title: "Laptop Cao Cấp",
      desc: "Thiết kế sang trọng – Công nghệ mới nhất",
    },
  ];

  return (
    <div
      id="laptopCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {slides.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={item.image}
              className="d-block w-100"
              alt={item.title}
              style={{ maxHeight: "480px", objectFit: "cover" }}
            />

            {/* Caption */}
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
              <h2 className="fw-bold">{item.title}</h2>
              <p>{item.desc}</p>
              <button className="btn btn-warning fw-bold">
                Shop now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#laptopCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#laptopCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
