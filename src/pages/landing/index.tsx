import { Button } from "@/components/ui/button";
import { useGetIdentity } from "@refinedev/core";
import React from "react";
import { Link } from "react-router-dom";
import { AppIcon } from "../../components/app-icon";
import { IUser } from "../../components/header";
import {
  DocumentIcon,
  QuestionMarkCircleIcon,
  QrCodeIcon,
} from "@heroicons/react/20/solid";

const Feature = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex gap-4 max-w-md p-4" data-oid=":rh1w7n">
      <div
        className="text-6xl flex items-start justify-center"
        data-oid="twc.sp-"
      >
        {icon}
      </div>
      <div data-oid="9l45q:1">
        <h3 className="font-bold text-2xl" data-oid="psw.nxl">
          {title}
        </h3>
        <p className="text-muted-foreground" data-oid="r6sp3u6">
          {description}
        </p>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { data: user } = useGetIdentity<IUser>();

  return (
    <div data-oid="-5_ezb-">
      <header
        className="p-4 flex justify-between items-center"
        data-oid="n8op-8y"
      >
        <AppIcon data-oid="2swkzcr" />
        <div className="flex gap-4" data-oid="4e4f3_9">
          {user ? (
            <Button
              asChild
              className="bg-lightMain dark:bg-darkMain uppercase text-white"
              data-oid="9z8wrmf"
            >
              <Link to="/requests" data-oid="sie:0x:">
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                className="text-orange-500 uppercase border-solid border rounded-sm"
                size="sm"
                data-oid="h9e5d.l"
              >
                <Link to="/login" data-oid="wbxxzaa">
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="bg-lightMain dark:bg-darkMain uppercase text-white rounded-sm"
                size="sm"
                data-oid="yl2dpgr"
              >
                <Link to="/register" data-oid="3cf0dho">
                  Create Account
                </Link>
              </Button>
            </>
          )}
        </div>
      </header>
      <div data-oid="qu520k8">
        <div className="pb-18 md:pb-24 lg:pb-30" data-oid=".m_asgi">
          <div
            className="py-10 px-4 max-w-6xl mx-auto text-center mt-10"
            data-oid="9v77qd0"
          >
            <h1
              className="text-4xl md:text-6xl font-bold text-center text-orange-500"
              data-oid="_u4gv5f"
            >
              Quick Online RSVP Creation and Management
            </h1>
            <p
              className="text-base md:text-xl text-center text-muted-foreground mt-4"
              data-oid="69g:f_o"
            >
              Create customizable RSVP quickly and send them online. No more
              manually counting cards. Easily determine number of attendees.
            </p>
            <div className="flex justify-center mt-8" data-oid="qx.y.x1">
              {user ? (
                <Button
                  asChild
                  className="bg-lightMain dark:bg-darkMain uppercase text-white rounded-sm"
                  data-oid="pvnt5qr"
                >
                  <Link to="/requests" data-oid="s37wt8n">
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-lightMain dark:bg-darkMain uppercase text-white rounded-sm"
                  data-oid="tmo3:_b"
                >
                  <Link to="/requests" data-oid="9sp364v">
                    Start Creating
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div
          className="bg-lightMain dark:bg-darkMain text-primary-foreground"
          data-oid="mfp2p7r"
        >
          <div className="px-4 md:px-10 max-w-6xl mx-auto" data-oid="w8mx38u">
            <img
              src="/hero.png"
              alt="Hero illustration showing RSVP dashboard"
              className="w-full"
              data-oid="v-hnq7m"
            />
          </div>
          <div
            className="pb-20 pt-10 px-4 max-w-7xl mx-auto text-white"
            data-oid="xm66tp2"
          >
            <div
              className="flex gap-8 justify-center flex-wrap"
              data-oid="k0-1i:x"
            >
              <Feature
                title="Customizable RSVP Cards"
                description="Simple customizable options to quickly create RSVP cards and still make it unique."
                icon={
                  <DocumentIcon
                    className="w-16 h-16 text-white"
                    data-oid="6.gc95b"
                  />
                }
                data-oid="g9dpq44"
              />

              <Feature
                title="Track Guests, Plan Smart"
                description="Attendees confirm participation and specify guest count, enabling organizers to optimize seating and plan efficiently."
                icon={
                  <QuestionMarkCircleIcon
                    className="w-16 h-16 text-white"
                    data-oid="9o-h:bv"
                  />
                }
                data-oid="e2phc.p"
              />

              <Feature
                title="Invitations Via QR Codes"
                description="Spread your invitations through portable QR Codes. Copy them as images and send."
                icon={
                  <QrCodeIcon
                    className="w-16 h-16 text-white"
                    data-oid="-d85j_w"
                  />
                }
                data-oid="8z9-4u:"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
