import * as React from "react";
import {
  type RegisterFormTypes,
  type RegisterPageProps,
  useActiveAuthProvider,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";

import type { BoxProps } from "@mui/material/Box";
import type { CardContentProps } from "@mui/material/CardContent";

import {
  type BaseRecord,
  type HttpError,
  useTranslate,
  useRouterContext,
  useRouterType,
  useLink,
  useRegister,
} from "@refinedev/core";
import { FormPropsType } from "../login";

type RegisterProps = RegisterPageProps<
  BoxProps,
  CardContentProps,
  FormPropsType
>;

/**
 * The register page will be used to register new users. You can use the following props for the <AuthPage> component when the type is "register".
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#register} for more details.
 */
export const RegisterPage: React.FC<RegisterProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  providers,
  formProps,
  hideForm,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, RegisterFormTypes>({
    ...useFormProps,
  });

  const authProvider = useActiveAuthProvider();
  const { mutate: registerMutate, isLoading } = useRegister<RegisterFormTypes>({
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
          <Stack spacing={1} data-oid="ylc0:.a">
            {providers.map((provider: any) => {
              return (
                <Button
                  key={provider.name}
                  color="secondary"
                  fullWidth
                  variant="outlined"
                  sx={{
                    color: "primary.light",
                    borderColor: "primary.light",
                    textTransform: "none",
                  }}
                  onClick={() =>
                    registerMutate({
                      ...mutationVariables,
                      providerName: provider.name,
                    })
                  }
                  startIcon={provider.icon}
                  data-oid="qf.:zfz"
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
              data-oid="6uz7hjg"
            >
              {translate(
                "pages.register.divider",
                translate("pages.login.divider", "or"),
              )}
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const Content = (
    <Card {...(contentProps ?? {})} data-oid="dflu5_l">
      <CardContent
        sx={{ p: "32px", "&:last-child": { pb: "32px" } }}
        data-oid="o0_u2gz"
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          color="primary"
          fontWeight={700}
          mb={3}
          data-oid="5x_c014"
        >
          {translate("pages.register.title", "Sign up for your account")}
        </Typography>
        {renderProviders()}
        {!hideForm && (
          <Box
            component="form"
            onSubmit={handleSubmit((data) => {
              if (onSubmit) {
                return onSubmit(data);
              }

              return registerMutate({ ...mutationVariables, ...data });
            })}
            data-oid="a6sxpwq"
          >
            <TextField
              {...register("email", {
                required: translate(
                  "pages.register.errors.requiredEmail",
                  "Email is required",
                ),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: translate(
                    "pages.register.errors.validEmail",
                    "Invalid email address",
                  ),
                },
              })}
              id="email"
              margin="normal"
              fullWidth
              label={translate("pages.register.email", "Email")}
              error={!!errors.email}
              helperText={errors["email"] ? errors["email"].message : ""}
              name="email"
              autoComplete="email"
              sx={{
                mt: 0,
              }}
              data-oid="l0fq7hm"
            />

            <TextField
              {...register("password", {
                required: translate(
                  "pages.register.errors.requiredPassword",
                  "Password is required",
                ),
              })}
              id="password"
              margin="normal"
              fullWidth
              name="password"
              label={translate("pages.register.fields.password", "Password")}
              helperText={errors["password"] ? errors["password"].message : ""}
              error={!!errors.password}
              type="password"
              placeholder="●●●●●●●●"
              autoComplete="current-password"
              sx={{
                mb: 0,
              }}
              data-oid="t4fpnkt"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: "24px",
              }}
              data-oid="lt22epx"
            >
              {translate("pages.register.signup", "Sign up")}
            </Button>
          </Box>
        )}
        {loginLink ?? (
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{
              mt: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            data-oid="yv_e_s_"
          >
            <Typography
              variant="body2"
              component="span"
              fontSize="12px"
              data-oid="i970f1_"
            >
              {translate(
                "pages.register.buttons.haveAccount",
                translate(
                  "pages.login.buttons.haveAccount",
                  "Have an account?",
                ),
              )}
            </Typography>
            <MuiLink
              ml="4px"
              variant="body2"
              color="primary"
              component={ActiveLink}
              underline="none"
              to="/login"
              fontSize="12px"
              fontWeight="bold"
              data-oid="p6:1f__"
            >
              {translate(
                "pages.register.signin",
                translate("pages.login.signin", "Sign in"),
              )}
            </MuiLink>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box component="div" {...(wrapperProps ?? {})} data-oid="z-rmabl">
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
        data-oid="9qpbrb7"
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            paddingTop: hideForm ? "15dvh" : 0,
          }}
          data-oid="eltj2qz"
        >
          {Content}
        </Box>
      </Container>
    </Box>
  );
};
