import RsvpIcon from "@mui/icons-material/Rsvp";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DeleteButton, ShowButton } from "@refinedev/mui";
import { Link } from "react-router-dom";
import { IRequest } from "../../pages/requests/list";

interface Props {
  request: IRequest;
}

export default function RequestListCard({ request }: Props) {
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
        <Box padding={2} display="flex" flexDirection="column" height="100%" justifyContent="flex-end">
          <Stack>
            <Typography fontWeight="bold" fontSize={12}>
              Close Date
            </Typography>
            <Typography>{request.close_date}</Typography>
          </Stack>
          <Stack mt={2}>
            <Typography fontWeight="bold">Actions</Typography>
            <Stack gap={2} direction="row" alignItems="center">
              <ShowButton hideText recordItemId={request.id} />
              <DeleteButton hideText recordItemId={request.id} />
              <Tooltip title="See how your guests will see your invite.">
                <IconButton component={Link} to={`/r/${request.id}`} color="primary">
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
