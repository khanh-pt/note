import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.jsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import "./firebase/config.js";

import { Container } from "@mui/material";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Container maxWidth="lg" sx={{ textAlign: "center" }}>
      <RouterProvider router={router} />
    </Container>
  </StrictMode>
);
