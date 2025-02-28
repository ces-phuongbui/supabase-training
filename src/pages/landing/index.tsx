import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useGetIdentity, useTranslate, useTranslation } from "@refinedev/core";
import React from "react";
import { Link } from "react-router-dom";
import { AppIcon } from "../../components/app-icon";
import { IUser } from "../../components/header";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ukFlagIcon from "../../assets/united-kingdom.png";
import vnFlagIcon from "../../assets/vietnam.png";

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
    <Box display="flex" gap={2} maxWidth={400}>
      <Box
        fontSize={64}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
      >
        {icon}
      </Box>
      <Box>
        <Typography fontWeight="bold" fontSize={24}>
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </Box>
    </Box>
  );
};

export default function LandingPage() {
  const { data: user } = useGetIdentity<IUser>();
  const translate = useTranslate();

  const { getLocale, changeLocale } = useTranslation();

  const onChangeLang = () => {
    changeLocale(getLocale() === "en" ? "vi" : "en");
  };

  return (
    <Stack>
      <Box
        component="header"
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <AppIcon />
        <Stack direction="row" gap={2}>
          {user ? (
            <Button
              variant="contained"
              component={Link}
              to="/requests"
              size="small"
            >
              {translate("landing-page.dashboard")}
            </Button>
          ) : (
            <>
              <IconButton color="inherit" onClick={onChangeLang}>
                {getLocale() === "en" ? (
                  <Avatar
                    alt="Remy Sharp"
                    src={ukFlagIcon}
                    sx={{ width: 24, height: 24 }}
                    variant="square"
                  />
                ) : (
                  <Avatar
                    alt="Remy Sharp"
                    src={vnFlagIcon}
                    sx={{ width: 24, height: 24 }}
                    variant="square"
                  />
                )}
              </IconButton>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                size="small"
              >
                {translate("landing-page.login")}
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                size="small"
              >
                {translate("landing-page.create-account")}
              </Button>
            </>
          )}
        </Stack>
      </Box>
      <Box>
        <Box pb={{ xs: 5, sm: 20, md: 25, lg: 30 }}>
          <Box px={4} py={10} maxWidth={1280} mx="auto">
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
            >
              {translate("landing-page.hero-title")}
            </Typography>
            <Typography
              variant="subtitle1"
              textAlign="center"
              fontSize={{
                xs: "1rem",
                md: "1.25rem",
              }}
            >
              {translate("landing-page.hero-subtitle")}
            </Typography>
            <Box display="flex" justifyContent="center" mt={4}>
              {user ? (
                <Button variant="contained" component={Link} to="/requests">
                  {translate("landing-page.dashboard")}
                </Button>
              ) : (
                <Button variant="contained" component={Link} to="/requests">
                  {translate("landing-page.start-creating")}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Box bgcolor="primary.main">
          <Box px={{ xs: 2, md: 10 }} maxWidth={1280} mx="auto">
            <img
              src="/hero.png"
              alt="Hero illustration showing RSVP dashboard"
              style={{ width: "100%", marginTop: "-20%" }}
            />
          </Box>
          <Box pb={20} pt={10} color="white" px={4} maxWidth={1280} mx="auto">
            <Box display="flex" gap={4} justifyContent="center" flexWrap="wrap">
              <Feature
                title={translate("landing-page.customizable-rsvp-cards")}
                description={translate(
                  "landing-page.customizable-rsvp-description",
                )}
                icon={<DashboardCustomizeIcon fontSize="inherit" />}
              />
              <Feature
                title={translate("landing-page.track-guests")}
                description={translate("landing-page.track-guests-description")}
                icon={<QuestionMarkIcon fontSize="inherit" />}
              />
              <Feature
                title={translate("landing-page.qr-invitations")}
                description={translate(
                  "landing-page.qr-invitations-description",
                )}
                icon={<QrCode2Icon fontSize="inherit" />}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
