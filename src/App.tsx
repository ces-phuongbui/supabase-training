import RsvpIcon from "@mui/icons-material/Rsvp";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import GoogleIcon from "@mui/icons-material/Google";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import authProvider from "./authProvider";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import CreateInvitation from "./pages/CreateInvitation";
import { ForgotPasswordPage } from "./pages/forgot-password";
import LandingPage from "./pages/landing";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { RequestList } from "./pages/requests/list";
import { ResponseCreate } from "./pages/responses/create";
import ThankYouPage from "./pages/responses/thank-you";
import ViewInvitationDetail from "./pages/ViewInvitationDetail";
import { supabaseClient } from "./utility";
import customTitleHandler from "./utility/customTitleHandler";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} data-oid="4tj-_-3">
      <BrowserRouter data-oid="8y.dly5">
        <RefineKbarProvider data-oid="60y9aw9">
          <CssBaseline data-oid="m8mspoi" />
          <GlobalStyles
            styles={{ html: { WebkitFontSmoothing: "auto" } }}
            data-oid="nc0idt2"
          />

          <RefineSnackbarProvider data-oid="zzdus3l">
            <Refine
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              authProvider={authProvider}
              routerProvider={routerBindings}
              notificationProvider={notificationProvider}
              resources={[
                {
                  name: "requests",
                  list: "/requests",
                  create: "/requests/create",
                  edit: "/requests/edit/:id",
                  show: "/requests/show/:id",
                  icon: <RsvpIcon data-oid="03nm..." />,
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
              data-oid="buvd3ox"
            >
              <Routes data-oid="u0dwnpv">
                <Route
                  index
                  element={<LandingPage data-oid="gpuzyto" />}
                  data-oid="vhtijo9"
                />

                <Route path="/r" data-oid="e_5llip">
                  <Route
                    path=":id"
                    element={<ResponseCreate data-oid="b7twrbn" />}
                    data-oid="3u7itig"
                  />
                </Route>
                <Route
                  path=":id/thank-you"
                  element={<ThankYouPage data-oid="inhozwk" />}
                  data-oid="488gaav"
                />

                <Route
                  element={
                    <Authenticated
                      key="auth-route"
                      fallback={
                        <CatchAllNavigate to="/login" data-oid="40k_7ur" />
                      }
                      data-oid="8q:oyl0"
                    >
                      <ThemedLayoutV2
                        Header={() => <Header sticky data-oid="o9reqqo" />}
                        Title={({ collapsed }) => (
                          <AppIcon collapsed={collapsed} data-oid="f6d.1yw" />
                        )}
                        data-oid="dan557-"
                      >
                        <Outlet data-oid="so_k.h3" />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                  data-oid="njy.w_e"
                >
                  <Route path="/requests" data-oid="3b94v_o">
                    <Route
                      index
                      element={<RequestList data-oid="h_lprex" />}
                      data-oid="0az1yuo"
                    />

                    <Route
                      path="create"
                      element={<CreateInvitation data-oid="56apve." />}
                      data-oid="s5bkuas"
                    />

                    <Route
                      path="show/:id"
                      element={<ViewInvitationDetail data-oid="gd:c7_4" />}
                      data-oid=".23250c"
                    />
                  </Route>
                  <Route
                    path="*"
                    element={<ErrorComponent data-oid="u30326j" />}
                    data-oid="qh3exm5"
                  />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="auth-route"
                      fallback={<Outlet data-oid="h69v71h" />}
                      data-oid="x1_s2i1"
                    >
                      <NavigateToResource data-oid="a7r9jve" />
                    </Authenticated>
                  }
                  data-oid="r.gd:is"
                >
                  <Route
                    path="/login"
                    element={
                      <LoginPage
                        providers={[
                          {
                            name: "google",
                            label: "Sign in with Google",
                            icon: <GoogleIcon data-oid="8lin483" />,
                          },
                        ]}
                        data-oid="553cvlx"
                      />
                    }
                    data-oid="cgclnl-"
                  />

                  <Route
                    path="/register"
                    element={<RegisterPage data-oid="8y86aq2" />}
                    data-oid="gejrg53"
                  />

                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage data-oid="2g_4u.0" />}
                    data-oid="qidthx:"
                  />
                </Route>
              </Routes>

              <RefineKbar data-oid="n7z9:tk" />
              <UnsavedChangesNotifier data-oid="rd58hd9" />
              <DocumentTitleHandler
                handler={customTitleHandler}
                data-oid="1v7gknk"
              />
            </Refine>
          </RefineSnackbarProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
