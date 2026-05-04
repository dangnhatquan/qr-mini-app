import { getSystemInfo } from "zmp-sdk";
import { AnimationRoutes, App, Route, SnackbarProvider, ZMPRouter } from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import CreatePage from "@/pages/create";
import MyQRsPage from "@/pages/my-qrs";
import EditUIPage from "@/pages/edit-ui";
import VCardDetailPage from "@/pages/vcard-detail";
import { AuthProvider } from "@/contexts";
import { createRoute, defaultRoute, editRoute, myQrsRoute, vcardDetailRoute } from "@/utils/routes";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <AuthProvider>
            <AnimationRoutes>
              <Route path={defaultRoute} element={<HomePage />} />
              <Route path={createRoute} element={<CreatePage />} />
              <Route path={myQrsRoute} element={<MyQRsPage />} />
              <Route path={editRoute} element={<EditUIPage />} />
              <Route path={vcardDetailRoute} element={<VCardDetailPage />} />
            </AnimationRoutes>
          </AuthProvider>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
