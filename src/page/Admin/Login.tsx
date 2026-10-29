import { notification } from "antd";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LoginProps } from "src/common/types/LoginProps";
import { useFetch } from "src/util/CustomHook";
import "../css/AuthPage.css";

const LoginAdmin = () => {
    const [api, contextHolder] = notification.useNotification();
    const [, setCookie] = useCookies(["admin"]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginProps>();

    const onSubmit: SubmitHandler<LoginProps> = async (data) => {
        try {
            const result = await useFetch.post("/api/auth/login", data);

            if (!result.data.admin) {
                api.error({
                    message: "Không có quyền truy cập",
                    description: "Tài khoản này không có quyền quản trị viên.",
                });
                return;
            }

            setCookie("admin", JSON.stringify(result.data));
            api.success({
                message: "Đăng nhập quản trị thành công!",
                description: "Đang chuyển đến trang quản trị.",
            });

            setTimeout(() => navigate("/admin"), 1200);
        } catch (err: any) {
            api.error({
                message: err.response?.data?.message || "Đăng nhập thất bại",
                description: "Vui lòng kiểm tra email và mật khẩu rồi thử lại.",
            });
        }
    };

    return (
        <main className="auth-page auth-page--admin">
            {contextHolder}
            <div className="auth-shell">
                <section className="auth-showcase" aria-label="Khu vực quản trị ZUHOT">
                    <Link className="auth-brand" to="/" aria-label="ZUHOT Laptop - Trang chủ">
                        <span className="auth-brand__mark"><i className="bi bi-laptop"></i></span>
                        <span>ZUHOT<span className="auth-brand__suffix"> ADMIN</span></span>
                    </Link>

                    <div className="auth-showcase__content">
                        <p className="auth-showcase__eyebrow">
                            <i className="bi bi-shield-lock"></i> Khu vực quản trị
                        </p>
                        <h1>Quản lý thông minh.<br /><span>Vận hành dễ dàng.</span></h1>
                        <p className="auth-showcase__description">
                            Đăng nhập vào hệ thống quản trị để quản lý sản phẩm, đơn hàng và khách hàng.
                        </p>
                    </div>

                    <div className="auth-device" aria-hidden="true">
                        <div className="auth-device__screen">
                            <i className="bi bi-grid-1x2"></i>
                            <span>ADMIN WORKSPACE</span>
                        </div>
                        <div className="auth-device__base"></div>
                    </div>

                    <div className="auth-showcase__footer">
                        <span><i className="bi bi-lock"></i> Truy cập dành cho quản trị viên</span>
                        <span><i className="bi bi-activity"></i> Bảng điều khiển ZUHOT</span>
                    </div>
                </section>

                <section className="auth-form-panel" aria-labelledby="admin-login-title">
                    <div className="auth-form-top">
                        <Link className="auth-back-link" to="/">
                            <i className="bi bi-arrow-left"></i> Về trang chủ
                        </Link>
                    </div>

                    <div className="auth-form-heading">
                        <span className="auth-form-heading__badge">
                            <i className="bi bi-shield-lock"></i> ĐĂNG NHẬP AN TOÀN
                        </span>
                        <h2 id="admin-login-title">Xin chào, quản trị viên</h2>
                        <p>Sử dụng tài khoản quản trị để tiếp tục.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="auth-field">
                            <label htmlFor="admin-email">Địa chỉ email</label>
                            <div className="auth-field__control">
                                <i className="bi bi-envelope auth-field__icon"></i>
                                <input
                                    id="admin-email"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="admin@example.com"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? "admin-email-error" : undefined}
                                    {...register("email", {
                                        required: "Vui lòng nhập email.",
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="auth-field__error" id="admin-email-error" role="alert">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="admin-password">Mật khẩu</label>
                            <div className="auth-field__control">
                                <i className="bi bi-lock auth-field__icon"></i>
                                <input
                                    id="admin-password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Nhập mật khẩu quản trị"
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={errors.password ? "admin-password-error" : undefined}
                                    {...register("password", {
                                        required: "Vui lòng nhập mật khẩu.",
                                    })}
                                />
                            </div>
                            {errors.password && (
                                <p className="auth-field__error" id="admin-password-error" role="alert">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="auth-form__options">
                            <label className="auth-remember">
                                <input type="checkbox" {...register("remember")} />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                        </div>

                        <button type="submit" className="auth-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang xác thực..." : "Đăng nhập quản trị"}
                            {!isSubmitting && <i className="bi bi-arrow-right"></i>}
                        </button>
                    </form>

                    <p className="auth-form__footnote">
                        <i className="bi bi-shield-check"></i>
                        Chỉ dành cho tài khoản được cấp quyền quản trị viên.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default LoginAdmin;
