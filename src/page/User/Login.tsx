import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginProps } from "src/common/types/LoginProps";
import { useFetch } from "src/util/CustomHook";
import Input from "src/components/Input";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./css/LoginPage.css";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["user"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    try {
      const result = await useFetch.post("/api/auth/login", data);
      setCookie("user", JSON.stringify(result.data));
      api.success({
        message: "Đăng nhập thành công!",
        description: "Welcome to Zuhot eCommerce",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      api.error({
        message: err.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <>
      {contextHolder}

      <div className="login-container">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={6} lg={4}>
              <div className="login-form p-4 shadow rounded bg-white">
                <h1 className="text-center fw-bolder text-uppercase mb-2">
                  Login
                </h1>
                <p className="text-muted text-center mb-4">
                  Enter your credentials to access your account
                </p>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* EMAIL */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Input
                      type="email"
                      name="email"
                      className="form-control"
                      register={register("email", {
                        required: "Bạn không được bỏ trống",
                      })}
                    />
                    <div className="text-danger mt-1">
                      {errors.email?.message}
                    </div>
                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Input
                      type="password"
                      name="password"
                      className="form-control"
                      register={register("password", {
                        required: "Bạn không được bỏ trống",
                      })}
                    />
                    <div className="text-danger mt-1">
                      {errors.password?.message}
                    </div>
                  </Form.Group>

                  {/* OPTIONS */}
                  <Row className="mb-3">
                    <Col className="d-flex justify-content-between">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        {...register("remember")}
                      />
                      <Link to="/registration">Đăng ký</Link>
                    </Col>
                  </Row>

                  {/* SUBMIT */}
                  <Button type="submit" className="w-100">
                    Sign in
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
