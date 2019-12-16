import { render } from "@testing-library/react";
import React from "react";

import App from "./App";

test("renders without crashing", () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Usage Analytics/i);

  expect(headerElement).toBeInTheDocument();
});
