import React from "react";
import { useParams } from "react-router-dom";
import { HttpError, useOne } from "@refinedev/core";
import { IRequest } from "../requests/list";
import { MapPin } from "lucide-react";
import Map, { DEFAULT_POSITION } from "../requests/map";
import { formatEventDate } from "@/helpers";

export default function ThankYouPage() {
  const { id } = useParams();
  const { data } = useOne<IRequest, HttpError>({
    resource: "requests",
    id,
  });
  const event = data?.data;
  const {
    address = "",
    position = DEFAULT_POSITION,
    activity_date,
    activity_time,
  } = event || {};
  const { day, monthYear } = formatEventDate(activity_date);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      data-oid="_2t9z-l"
    >
      <div className="w-full max-w-4xl overflow-hidden" data-oid="87w1b0g">
        <div
          className="p-6 md:p-8 flex flex-col items-center"
          data-oid="2roi3n4"
        >
          <h1
            className="text-3xl md:text-5xl font-bold text-center mb-2"
            data-oid="txmut9n"
          >
            Thank you for responding!
          </h1>
          <p className="text-gray-600 text-center mb-8" data-oid="0.sr-kq">
            Your RSVP has been received. We appreciate you letting us know.
          </p>

          <div
            className="text-5xl md:text-6xl font-bold mb-1"
            data-oid="1mzo_:z"
          >
            {day}
          </div>
          <p className="text-gray-500 mb-6" data-oid="4oaxr.l">
            {monthYear}
          </p>

          <div
            className="text-3xl md:text-4xl font-bold mb-1"
            data-oid="uar5uzs"
          >
            {activity_time}
          </div>
          <div
            className="flex items-center text-gray-600 mb-6"
            data-oid="9bucy-k"
          >
            <MapPin className="w-4 h-4 mr-1" data-oid="bf0gomr" />
            <span data-oid="dujjv:_">{address}</span>
          </div>

          <p className="text-center text-gray-700 mb-6" data-oid="tun9ak8">
            We are excited to have you join us for a special occasion.
          </p>

          <Map
            address={address}
            position={position}
            height="45vh"
            data-oid="pd0dm:r"
          />
        </div>
      </div>
    </div>
  );
}
