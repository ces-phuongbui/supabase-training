import * as React from "react";
import {
  type RegisterFormTypes,
  type RegisterPageProps,
  useActiveAuthProvider,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import type { BoxProps } from "@mui/material/Box";
import type { CardContentProps } from "@mui/material/CardContent";

import {
  type BaseRecord,
  type HttpError,
  useRouterContext,
  useRouterType,
  useLink,
  useRegister,
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
import { Button } from "@/components/ui/button";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";

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
  contentProps,
  formProps,
  hideForm,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, RegisterFormTypes>({
    ...useFormProps,
  });

  const authProvider = useActiveAuthProvider();
  const { mutate: registerMutate, isLoading } = useRegister<RegisterFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const Content = (
    <Card
      {...(contentProps ?? {})}
      data-oid="t0:3kq-"
      className="bg-white rounded-lg shadow-md w-full border-white"
    >
      <CardHeader className="py-8" data-oid="rp7lzkk">
        <CardTitle
          className="text-center text-2xl font-bold"
          data-oid="spe3.ov"
        >
          Sign up for your account
        </CardTitle>
      </CardHeader>
      <CardContent data-oid="wcdu1b:">
        {!hideForm && (
          <Form {...methods} data-oid="kdk_-lz">
            <form
              onSubmit={methods.handleSubmit((data) => {
                if (onSubmit) {
                  return onSubmit(data);
                }
                return registerMutate({ ...mutationVariables, ...data });
              })}
              className="space-y-4"
              data-oid="f9a6_f4"
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
                  <FormItem data-oid="lckpz2u">
                    <FormControl data-oid="cnokbnv">
                      <div data-oid="jyqspf7" className="relative">
                        <div
                          className="absolute inset-y-0 left-0 flex items-center w-7 text-gray-600 pl-3"
                          data-oid="zt8s:9-"
                        >
                          <EnvelopeIcon data-oid="ja6_sjm" />
                        </div>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Your email address"
                          autoComplete="email"
                          className="pl-10 py-5 bg-gray-100 border-gray-200"
                          data-oid="ht7nmub"
                        />
                      </div>
                    </FormControl>
                    <FormMessage
                      className="text-xs text-red-500 mt-1"
                      data-oid="gp:.uxo"
                    />
                  </FormItem>
                )}
                data-oid="61rej_0"
              />

              <FormField
                control={methods.control}
                name="password"
                rules={{
                  required: "Password is required",
                }}
                render={({ field }) => (
                  <FormItem data-oid="62bgo2z">
                    <FormControl data-oid="efjgfvh">
                      <div data-oid="dfw.bp5" className="relative">
                        <div
                          className="absolute inset-y-0 left-0 flex items-center w-7 text-gray-600 pl-3"
                          data-oid=".po8ztg"
                        >
                          <LockClosedIcon data-oid="ai_06jh" />
                        </div>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="new-password"
                          className="pl-10 py-5 bg-gray-100 border-gray-200"
                          data-oid="z1s-zuf"
                        />
                      </div>
                    </FormControl>
                    <FormMessage
                      className="text-xs text-red-500 mt-1"
                      data-oid="oeo9iuu"
                    />
                  </FormItem>
                )}
                data-oid="b9itwwf"
              />

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 py-6 text-base font-medium"
                disabled={isLoading}
                data-oid="ue8ib.c"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        )}
        {loginLink ?? (
          <div
            className="mt-6 flex items-center justify-center space-x-1 text-sm"
            data-oid="qoqymqf"
          >
            <span className="text-gray-600" data-oid="s3g5zv4">
              Have an account?
            </span>
            <ActiveLink
              to="/login"
              className="font-medium text-amber-500 hover:underline"
              data-oid="thoc8pj"
            >
              Sign in
            </ActiveLink>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div
      className="bg-[url('/bg-auth-page.png')] bg-cover bg-center"
      data-oid="3-6t2yx"
    >
      <div
        className="container flex min-h-screen flex-col items-center justify-center"
        data-oid="dh_hep1"
      >
        <div className="w-full max-w-[450px]" data-oid="uq68-_.">
          {Content}
        </div>
      </div>
    </div>
  );
};
