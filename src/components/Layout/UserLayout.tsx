import Footer from "../Footer";
import Navbar from "../Navbar";

function UserLayout({ children }: any) {
    return (
        <div className="container-fluid p-0" style={{ backgroundColor: "white" }} >
            <Navbar />
            <div className="content">{children}</div>
            <Footer />
        </div>
    );
}

export default UserLayout;