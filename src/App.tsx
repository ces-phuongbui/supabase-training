import RsvpIcon from "@mui/icons-material/Rsvp";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";
import GoogleIcon from "@mui/icons-material/Google";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
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
import { ColorModeContextProvider } from "./contexts/color-mode";
import LandingPage from "./pages/landing";
import { RequestCreate } from "./pages/requests/create";
import { RequestList } from "./pages/requests/list";
import { RequestShow } from "./pages/requests/show";
import { ResponseCreate } from "./pages/responses/create";
import ThankYouPage from "./pages/responses/thank-you";
import { supabaseClient } from "./utility";
import customTitleHandler from "./utility/customTitleHandler";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { ForgotPasswordPage } from "./pages/forgot-password";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} data-oid="6ad63q3">
      <BrowserRouter data-oid="k_vbd:o">
        <RefineKbarProvider data-oid="1jwylkv">
          <ColorModeContextProvider data-oid="_vr2a4r">
            <CssBaseline data-oid="stj-yw_" />
            <GlobalStyles
              styles={{ html: { WebkitFontSmoothing: "auto" } }}
              data-oid="b2cr:::"
            />

            <RefineSnackbarProvider data-oid="dgxzva8">
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
                    icon: <RsvpIcon data-oid="ps8li-_" />,
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  liveMode: "auto",
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                }}
                data-oid="4g4hn-v"
              >
                <Routes data-oid="p6amrs1">
                  <Route
                    index
                    element={<LandingPage data-oid="5qjelgm" />}
                    data-oid="zabndnr"
                  />

                  <Route path="/r" data-oid="4_sbw3a">
                    <Route
                      path=":id"
                      element={<ResponseCreate data-oid="7c1zafj" />}
                      data-oid="egu.x5:"
                    />
                  </Route>
                  <Route
                    path="/thank-you"
                    element={<ThankYouPage data-oid="hzrs9kj" />}
                    data-oid="5z_2483"
                  />

                  <Route
                    element={
                      <Authenticated
                        key="auth-route"
                        fallback={
                          <CatchAllNavigate to="/login" data-oid="anmfxj." />
                        }
                        data-oid="_lnufb5"
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky data-oid="y4o_d.-" />}
                          Title={({ collapsed }) => (
                            <AppIcon collapsed={collapsed} data-oid="0km2cfl" />
                          )}
                          data-oid="1e.u975"
                        >
                          <Outlet data-oid="3w6f3h5" />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                    data-oid="1_tqwcc"
                  >
                    <Route path="/requests" data-oid="irtpuq2">
                      <Route
                        index
                        element={<RequestList data-oid=":vyqgig" />}
                        data-oid="_w9o2.4"
                      />

                      <Route
                        path="create"
                        element={<RequestCreate data-oid="6qmyxq_" />}
                        data-oid="bzehm:6"
                      />

                      <Route
                        path="show/:id"
                        element={<RequestShow data-oid="iantv9-" />}
                        data-oid="5af-:.a"
                      />
                    </Route>
                    <Route
                      path="*"
                      element={<ErrorComponent data-oid="wbmdd-x" />}
                      data-oid="zgoh6_a"
                    />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="auth-route"
                        fallback={<Outlet data-oid="s-1sh3s" />}
                        data-oid="yrd3c.l"
                      >
                        <NavigateToResource data-oid="k19e1a6" />
                      </Authenticated>
                    }
                    data-oid="-_artjk"
                  >
                    <Route
                      path="/login"
                      element={
                        <LoginPage
                          providers={[
                            {
                              name: "google",
                              label: "Sign in with Google",
                              icon: <GoogleIcon data-oid="vwp8lvy" />,
                            },
                          ]}
                          data-oid="gr342hj"
                        />
                      }
                      data-oid=":_epyaq"
                    />

                    <Route
                      path="/register"
                      element={<RegisterPage data-oid="drczcao" />}
                      data-oid="4.dkd4h"
                    />

                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage data-oid="3ol14gu" />}
                      data-oid="zfdn20p"
                    />
                  </Route>
                </Routes>

                <RefineKbar data-oid="n7x2zz9" />
                <UnsavedChangesNotifier data-oid="fdvfxyu" />
                <DocumentTitleHandler
                  handler={customTitleHandler}
                  data-oid="dhdu_0p"
                />
              </Refine>
            </RefineSnackbarProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
