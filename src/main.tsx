import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./assets_getyourtrip/css/bootstrap.min.css";
import "./assets_getyourtrip/css/jquery-ui.css";
import "./assets_getyourtrip/css/bootstrap-icons.css";
import "./assets_getyourtrip/css/all.min.css";
import "./assets_getyourtrip/css/animate.min.css";
import "./assets_getyourtrip/css/jquery.fancybox.min.css";
import "./assets_getyourtrip/css/fontawesome.min.css";
import "./assets_getyourtrip/css/swiper-bundle.min.css";
import "./assets_getyourtrip/css/daterangepicker.css";
import "./assets_getyourtrip/css/slick.css";
import "./assets_getyourtrip/css/slick-theme.css";
import "./assets_getyourtrip/css/boxicons.min.css";
import "./assets_getyourtrip/css/select2.css";
import "./assets_getyourtrip/css/nice-select.css";
import "assets_getyourtrip/css/style.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
