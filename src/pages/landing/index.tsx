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
    <div className="flex gap-4 max-w-md p-4">
      <div className="text-6xl flex items-start justify-center">{icon}</div>
      <div>
        <h3 className="font-bold text-2xl">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { data: user } = useGetIdentity<IUser>();

  return (
    <div>
      <header className="p-4 flex justify-between items-center">
        <AppIcon />
        <div className="flex gap-4">
          {user ? (
            <Button
              asChild
              className="bg-lightMain dark:bg-darkMain uppercase text-white"
            >
              <Link to="/requests">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                className="text-orange-500 uppercase border-solid border rounded-sm"
                size="sm"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-lightMain dark:bg-darkMain uppercase text-white rounded-sm"
                size="sm"
              >
                <Link to="/register">Create Account</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      <div>
        <div className="pb-18 md:pb-24 lg:pb-30">
          <div className="py-10 px-4 max-w-6xl mx-auto text-center mt-10">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-orange-500">
              Quick Online RSVP Creation and Management
            </h1>
            <p className="text-base md:text-xl text-center text-muted-foreground mt-4">
              Create customizable RSVP quickly and send them online. No more
              manually counting cards. Easily determine number of attendees.
            </p>
            <div className="flex justify-center mt-8">
              {user ? (
                <Button
                  asChild
                  className="bg-lightMain dark:bg-darkMain uppercase text-white rounded-sm"
                >
                  <Link to="/requests">Dashboard</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-lightMain dark:bg-darkMain uppercase text-white rounded-sm"
                >
                  <Link to="/requests">Start Creating</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-lightMain dark:bg-darkMain text-primary-foreground">
          <div className="px-4 md:px-10 max-w-6xl mx-auto">
            <img
              src="/hero.png"
              alt="Hero illustration showing RSVP dashboard"
              className="w-full"
            />
          </div>
          <div className="pb-20 pt-10 px-4 max-w-7xl mx-auto text-white">
            <div className="flex gap-8 justify-center flex-wrap">
              <Feature
                title="Customizable RSVP Cards"
                description="Simple customizable options to quickly create RSVP cards and still make it unique."
                icon={<DocumentIcon className="w-16 h-16 text-white" />}
              />

              <Feature
                title="Track Guests, Plan Smart"
                description="Attendees confirm participation and specify guest count, enabling organizers to optimize seating and plan efficiently."
                icon={
                  <QuestionMarkCircleIcon className="w-16 h-16 text-white" />
                }
              />

              <Feature
                title="Invitations Via QR Codes"
                description="Spread your invitations through portable QR Codes. Copy them as images and send."
                icon={<QrCodeIcon className="w-16 h-16 text-white" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
