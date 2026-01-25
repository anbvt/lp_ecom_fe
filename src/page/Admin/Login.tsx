import { notification } from "antd";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginProps } from "src/common/types/LoginProps";
import { useFetch } from "src/util/CustomHook";

const LoginAdmin = () => {
    const [api, contextHolder] = notification.useNotification();
    const [, setCookie] = useCookies(["admin"]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginProps>();

    const onSubmit: SubmitHandler<LoginProps> = async (data) => {
        try {
            const result = await useFetch.post("/api/auth/login", data);

            if (!result.data.admin) {
                api.error({
                    message: "Không có quyền truy cập!",
                    description: "Tài khoản này không phải Admin",
                });
                return;
            }

            setCookie("admin", JSON.stringify(result.data));
            api.success({
                message: "Đăng nhập Admin thành công!",
                description: "Welcome to Admin Dashboard",
            });

            setTimeout(() => navigate("/admin"), 1500);
        } catch (err: any) {
            api.error({
                message: err.response?.data?.message || "Login failed",
            });
        }
    };

    return (
        <>
            {contextHolder}

            <div className="container">
                <div className="row justify-content-center align-items-center min-vh-100">
                    <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                        <div className="card shadow p-4">
                            <h3 className="text-center fw-bold mb-3 text-uppercase">
                                Admin Login
                            </h3>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* EMAIL */}
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        {...register("email", {
                                            required: "Bạn không được bỏ trống email",
                                        })}
                                    />
                                    <div className="text-danger mt-1">
                                        {errors.email?.message}
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        {...register("password", {
                                            required: "Bạn không được bỏ trống mật khẩu",
                                        })}
                                    />
                                    <div className="text-danger mt-1">
                                        {errors.password?.message}
                                    </div>
                                </div>

                                {/* REMEMBER */}
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="remember"
                                    />
                                    <label className="form-check-label" htmlFor="remember">
                                        Remember me
                                    </label>
                                </div>

                                {/* SUBMIT */}
                                <button type="submit" className="btn btn-dark w-100">
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginAdmin;
