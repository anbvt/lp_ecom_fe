import { notification } from "antd";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { RegisterProps } from "src/common/types/RegisterProps";
import { useFetch } from "src/util/CustomHook";
import "../css/AuthPage.css";

const getRegistrationErrorMessage = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const response = error.response;
  if (typeof response !== "object" || response === null || !("data" in response)) {
    return undefined;
  }

  const data = response.data;
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return undefined;
  }

  return typeof data.message === "string" ? data.message : undefined;
};

const Registration = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProps>();

  const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
    try {
      const result = await useFetch.post("/api/auth/registration", data);
      api.success({
        message: result.data,
        description: "Vui lòng kiểm tra email để kích hoạt tài khoản.",
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (error: unknown) {
      api.error({
        message: getRegistrationErrorMessage(error) || "Đăng ký thất bại",
        description: "Vui lòng kiểm tra thông tin và thử lại.",
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
              <i className="bi bi-stars"></i> Bắt đầu hành trình của bạn
            </p>
            <h1>Tìm thiết bị.<br /><span>Mở lối trải nghiệm.</span></h1>
            <p className="auth-showcase__description">
              Tạo tài khoản để khám phá laptop phù hợp với công việc, học tập và giải trí.
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

        <section className="auth-form-panel" aria-labelledby="user-registration-title">
          <div className="auth-form-top">
            <Link className="auth-back-link" to="/">
              <i className="bi bi-arrow-left"></i> Về trang chủ
            </Link>
          </div>

          <div className="auth-form-heading">
            <span className="auth-form-heading__badge">
              <i className="bi bi-person-plus"></i> TÀI KHOẢN KHÁCH HÀNG
            </span>
            <h2 id="user-registration-title">Tạo tài khoản</h2>
            <p>Điền thông tin bên dưới để bắt đầu mua sắm.</p>
          </div>

          <form
            className="auth-form auth-form--registration"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="auth-field">
              <label htmlFor="registration-fullname">Họ và tên</label>
              <div className="auth-field__control">
                <i className="bi bi-person auth-field__icon"></i>
                <input
                  id="registration-fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Nguyễn Văn An"
                  aria-invalid={Boolean(errors.fullname)}
                  aria-describedby={errors.fullname ? "registration-fullname-error" : undefined}
                  {...register("fullname", { required: "Vui lòng nhập họ và tên." })}
                />
              </div>
              {errors.fullname && (
                <p className="auth-field__error" id="registration-fullname-error" role="alert">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="registration-phone">Số điện thoại</label>
              <div className="auth-field__control">
                <i className="bi bi-telephone auth-field__icon"></i>
                <input
                  id="registration-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Nhập số điện thoại"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "registration-phone-error" : undefined}
                  {...register("phone", { required: "Vui lòng nhập số điện thoại." })}
                />
              </div>
              {errors.phone && (
                <p className="auth-field__error" id="registration-phone-error" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="registration-email">Địa chỉ email</label>
              <div className="auth-field__control">
                <i className="bi bi-envelope auth-field__icon"></i>
                <input
                  id="registration-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "registration-email-error" : undefined}
                  {...register("email", {
                    required: "Vui lòng nhập email.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Vui lòng nhập email hợp lệ.",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="auth-field__error" id="registration-email-error" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="registration-password">Mật khẩu</label>
              <div className="auth-field__control">
                <i className="bi bi-lock auth-field__icon"></i>
                <input
                  id="registration-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Tạo mật khẩu"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "registration-password-error" : undefined}
                  {...register("password", { required: "Vui lòng nhập mật khẩu." })}
                />
              </div>
              {errors.password && (
                <p className="auth-field__error" id="registration-password-error" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="registration-repassword">Nhập lại mật khẩu</label>
              <div className="auth-field__control">
                <i className="bi bi-lock-fill auth-field__icon"></i>
                <input
                  id="registration-repassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu"
                  aria-invalid={Boolean(errors.repassword)}
                  aria-describedby={errors.repassword ? "registration-repassword-error" : undefined}
                  {...register("repassword", {
                    required: "Vui lòng nhập lại mật khẩu.",
                    validate: (value) =>
                      value === getValues("password") || "Mật khẩu nhập lại chưa khớp.",
                  })}
                />
              </div>
              {errors.repassword && (
                <p className="auth-field__error" id="registration-repassword-error" role="alert">
                  {errors.repassword.message}
                </p>
              )}
            </div>

            <div className="auth-form__options">
              <span className="auth-registration__prompt">Đã có tài khoản?</span>
              <Link className="auth-form__link" to="/login">Đăng nhập</Link>
            </div>

            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
              {!isSubmitting && <i className="bi bi-arrow-right"></i>}
            </button>
          </form>

          <p className="auth-form__footnote">
            <i className="bi bi-shield-check"></i>
            Thông tin của bạn được sử dụng để quản lý tài khoản và đơn hàng.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Registration;
