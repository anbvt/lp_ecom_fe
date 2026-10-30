import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useFetch, useQuery } from "src/util/CustomHook";
import DetailProduct from "./DetailProduct";

jest.mock("src/util/CustomHook", () => ({
  useFetch: { get: jest.fn(), post: jest.fn() },
  useQuery: jest.fn(),
}));

test("shows a not-found state when the requested product is unavailable", async () => {
  (useQuery as jest.Mock).mockReturnValue(new URLSearchParams("?id=404"));
  (useFetch.get as jest.Mock).mockResolvedValue({ data: null });

  render(
    <MemoryRouter>
      <DetailProduct />
    </MemoryRouter>
  );

  expect(await screen.findByText("Không tìm thấy sản phẩm này.")).toBeInTheDocument();
});
