import RsvpIcon from "@mui/icons-material/Rsvp";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DeleteButton, ShowButton, useDataGrid } from "@refinedev/mui";
import { Link } from "react-router-dom";
import { IRequest, IResponse } from "../../pages/requests/list";
import { useMemo } from "react";
import { useTranslate } from "@refinedev/core";

interface Props {
  request: IRequest;
}

export default function RequestListCard({ request }: Props) {
  const { dataGridProps: responseData } = useDataGrid<IResponse>({
    resource: "responses",
    queryOptions: {
      enabled: !!request,
    },
    filters: {
      permanent: [
        {
          field: "request_id",
          operator: "eq",
          value: request?.id ?? "",
        },
      ],
    },
  });

  const translate = useTranslate();

  const totalGuests = useMemo(
    () => responseData.rows.reduce((sum, item) => sum + item.num_attendees, 0),
    [responseData],
  );

  return (
    <Card elevation={3} sx={{ flex: 1, minWidth: 250 }}>
      <Stack justifyContent="space-between" height="100%">
        <Box padding={2} bgcolor={request.secondary_color}>
          <MuiLink
            component={Link}
            to={`/requests/show/${request.id}`}
            underline="hover"
            sx={{ textDecorationColor: `${request.primary_color} !important` }}
          >
            <Typography color={request.primary_color} fontWeight="bold">
              {request.title}
            </Typography>
          </MuiLink>
        </Box>
        <Box
          padding={2}
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="flex-end"
        >
          <Box
            paddingRight={10}
            display="flex"
            height="100%"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Stack>
                <Typography fontWeight="bold" fontSize={12}>
                  {translate("request-card.list-card.attendees")}
                </Typography>
                <Typography>{totalGuests}</Typography>
              </Stack>
              <Stack>
                <Typography fontWeight="bold" fontSize={12}>
                  {translate("request-card.list-card.close-date")}
                </Typography>
                <Typography>{request.close_date}</Typography>
              </Stack>
            </Stack>
          </Box>
          <Stack mt={2}>
            <Typography fontWeight="bold">
              {translate("request-card.list-card.actions")}
            </Typography>
            <Stack gap={2} direction="row" alignItems="center">
              <ShowButton hideText recordItemId={request.id} />
              <DeleteButton hideText recordItemId={request.id} />
              <Tooltip title={translate("request-card.list-card.preview")}>
                <IconButton
                  component={Link}
                  to={`/r/${request.id}`}
                  color="primary"
                >
                  <RsvpIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
