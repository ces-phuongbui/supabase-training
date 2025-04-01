import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
  contentProps,
  formProps,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, ForgotPasswordFormTypes>({
    ...useFormProps,
  });

  const { mutate, isLoading } = useForgotPassword<ForgotPasswordFormTypes>();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const Content = (
    <Card
      {...(contentProps ?? {})}
      data-oid=":1ratme"
      className="bg-white rounded-lg shadow-md w-full py-10 border-white"
    >
      <CardHeader className="pb-7" data-oid="tuwhnl_">
        <CardTitle
          className="text-center text-2xl font-bold text-primary"
          data-oid="mpd908i"
        >
          Forgot your password?
        </CardTitle>
      </CardHeader>
      <CardContent data-oid="bgfcu6h">
        <Form {...methods} data-oid="w6:-t.e">
          <form
            onSubmit={methods.handleSubmit((data) => {
              if (onSubmit) {
                return onSubmit(data);
              }
              return mutate({ ...mutationVariables, ...data });
            })}
            className="space-y-4"
            data-oid="_:oi9te"
          >
            <FormField
              control={methods.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem data-oid="1xzvpm3">
                  <FormControl data-oid="wisfbie">
                    <div className="relative" data-oid="basrl_n">
                      <div
                        className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                        data-oid="q9hbyd8"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          data-oid="sgrwkyi"
                        >
                          <path
                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                            data-oid="p9gbb_c"
                          />

                          <path
                            d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                            data-oid="t86slax"
                          />
                        </svg>
                      </div>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Your email address"
                        autoComplete="email"
                        className="pl-10 py-5 bg-gray-100 border-gray-200"
                        data-oid="5savshp"
                      />
                    </div>
                  </FormControl>
                  <FormMessage
                    className="text-xs text-red-500 mt-1"
                    data-oid="4npf4v."
                  />
                </FormItem>
              )}
              data-oid="azrvvmc"
            />

            {loginLink ?? (
              <div className="flex justify-end py-2" data-oid="o5:gm4z">
                <span className="text-sm text-gray-600" data-oid="vw-s0v9">
                  Have an account?
                </span>
                <ActiveLink
                  to="/login"
                  className="text-sm font-medium text-amber-500 hover:underline ml-1"
                  data-oid="120_stz"
                >
                  Sign in
                </ActiveLink>
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: "24px" }}
              disabled={isLoading}
              data-oid="rsjr370"
            >
              Send reset instructions
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  return (
    <div
      className="bg-[url('/bg-auth-page.png')] bg-cover bg-center"
      data-oid=":.fvnpl"
    >
      <div
        className="container flex min-h-screen flex-col items-center justify-center"
        data-oid="7pkzm8b"
      >
        <div className="w-full max-w-[450px]" data-oid="oeehims">
          {Content}
        </div>
      </div>
    </div>
  );
};
