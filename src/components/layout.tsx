import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import { AuthProvider } from "@/contexts";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <AuthProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage />}></Route>
            </AnimationRoutes>
          </ZMPRouter>
        </AuthProvider>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
