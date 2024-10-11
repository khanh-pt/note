import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.jsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./styles/index.css";

import "./firebase/config.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="mx-[100px]">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);
