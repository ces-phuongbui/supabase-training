import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MuiLink from "@mui/material/Link";

import type { BoxProps } from "@mui/material/Box";
import type { CardContentProps } from "@mui/material/CardContent";

import type {
  ForgotPasswordFormTypes,
  ForgotPasswordPageProps,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as React from "react";

import {
  type BaseRecord,
  type HttpError,
  useForgotPassword,
  useLink,
  useRouterContext,
  useRouterType,
  useTranslate,
} from "@refinedev/core";
import { FormPropsType } from "../login";

type ForgotPasswordProps = ForgotPasswordPageProps<
  BoxProps,
  CardContentProps,
  FormPropsType
>;

/**
 * The forgotPassword type is a page that allows users to reset their passwords. You can use this page to reset your password.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#forgot-password} for more details.
 */
export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  formProps,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseRecord, HttpError, ForgotPasswordFormTypes>({
    ...useFormProps,
  });

  const { mutate, isLoading } = useForgotPassword<ForgotPasswordFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const Content = (
    <Card {...(contentProps ?? {})} data-oid="8:o2h.1">
      <CardContent
        sx={{ p: "32px", "&:last-child": { pb: "32px" } }}
        data-oid="0ygzmce"
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          color="primary"
          fontWeight={700}
          mb={3}
          data-oid=":9pld-d"
        >
          {translate("pages.forgotPassword.title", "Forgot your password?")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) => {
            if (onSubmit) {
              return onSubmit(data);
            }

            return mutate({ ...mutationVariables, ...data });
          })}
          data-oid="of9aa-6"
        >
          <TextField
            {...register("email", {
              required: translate(
                "pages.forgotPassword.errors.requiredEmail",
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
            label={translate("pages.forgotPassword.fields.email", "Email")}
            name="email"
            type="email"
            error={!!errors.email}
            autoComplete="email"
            sx={{
              m: 0,
            }}
            data-oid="oj15f1i"
          />

          {loginLink ?? (
            <Box textAlign="right" sx={{ mt: "24px" }} data-oid="vaaq6h8">
              <Typography
                variant="body2"
                component="span"
                fontSize="12px"
                data-oid="dyr2gld"
              >
                {translate(
                  "pages.forgotPassword.buttons.haveAccount",
                  translate(
                    "pages.register.buttons.haveAccount",
                    "Have an account? ",
                  ),
                )}
              </Typography>{" "}
              <MuiLink
                variant="body2"
                component={ActiveLink}
                underline="none"
                to="/login"
                fontWeight="bold"
                fontSize="12px"
                color="primary.light"
                data-oid="x9o82vs"
              >
                {translate(
                  "pages.forgotPassword.signin",
                  translate("pages.login.signin", "Sign in"),
                )}
              </MuiLink>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: "24px" }}
            disabled={isLoading}
            data-oid="yvhal3t"
          >
            {translate(
              "pages.forgotPassword.buttons.submit",
              "Send reset instructions",
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Box component="div" {...(wrapperProps ?? {})} data-oid="ok1ey5o">
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100dvh",
            padding: "16px",
            width: "100%",
            maxWidth: "400px",
          }}
          data-oid="z8fuc3n"
        >
          {Content}
        </Container>
      </Box>
    </>
  );
};
