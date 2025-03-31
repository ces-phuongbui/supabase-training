import {
  type BaseRecord,
  type HttpError,
  type LoginFormTypes,
  type LoginPageProps,
  RegisterFormTypes,
  useActiveAuthProvider,
  useLink,
  useLogin,
  useRouterContext,
  useRouterType,
  useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as React from "react";
import { FormProvider, UseFormProps } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { BoxProps } from "@mui/material/Box";
import type { CardContentProps } from "@mui/material/CardContent";

export interface FormPropsType extends UseFormProps {
  onSubmit?: (values: RegisterFormTypes) => void;
}

type LoginProps = LoginPageProps<BoxProps, CardContentProps, FormPropsType>;

/**
 * login will be used as the default type of the <AuthPage> component. The login page will be used to log in to the system.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  formProps,
  hideForm,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, LoginFormTypes>({
    ...useFormProps,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          <Stack spacing={1} data-oid="bzv3f9_">
            {providers.map((provider: any) => {
              return (
                <Button
                  key={provider.name}
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: "primary.light",
                    borderColor: "primary.light",
                    textTransform: "none",
                  }}
                  onClick={() =>
                    login({ ...mutationVariables, providerName: provider.name })
                  }
                  startIcon={provider.icon}
                  data-oid="myvjmt_"
                >
                  {provider.label}
                </Button>
              );
            })}
          </Stack>
          {!hideForm && (
            <Divider
              sx={{
                fontSize: "12px",
                marginY: "16px",
              }}
              data-oid="t1o.-br"
            >
              {translate("pages.login.divider", "or")}
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const Content = (
    <Card {...(contentProps ?? {})} data-oid="9bp0:cj">
      <CardContent
        sx={{ p: "32px", "&:last-child": { pb: "32px" } }}
        data-oid="jmfx7ee"
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          color="primary"
          fontWeight={700}
          mb={3}
          data-oid="ez:4-q3"
        >
          {translate("pages.login.title", "Sign in to your account")}
        </Typography>
        {renderProviders()}
        {!hideForm && (
          <Box
            component="form"
            onSubmit={handleSubmit((data) => {
              if (onSubmit) {
                return onSubmit(data);
              }

              return login({ ...mutationVariables, ...data });
            })}
            data-oid="6snjnto"
          >
            <TextField
              {...register("email", {
                required: translate(
                  "pages.login.errors.requiredEmail",
                  "Email is required",
                ),
              })}
              id="email"
              margin="normal"
              fullWidth
              label={translate("pages.login.fields.email", "Email")}
              error={!!errors.email}
              name="email"
              type="email"
              autoComplete="email"
              sx={{
                mt: 0,
              }}
              data-oid="qo.osuy"
            />

            <TextField
              {...register("password", {
                required: translate(
                  "pages.login.errors.requiredPassword",
                  "Password is required",
                ),
              })}
              id="password"
              margin="normal"
              fullWidth
              name="password"
              label={translate("pages.login.fields.password", "Password")}
              helperText={errors?.password?.message}
              error={!!errors.password}
              type="password"
              placeholder="●●●●●●●●"
              autoComplete="current-password"
              sx={{
                mb: 0,
              }}
              data-oid="v7bcm:y"
            />

            <Box
              component="div"
              sx={{
                mt: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              data-oid="d3f:bnr"
            >
              {rememberMe ?? (
                <FormControlLabel
                  sx={{
                    span: {
                      fontSize: "14px",
                      color: "text.secondary",
                    },
                  }}
                  color="secondary"
                  control={
                    <Checkbox
                      size="small"
                      id="remember"
                      {...register("remember")}
                      data-oid="zbl7kcj"
                    />
                  }
                  label={translate(
                    "pages.login.buttons.rememberMe",
                    "Remember me",
                  )}
                  data-oid="cqfb_gr"
                />
              )}
              {forgotPasswordLink ?? (
                <MuiLink
                  variant="body2"
                  color="primary"
                  fontSize="12px"
                  component={ActiveLink}
                  underline="none"
                  to="/forgot-password"
                  data-oid="-gp0nl0"
                >
                  {translate(
                    "pages.login.buttons.forgotPassword",
                    "Forgot password?",
                  )}
                </MuiLink>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: "24px" }}
              data-oid="um7.rh1"
            >
              {translate("pages.login.signin", "Sign in")}
            </Button>
          </Box>
        )}
        {registerLink ?? (
          <Box
            sx={{
              mt: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            data-oid="s51old0"
          >
            <Typography
              textAlign="center"
              variant="body2"
              component="span"
              fontSize="12px"
              data-oid="71c5uja"
            >
              {translate(
                "pages.login.buttons.noAccount",
                "Don’t have an account?",
              )}
            </Typography>
            <MuiLink
              ml="4px"
              fontSize="12px"
              variant="body2"
              color="primary"
              component={ActiveLink}
              underline="none"
              to="/register"
              fontWeight="bold"
              data-oid="80y-f9z"
            >
              {translate("pages.login.signup", "Sign up")}
            </MuiLink>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <FormProvider {...methods} data-oid="8835_yu">
      <Box component="div" {...(wrapperProps ?? {})} data-oid="6236evi">
        <Container
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: hideForm ? "flex-start" : "center",
            alignItems: "center",
            minHeight: "100dvh",
            padding: "16px",
            width: "100%",
            maxWidth: "400px",
          }}
          data-oid="tk.00y0"
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              paddingTop: hideForm ? "15dvh" : 0,
            }}
            data-oid="3v5.077"
          >
            <>{Content}</>
          </Box>
        </Container>
      </Box>
    </FormProvider>
  );
};
