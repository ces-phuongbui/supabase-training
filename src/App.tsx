import RsvpIcon from "@mui/icons-material/Rsvp";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { AuthPage, ErrorComponent, notificationProvider, RefineSnackbarProvider, ThemedLayoutV2 } from "@refinedev/mui";

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

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
                <RefineKbarProvider>
                    <ColorModeContextProvider>
                        <CssBaseline />
                        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
                        <RefineSnackbarProvider>
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
                                        icon: <RsvpIcon />,
                                        meta: {
                                            canDelete: true,
                                        },
                                    },
                                ]}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                }}
                            >
                                <Routes>
                                    <Route index element={<LandingPage />} />
                                    <Route path="/r">
                                        <Route path=":id" element={<ResponseCreate />} />
                                    </Route>
                                    <Route path="/thank-you" element={<ThankYouPage />} />
                                    <Route
                                        element={
                                            <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                                                <ThemedLayoutV2
                                                    Header={() => <Header sticky />}
                                                    Title={({ collapsed }) => <AppIcon collapsed={collapsed} />}
                                                >
                                                    <Outlet />
                                                </ThemedLayoutV2>
                                            </Authenticated>
                                        }
                                    >
                                        <Route path="/requests">
                                            <Route index element={<RequestList />} />
                                            <Route path="create" element={<RequestCreate />} />
                                            <Route path="show/:id" element={<RequestShow />} />
                                        </Route>
                                        <Route path="*" element={<ErrorComponent />} />
                                    </Route>
                                    <Route
                                        element={
                                            <Authenticated fallback={<Outlet />}>
                                                <NavigateToResource />
                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            path="/login"
                                            element={
                                                <AuthPage
                                                    type="login"
                                                    title={<AppIcon />}
                                                    formProps={{
                                                        defaultValues: {
                                                            email: "info@refine.dev",
                                                            password: "refine-supabase",
                                                        },
                                                    }}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/register"
                                            element={<AuthPage type="register" title={<AppIcon />} />}
                                        />
                                        <Route
                                            path="/forgot-password"
                                            element={<AuthPage type="forgotPassword" title={<AppIcon />} />}
                                        />
                                    </Route>
                                </Routes>

                                <RefineKbar />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler handler={customTitleHandler} />
                            </Refine>
                        </RefineSnackbarProvider>
                    </ColorModeContextProvider>
                </RefineKbarProvider>
            </BrowserRouter>
        </LocalizationProvider>
    );
}

export default App;
