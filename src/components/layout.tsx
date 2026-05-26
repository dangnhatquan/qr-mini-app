import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
  useSnackbar,
  Spinner,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import { useEffect, Suspense, lazy } from "react";
import { setSnackbarFunction } from "@/utils/snackbar";

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
// import PerformanceOverlay from "./performance-overlay";

// Lazy load page components to optimize first page load size
const HomePage = lazy(() => import("@/pages/index"));
const CreatePage = lazy(() => import("@/pages/create"));
const MyQRsPage = lazy(() => import("@/pages/my-qrs"));
const EditUIPage = lazy(() => import("@/pages/edit-ui"));
const VCardDetailPage = lazy(() => import("@/pages/vcard-detail"));
const CardEditorPage = lazy(() => import("@/pages/card-editor"));
const GreetingDetailPage = lazy(() => import("@/pages/greeting-detail"));
const ReviewGreetingDetailPage = lazy(() => import("@/pages/review-greeting-card"));
const UIKitPage = lazy(() => import("@/pages/ui-kit"));

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
            <Suspense
              fallback={
                <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                  <Spinner />
                </div>
              }
            >
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
            </Suspense>
          </AuthProvider>
        </ZMPRouter>
        {/* <PerformanceOverlay /> */}
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
