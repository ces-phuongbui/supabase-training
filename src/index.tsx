import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/rochester";
import "@fontsource-variable/merienda";
import "@fontsource/kaushan-script";
import "./index.css";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode data-oid="2ef:6lu">
    <App data-oid="wrbx8t7" />
  </React.StrictMode>,
);
