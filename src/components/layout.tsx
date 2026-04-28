import { getSystemInfo } from "zmp-sdk";
import { AnimationRoutes, App, Route, SnackbarProvider, ZMPRouter } from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import CreatePage from "@/pages/create";
import MyQRsPage from "@/pages/my-qrs";
import EditUIPage from "@/pages/edit-ui";
import { AuthProvider } from "@/contexts";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <AuthProvider>
            <AnimationRoutes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/my-qrs" element={<MyQRsPage />} />
              <Route path="/edit-ui/:id" element={<EditUIPage />} />
            </AnimationRoutes>
          </AuthProvider>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
