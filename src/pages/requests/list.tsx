import { Button } from "@/components/ui/button";
import { Box, CircularProgress } from "@mui/material";
import {
  IResourceComponentsProps,
  useGetIdentity,
  useList,
} from "@refinedev/core";
import { LatLngExpression } from "leaflet";
import React from "react";
import { IUser } from "../../components/header";
import RequestListCard from "../../components/request-card/list-card";

export interface IRequest {
  id: string;
  background_color: string;
  title: string;
  address: string;
  acceptance_label: string;
  rejection_label: string;
  close_date: string;
  secondary_color: string;
  primary_color: string;
  font_family: string;
  italicize: boolean;
  background_gradient: boolean;
  background_image: string;
  secondary_gradient: boolean;
  style: string;
  position: LatLngExpression;
}

export interface IResponse {
  id: string;
  responder_name: string;
  accepted_at: string;
  num_attendees: number;
  accept: boolean;
}

const RequestGrid: React.FC<{
  requests: IRequest[];
}> = ({ requests }) => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(2, 1fr)"
    gap={4}
    width="100%"
    data-oid="5cl6q42"
  >
    {requests.map((req) => (
      <RequestListCard key={req.id} request={req} data-oid="qi_a41e" />
    ))}
  </Box>
);

export const RequestList: React.FC<IResourceComponentsProps> = () => {
  const { data: user } = useGetIdentity<IUser>();
  const { data } = useList<IRequest>({
    resource: "requests",
    queryOptions: {
      enabled: !!user,
    },
    filters: [
      {
        field: "user_id",
        operator: "eq",
        value: user?.id,
      },
    ],
  });

  const requests = data?.data;

  return (
    <div data-oid="rw:7wxd">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="ui0xp5k"
      >
        <h1 className="text-2xl font-semibold" data-oid="4kimmww">
          Your Events
        </h1>
        <Button
          variant="default"
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={() => (window.location.href = "/requests/create")}
          data-oid="8htfvwi"
        >
          Add New Event
        </Button>
      </div>
      {requests ? (
        <RequestGrid requests={requests} data-oid="rf_5qb9" />
      ) : (
        <div data-oid="bnw4io6">
          <CircularProgress data-oid=".t2h3.d" />
        </div>
      )}
    </div>
  );
};
