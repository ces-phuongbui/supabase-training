import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import {
  IResourceComponentsProps,
  useGetIdentity,
  useList,
} from "@refinedev/core";
import { CreateButton } from "@refinedev/mui";
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

const EmptyBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    padding={2}
    bgcolor="action.hover"
    borderRadius={2}
    minHeight={200}
    display="flex"
    alignItems="center"
    justifyContent="center"
    data-oid="nvp9.u3"
  >
    {children}
  </Box>
);

const NoRequests: React.FC = () => (
  <Stack gap={4} alignItems="center" data-oid="jwgxv7k">
    <Typography color="palette.text.primary" data-oid="tfvixm7">
      No RSVP requests. You can start creating one by pushing the "Create"
      button.
    </Typography>
    <CreateButton data-oid="js1f17e" />
  </Stack>
);

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

  // const renderContent = () => {
  //   if (!requests) {
  //     return (
  //       <EmptyBox data-oid="wlr2ej4">
  //         <CircularProgress data-oid=".t2h3.d" />
  //       </EmptyBox>
  //     );
  //   }

  //   if (requests.length > 0) {
  //     return <RequestGrid requests={requests} data-oid="lcxwd91" />;
  //   }

  //   return (
  //     <EmptyBox data-oid="2atm3rh">
  //       <NoRequests data-oid="cvgvurx" />
  //     </EmptyBox>
  //   );
  // };

  return (
    <div data-oid="rw:7wxd">
      {requests ? (
        <RequestGrid requests={requests} data-oid="rf_5qb9" />
      ) : (
        <CircularProgress data-oid=".t2h3.d" />
      )}
    </div>
  );
};
