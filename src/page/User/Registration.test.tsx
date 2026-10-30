import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registration from "./Registration";
import { useFetch } from "src/util/CustomHook";

jest.mock("src/util/CustomHook", () => ({
  useFetch: { post: jest.fn() },
}));

test("shows an inline validation error when passwords do not match", async () => {
  render(
    <MemoryRouter>
      <Registration />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("Họ và tên"), {
    target: { value: "Nguyen Van An" },
  });
  fireEvent.change(screen.getByLabelText("Số điện thoại"), {
    target: { value: "0900000000" },
  });
  fireEvent.change(screen.getByLabelText("Địa chỉ email"), {
    target: { value: "an@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), {
    target: { value: "password" },
  });
  fireEvent.change(screen.getByLabelText("Nhập lại mật khẩu"), {
    target: { value: "different" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Đăng ký" }));

  expect(await screen.findByText("Mật khẩu nhập lại chưa khớp.")).toBeInTheDocument();
  expect(useFetch.post).not.toHaveBeenCalled();
});
