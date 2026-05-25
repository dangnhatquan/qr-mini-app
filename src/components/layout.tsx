import { getSystemInfo } from "zmp-sdk";
import { AnimationRoutes, App, Route, SnackbarProvider, ZMPRouter, useSnackbar } from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import React, { useEffect } from "react";
import { setSnackbarFunction } from "@/utils/snackbar";

import HomePage from "@/pages/index";
import CreatePage from "@/pages/create";
import MyQRsPage from "@/pages/my-qrs";
import EditUIPage from "@/pages/edit-ui";
import VCardDetailPage from "@/pages/vcard-detail";
import CardEditorPage from "@/pages/card-editor";
import GreetingDetailPage from "@/pages/greeting-detail";
import UIKitPage from "@/pages/ui-kit";
import { AuthProvider } from "@/contexts";
import {
  createRoute,
  defaultRoute,
  editRoute,
  myQrsRoute,
  vcardDetailRoute,
  cardEditorRoute,
  greetingDetailRoute,
  uiKitRoute,
  reviewGreetingDetailRoute,
} from "@/utils/routes";
import ReviewGreetingDetailPage from "@/pages/review-greeting-card";
import PerformanceOverlay from "./performance-overlay";

const SnackbarRegister = () => {
  const { openSnackbar } = useSnackbar();
  useEffect(() => {
    setSnackbarFunction(openSnackbar);
  }, [openSnackbar]);
  return null;
};

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <SnackbarRegister />
        <ZMPRouter>
          <AuthProvider>
            <AnimationRoutes>
              <Route path={defaultRoute} element={<HomePage />} />
              <Route path={createRoute} element={<CreatePage />} />
              <Route path={myQrsRoute} element={<MyQRsPage />} />
              <Route path={editRoute} element={<EditUIPage />} />
              <Route path={vcardDetailRoute} element={<VCardDetailPage />} />
              <Route path={reviewGreetingDetailRoute} element={<GreetingDetailPage />} />
              <Route path={greetingDetailRoute} element={<ReviewGreetingDetailPage />} />
              <Route path={cardEditorRoute} element={<CardEditorPage />} />
              <Route path={uiKitRoute} element={<UIKitPage />} />
            </AnimationRoutes>
          </AuthProvider>
        </ZMPRouter>
        <PerformanceOverlay />
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
