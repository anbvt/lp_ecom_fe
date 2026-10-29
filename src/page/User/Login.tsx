import { notification } from "antd";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LoginProps } from "src/common/types/LoginProps";
import { useFetch } from "src/util/CustomHook";
import "../css/AuthPage.css";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["user"]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginProps>();

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    try {
      const result = await useFetch.post("/api/auth/login", data);
      setCookie("user", JSON.stringify(result.data));
      api.success({
        message: "Đăng nhập thành công!",
        description: "Chào mừng bạn quay lại ZUHOT Laptop.",
      });
      setTimeout(() => navigate("/"), 1200);
    } catch (err: any) {
      api.error({
        message: err.response?.data?.message || "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra email và mật khẩu rồi thử lại.",
      });
    }
  };

  return (
    <main className="auth-page auth-page--user">
      {contextHolder}
      <div className="auth-shell">
        <section className="auth-showcase" aria-label="ZUHOT Laptop">
          <Link className="auth-brand" to="/" aria-label="ZUHOT Laptop - Trang chủ">
            <span className="auth-brand__mark"><i className="bi bi-laptop"></i></span>
            <span>ZUHOT<span className="auth-brand__suffix"> LAPTOP</span></span>
          </Link>

          <div className="auth-showcase__content">
            <p className="auth-showcase__eyebrow">
              <i className="bi bi-stars"></i> Mua sắm dễ dàng hơn
            </p>
            <h1>Công nghệ tốt.<br /><span>Hành trình tốt hơn.</span></h1>
            <p className="auth-showcase__description">
              Đăng nhập để theo dõi đơn hàng và tìm chiếc laptop phù hợp với bạn.
            </p>
          </div>

          <div className="auth-device" aria-hidden="true">
            <div className="auth-device__screen">
              <i className="bi bi-laptop"></i>
              <span>YOUR NEXT LAPTOP</span>
            </div>
            <div className="auth-device__base"></div>
          </div>

          <div className="auth-showcase__footer">
            <span><i className="bi bi-patch-check"></i> Sản phẩm chính hãng</span>
            <span><i className="bi bi-headset"></i> Tư vấn tận tâm</span>
          </div>
        </section>

        <section className="auth-form-panel" aria-labelledby="user-login-title">
          <div className="auth-form-top">
            <Link className="auth-back-link" to="/">
              <i className="bi bi-arrow-left"></i> Về trang chủ
            </Link>
          </div>

          <div className="auth-form-heading">
            <span className="auth-form-heading__badge">
              <i className="bi bi-person-check"></i> TÀI KHOẢN KHÁCH HÀNG
            </span>
            <h2 id="user-login-title">Chào mừng trở lại</h2>
            <p>Đăng nhập để tiếp tục trải nghiệm mua sắm của bạn.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="auth-field">
              <label htmlFor="user-email">Địa chỉ email</label>
              <div className="auth-field__control">
                <i className="bi bi-envelope auth-field__icon"></i>
                <input
                  id="user-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "user-email-error" : undefined}
                  {...register("email", {
                    required: "Vui lòng nhập email.",
                  })}
                />
              </div>
              {errors.email && (
                <p className="auth-field__error" id="user-email-error" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="user-password">Mật khẩu</label>
              <div className="auth-field__control">
                <i className="bi bi-lock auth-field__icon"></i>
                <input
                  id="user-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "user-password-error" : undefined}
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu.",
                  })}
                />
              </div>
              {errors.password && (
                <p className="auth-field__error" id="user-password-error" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="auth-form__options">
              <label className="auth-remember">
                <input type="checkbox" {...register("remember")} />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link className="auth-form__link" to="/registration">Tạo tài khoản</Link>
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              {!isSubmitting && <i className="bi bi-arrow-right"></i>}
            </button>
          </form>

          <p className="auth-form__footnote">
            <i className="bi bi-shield-check"></i>
            Thông tin tài khoản của bạn luôn được bảo vệ an toàn.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
