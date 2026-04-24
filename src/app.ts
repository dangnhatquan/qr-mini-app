import "zmp-ui/zaui.css";
import "@/css/tailwind.scss";
import "@/css/app.scss";

import React from "react";
import { createRoot } from "react-dom/client";

import Layout from "@/components/layout";

import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.APP_CONFIG = appConfig as any;
}

const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(Layout));
