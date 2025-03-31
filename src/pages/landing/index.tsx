import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useGetIdentity } from "@refinedev/core";
import React from "react";
import { Link } from "react-router-dom";
import { AppIcon } from "../../components/app-icon";
import { IUser } from "../../components/header";

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
    <Box display="flex" gap={2} maxWidth={400} data-oid="8kw_flw">
      <Box
        fontSize={64}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        data-oid="s9e_205"
      >
        {icon}
      </Box>
      <Box data-oid=".fbjte.">
        <Typography fontWeight="bold" fontSize={24} data-oid="d94sjk4">
          {title}
        </Typography>
        <Typography data-oid="5rw67qq">{description}</Typography>
      </Box>
    </Box>
  );
};

export default function LandingPage() {
  const { data: user } = useGetIdentity<IUser>();

  return (
    <Stack data-oid="gjnc1ig">
      <Box
        component="header"
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        data-oid="e_9vvdy"
      >
        <AppIcon data-oid=".:r3w9d" />
        <Stack direction="row" gap={2} data-oid="z:9526s">
          {user ? (
            <Button
              variant="contained"
              component={Link}
              to="/requests"
              size="small"
              data-oid="tx8w7e3"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                size="small"
                data-oid=".3vww5m"
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                size="small"
                data-oid="lywjh-e"
              >
                Create Account
              </Button>
            </>
          )}
        </Stack>
      </Box>
      <Box data-oid="5-5do0w">
        <Box pb={{ xs: 5, sm: 20, md: 25, lg: 30 }} data-oid="u7n_g58">
          <Box px={4} py={10} maxWidth={1280} mx="auto" data-oid="xi.o:_j">
            <Typography
              component="h1"
              variant="h2"
              fontWeight="bold"
              textAlign="center"
              color="primary.main"
              fontSize={{
                xs: "2.5rem",
                md: "3.75rem",
              }}
              data-oid="02n_q4g"
            >
              Quick Online RSVP Creation and Management
            </Typography>
            <Typography
              variant="subtitle1"
              textAlign="center"
              fontSize={{
                xs: "1rem",
                md: "1.25rem",
              }}
              data-oid="zqwyfnh"
            >
              Create customizable RSVP quickly and send them online. No more
              manually counting cards. Easily determine number of attendees.
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              mt={4}
              data-oid=".t9-0e2"
            >
              {user ? (
                <Button
                  variant="contained"
                  component={Link}
                  to="/requests"
                  data-oid="no:n00_"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  variant="contained"
                  component={Link}
                  to="/requests"
                  data-oid="g.tsuyw"
                >
                  Start Creating
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Box bgcolor="primary.main" data-oid="iy3s4o-">
          <Box
            px={{ xs: 2, md: 10 }}
            maxWidth={1280}
            mx="auto"
            data-oid="m.rgy67"
          >
            <img
              src="/hero.png"
              alt="Hero illustration showing RSVP dashboard"
              style={{ width: "100%", marginTop: "-20%" }}
              data-oid="8dgvkar"
            />
          </Box>
          <Box
            pb={20}
            pt={10}
            color="white"
            px={4}
            maxWidth={1280}
            mx="auto"
            data-oid="6xt-c9e"
          >
            <Box
              display="flex"
              gap={4}
              justifyContent="center"
              flexWrap="wrap"
              data-oid="r4c7q4q"
            >
              <Feature
                title="Customizable RSVP Cards"
                description="Simple customizable options to quickly create RSVP cards and still make it unique."
                icon={
                  <DashboardCustomizeIcon
                    fontSize="inherit"
                    data-oid="o7g11hn"
                  />
                }
                data-oid="so_x90m"
              />

              <Feature
                title="Track Guests, Plan Smart"
                description="Attendees confirm participation and specify guest count, enabling organizers to optimize seating and plan efficiently."
                icon={
                  <QuestionMarkIcon fontSize="inherit" data-oid=":4csm48" />
                }
                data-oid="laaj2k3"
              />

              <Feature
                title="Invitations Via QR Codes"
                description="Spread your invitations through portable QR Codes. Copy them as images and send."
                icon={<QrCode2Icon fontSize="inherit" data-oid=".u3_.v1" />}
                data-oid="caeaqrz"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
