
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-white">
            <div className="container-fluid p-0">
                {/* Social media */}
                <section
                    className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 p-4"
                    style={{ backgroundColor: "#6351ce" }}
                >
                    <span>
                        Stay connected with ZUHOT Laptop
                    </span>

                    <div className="d-flex gap-4">
                        <a
                            href="https://github.com/anbvt"
                            className="text-white"
                            aria-label="GitHub"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <i className="fab fa-github fa-lg"></i>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/anbvt/"
                            className="text-white"
                            aria-label="LinkedIn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <i className="fab fa-linkedin fa-lg"></i>
                        </a>
                    </div>
                </section>

                {/* Footer links */}
                <section className="container py-5">
                    <div className="row g-4">
                        {/* About */}
                        <div className="col-md-6 col-lg-4">
                            <h6 className="text-uppercase fw-bold">
                                ZUHOT Laptop
                            </h6>

                            <hr
                                className="mt-0 mb-4"
                                style={{
                                    width: "60px",
                                    height: "2px",
                                    backgroundColor: "#7c4dff",
                                    border: 0,
                                    opacity: 1,
                                }}
                            />

                            <p className="text-white-50">
                                Your destination for laptop shopping.
                                Explore our laptop collection and find
                                a device that suits your needs.
                            </p>

                            <a
                                href="https://zuhot-laptop.vercel.app"
                                className="text-white text-decoration-none"
                            >
                                Visit our website
                                <i className="fas fa-arrow-up-right-from-square ms-2"></i>
                            </a>
                        </div>

                        {/* Shopping */}
                        <div className="col-md-6 col-lg-4">
                            <h6 className="text-uppercase fw-bold">
                                Shopping
                            </h6>

                            <hr
                                className="mt-0 mb-4"
                                style={{
                                    width: "60px",
                                    height: "2px",
                                    backgroundColor: "#7c4dff",
                                    border: 0,
                                    opacity: 1,
                                }}
                            />

                            <p className="text-white-50 mb-2">
                                Browse laptops
                            </p>
                            <p className="text-white-50 mb-2">
                                Compare your options
                            </p>
                            <p className="text-white-50 mb-2">
                                Find a laptop for your needs
                            </p>
                        </div>

                        {/* Project information */}
                        <div className="col-md-6 col-lg-4">
                            <h6 className="text-uppercase fw-bold">
                                Project
                            </h6>

                            <hr
                                className="mt-0 mb-4"
                                style={{
                                    width: "60px",
                                    height: "2px",
                                    backgroundColor: "#7c4dff",
                                    border: 0,
                                    opacity: 1,
                                }}
                            />

                            <p className="text-white-50">
                                A laptop e-commerce web application
                                built with React, TypeScript and
                                a Spring Boot backend.
                            </p>

                            <a
                                href="https://github.com/anbvt/lp_ecom_fe"
                                className="text-white text-decoration-none"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Frontend source code
                                <i className="fab fa-github ms-2"></i>
                            </a>

                            <p className="mt-3 mb-0">
                                <a
                                    href="https://github.com/anbvt/lp_ecom_be"
                                    className="text-white text-decoration-none"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Backend source code
                                    <i className="fab fa-github ms-2"></i>
                                </a>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Copyright */}
                <div
                    className="text-center p-3"
                    style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                >
                    © {currentYear} ZUHOT Laptop. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
