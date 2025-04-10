import { Button } from "@/components/ui/button";
import { useGetIdentity } from "@refinedev/core";
import React from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../components/header";
import {
  CalendarIcon,
  CheckCircleIcon,
  PhotoIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import { AppIcon } from "@/components/app-icon";

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
    <div
      className="flex flex-col items-center text-center max-w-xs p-4"
      data-oid="tlh9i5u"
    >
      <div className="mb-4" data-oid="21cy8u9">
        {icon}
      </div>
      <div data-oid="85czip3">
        <h3 className="font-bold text-lg mb-2" data-oid="qi_0z__">
          {title}
        </h3>
        <p className="text-sm text-gray-600" data-oid=":xb7der">
          {description}
        </p>
      </div>
    </div>
  );
};

const InvitationCard = ({
  title,
  address,
  date,
  image,
}: {
  title: string;
  address: string;
  date: string;
  image: string;
}) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md max-w-xs"
      data-oid="4tvz0ch"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover"
        data-oid="asof1fu"
      />

      <div className="p-4" data-oid="e4gh2zb">
        <h3 className="font-medium text-gray-800" data-oid="2c:agqe">
          {title}
        </h3>
        <div className="text-sm text-gray-600 mt-1" data-oid="i_mfhq8">
          <p data-oid="f0l8w4e">{address}</p>
          <p data-oid="dmrm6cz">Date: {date}</p>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { data: user } = useGetIdentity<IUser>();

  return (
    <div data-oid=":25c4nw">
      <header
        className="p-4 flex justify-between items-center"
        data-oid="0-sd899"
      >
        <AppIcon data-oid="2swkzcr" />
        <div className="flex items-center gap-4" data-oid="9-db32p">
          <Button
            className="flex items-center text-amber-600 border border-amber-600 rounded-full px-4 py-2 text-sm hover:bg-amber-50 transition-colors"
            data-oid="_ht6:ex"
          >
            {!user && <ArrowRightCircleIcon data-oid="8jp1xvw" />}
            <Link to={user ? "/requests" : "/login"} data-oid="_bbbtox">
              {user ? "Dashboard" : "Sign In"}
            </Link>
          </Button>
        </div>
      </header>
      <div data-oid="7l7mgh2">
        <div
          className="relative pb-18 md:pb-24 lg:pb-30 bg-[url('/bg-landing.png')] bg-cover bg-center bg-no-repeat min-h-[70vh] "
          data-oid="_nri:.r"
        >
          <div
            className="absolute inset-0 bg-black/50 mix-blend-multiply opacity-50"
            data-oid="l9nt4iq"
          ></div>

          <div
            className="max-w-6xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-center"
            data-oid="ezwd_d6"
          >
            <h1
              className="text-4xl md:text-6xl font-bold text-center text-white z-50"
              data-oid="yv9peg3"
            >
              Quick Online RSVP Creation and Management
            </h1>
            <p
              className="text-base md:text-xl text-center text-muted-foreground mt-4 text-white z-50"
              data-oid="wkk28i-"
            >
              Create customizable RSVP quickly and send them online. No more
              manually counting cards. Easily determine number of attendees.
            </p>
            <div className="flex justify-center mt-8" data-oid="49y.asv">
              <Button
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md uppercase"
                data-oid=":jqvl36"
              >
                <Link to={user ? "/requests" : "/login"} data-oid=".q1oeii">
                  {user ? "Dashboard" : "Start Creating"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="py-16" data-oid="4i6kgxl">
          <h2
            className="text-3xl font-bold text-center mb-12"
            data-oid="lh.7t2a"
          >
            Key Features Overview
          </h2>
          <div
            className="flex flex-wrap justify-center gap-20 px-4 max-w-8xl mx-auto"
            data-oid="zhaxggb"
          >
            <Feature
              title="Easy Event Creation"
              description="User-friendly tools for seamless event setup and customization."
              icon={
                <div
                  className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center"
                  data-oid="qol:0uz"
                >
                  <CalendarIcon className="w-8 h-8" data-oid="q07ydin" />
                </div>
              }
              data-oid=".xgt2mg"
            />

            <Feature
              title="Real-Time RSVPs"
              description="Instant notifications keep you updated on guest responses."
              icon={
                <div
                  className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center"
                  data-oid="99zgtty"
                >
                  <CheckCircleIcon className="w-8 h-8" data-oid="w9.oev1" />
                </div>
              }
              data-oid="qp29mhh"
            />

            <Feature
              title="Custom Invitations"
              description="Design and personalize stunning invitations to match your event's theme."
              icon={
                <div
                  className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center"
                  data-oid="4o0j39g"
                >
                  <PhotoIcon className="w-8 h-8" data-oid="fk.ba18" />
                </div>
              }
              data-oid="j7-fe.0"
            />
          </div>
        </div>

        <div className="bg-gray-50 pb-5" data-oid="zmgo2q.">
          <div className="max-w-7xl mx-auto px-4" data-oid="y-zeo-b">
            <h2
              className="text-3xl font-bold text-center mb-12"
              data-oid="ncugane"
            >
              Create Invitations For Any Occasion
            </h2>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              data-oid="l2oszo4"
            >
              <InvitationCard
                title="John's Wedding"
                address="Rose Garden"
                date="25th Nov 2023"
                image="/wedding.avif"
                data-oid="120nm8x"
              />

              <InvitationCard
                title="Seminar"
                address="Business Growth"
                date="12th Dec 2023"
                image="/seminar.avif"
                data-oid="7.j4_hp"
              />

              <InvitationCard
                title="John's Birthday"
                address="John's Birthday"
                date="7th Jan 2024"
                image="/birthday.avif"
                data-oid="ch1_eqd"
              />

              <InvitationCard
                title="Picnic"
                address="Green Valley"
                date="2nd Feb 2024"
                image="/picnic.avif"
                data-oid="d36dm58"
              />
            </div>
          </div>
        </div>

        <div className="py-16 bg-amber-500 text-white" data-oid="p:rf0kh">
          <div
            className="max-w-4xl mx-auto px-4 text-center"
            data-oid="et-5_sh"
          >
            <h2 className="text-3xl font-bold mb-4" data-oid="_ugexhn">
              Ready to create your first invitation?
            </h2>
            <p className="mb-8" data-oid="9phk6k4">
              Join thousands of users who are creating beautiful invitations and
              managing RSVPs effortlessly.
            </p>
            <div
              className="flex flex-wrap justify-center gap-4"
              data-oid="dj8yga2"
            >
              {user ? (
                <Button
                  asChild
                  className="bg-white text-amber-500 hover:bg-gray-100 px-6 py-2 rounded-md"
                  data-oid="pu26stl"
                >
                  <Link to="/requests/create" data-oid="d0wj-ki">
                    Create New Invitation
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-white text-amber-500 hover:bg-gray-100 px-6 py-2 rounded-md"
                  data-oid="6d1wyg3"
                >
                  <Link to="/register" data-oid="bz.xmql">
                    Create Account
                  </Link>
                </Button>
              )}

              <Button
                asChild
                className="bg-transparent border border-white text-white hover:bg-amber-600 px-6 py-2 rounded-md"
                data-oid="2k2ssuk"
              >
                <Link to="/about" data-oid="am-n7rn">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <footer className="bg-[#7f7f7f] py-12" data-oid="jtxk-c1">
          <div className="max-w-6xl mx-auto px-4" data-oid="ixjj95z">
            <div
              className="flex flex-col md:flex-row justify-between items-start"
              data-oid="itzo_4u"
            >
              <div className="mb-8 md:mb-0 md:w-1/3" data-oid="e1i:tk9">
                <div className="flex items-center mb-4" data-oid="45szef_">
                  <div
                    className="text-2xl font-semibold text-amber-400 flex items-center"
                    data-oid="::zae7d"
                  >
                    <AppIcon data-oid="ej_9dxu" />
                  </div>
                </div>
                <p className="text-white mb-6" data-oid="ret7r6z">
                  Easily create invitations and track guest attendance with
                  RSVQuick. Our platform simplifies event planning, ensuring you
                  stay organized and informed about who’s attending. Start your
                  event with a conversation, and let us handle the rest!
                </p>
                <div className="flex space-x-4 pt-2" data-oid="5t3.rn8">
                  <a
                    href="https://www.facebook.com/codeengine"
                    className="text-white cursor-pointer"
                    data-oid=".5dfyez"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      data-oid="g3_sgmo"
                    >
                      <path
                        d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"
                        data-oid="9o36xou"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/codeenginestudio"
                    className="text-white cursor-pointer"
                    data-oid="g7oljny"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      data-oid="2whxfde"
                    >
                      <path
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        data-oid=".wmzuxn"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="space-y-6 md:w-1/2" data-oid="av.-l0k">
                <div data-oid="xa-d.4q">
                  <h3
                    className="text-white font-medium mb-2"
                    data-oid="06wlxk8"
                  >
                    Email
                  </h3>
                  <p className="text-white " data-oid="5ci9gn4">
                    info@codeenginestudio.com
                  </p>
                </div>

                <div data-oid="7vsjait">
                  <h3
                    className="text-white font-medium mb-2"
                    data-oid="3hkgkzc"
                  >
                    Phone
                  </h3>
                  <p className="text-white" data-oid="ta64wiz">
                    +1 516-900-4080
                  </p>
                </div>

                <div data-oid="7uggu7x">
                  <h3
                    className="text-white font-medium mb-2"
                    data-oid="2py7jp0"
                  >
                    Address
                  </h3>
                  <address className="text-white not-italic" data-oid="tw5gvvu">
                    32-34 Nguyen Ba Hoc, Binh Thuan, Hai Chau
                    <br data-oid="nt16s48" />
                    Da Nang
                    <br data-oid="78j-z:4" />
                    Viet Nam, 550000
                  </address>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
