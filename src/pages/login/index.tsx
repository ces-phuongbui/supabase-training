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
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import * as React from "react";
import { FormProvider, UseFormProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { BoxProps, CardContentProps } from "@mui/material";

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
  contentProps,
  formProps,
  hideForm,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, LoginFormTypes>({
    ...useFormProps,
  });

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {!hideForm && (
            <div className="flex items-center my-7" data-oid="g3c0xrz">
              <Separator className="flex-1 bg-gray-400" data-oid="cb2y9ac" />
              <span className="text-gray-600 text-sm" data-oid="11arv50">
                or
              </span>
              <Separator className="flex-1 bg-gray-400" data-oid="x-g7.ui" />
            </div>
          )}
          <div className="space-y-2" data-oid="9x0v5no">
            {providers.map((provider: any) => {
              return (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="w-full py-5 border border-gray-200 bg-red-50 text-gray-700 hover:bg-red-100"
                  onClick={() =>
                    login({ ...mutationVariables, providerName: provider.name })
                  }
                  data-oid="jb915l6"
                >
                  {provider.icon}
                  {provider.label}
                </Button>
              );
            })}
          </div>
        </>
      );
    }
    return null;
  };

  const Content = (
    <Card
      {...(contentProps ?? {})}
      className="bg-white rounded-lg shadow-md w-full py-10 border-white"
      data-oid="t4-x26r"
    >
      <CardHeader data-oid="oud08b-">
        <CardTitle
          className="text-center text-2xl font-bold text-primary"
          data-oid="yafq.uw"
        >
          Access Account
        </CardTitle>
        <p
          className="text-center text-gray-600 text-sm mt-1"
          data-oid=":kw:n0s"
        >
          Log in to manage your events effortlessly.
        </p>
      </CardHeader>
      <CardContent data-oid="kz.wdhz">
        {!hideForm && (
          <form
            onSubmit={methods.handleSubmit((data) => {
              if (onSubmit) {
                return onSubmit(data);
              }
              return login({ ...mutationVariables, ...data });
            })}
            className="space-y-4"
            data-oid="yeinhx8"
          >
            <FormField
              control={methods.control}
              name="email"
              rules={{
                required: "Email is required",
              }}
              render={({ field }) => (
                <FormItem data-oid="fr7.ny6">
                  <FormControl data-oid="_n12hzm">
                    <div className="relative" data-oid="ewhj34j">
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
                        data-oid="omrxvaw"
                        className="pl-10 py-5 bg-gray-100 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage
                    data-oid="s8kne.k"
                    className="text-xs text-red-500 mt-1"
                  />
                </FormItem>
              )}
              data-oid="ei4qzd5"
            />

            <FormField
              control={methods.control}
              name="password"
              rules={{
                required: "Password is required",
              }}
              render={({ field }) => (
                <FormItem data-oid="-58yc-e">
                  <FormControl data-oid="xf_pnld">
                    <div className="relative" data-oid="3ffy05u">
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
                        autoComplete="current-password"
                        data-oid="ssej2eo"
                        className="pl-10 py-5 bg-gray-100 border-gray-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage
                    data-oid="ih-_fmp"
                    className="text-xs text-red-500 mt-1"
                  />
                </FormItem>
              )}
              data-oid="wdegr66"
            />

            <div
              className="flex items-center justify-between float-right"
              data-oid="qmfj1.z"
            >
              {forgotPasswordLink ?? (
                <ActiveLink
                  to="/forgot-password"
                  className="text-sm text-amber-500 hover:underline"
                  data-oid="-l7uhjg"
                >
                  Forgot your password?
                </ActiveLink>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 py-6 text-base font-medium"
              disabled={isLoading}
              data-oid=":fjww7d"
            >
              Sign In
            </Button>
          </form>
        )}
        {renderProviders()}
        {registerLink ?? (
          <div
            className="mt-6 flex items-center justify-center space-x-1 text-sm"
            data-oid="t:6l9j7"
          >
            <span className="text-gray-600" data-oid="f:u0-qr">
              Need to create an account?
            </span>
            <ActiveLink
              to="/register"
              className="font-medium text-amber-500 hover:underline"
              data-oid="tmi-wcv"
            >
              Sign Up
            </ActiveLink>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <FormProvider {...methods} data-oid="43c:zce">
      <div
        className="bg-[url('/bg-auth-page.png')] bg-cover bg-center"
        data-oid="b-4-__z"
      >
        <div
          className="container flex min-h-screen flex-col items-center justify-center "
          data-oid="q3w88vx"
        >
          <div className="w-full max-w-[500px]" data-oid="1i.emkt">
            {Content}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
