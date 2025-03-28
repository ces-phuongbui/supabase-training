import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AppIcon } from "../../components/app-icon";

export default function ThankYouPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={8}
      minHeight="100vh"
      border={20}
      borderColor="primary.main"
      data-oid="c1lfsg_"
    >
      <Stack gap={2} alignItems="center" data-oid="e-teqop">
        <AppIcon size={300} data-oid="w1v6_3f" />
        <Typography
          fontSize={{ xs: 24, md: 35 }}
          fontWeight="bold"
          textAlign="center"
          data-oid="mktzcrg"
        >
          Thank you for responding!
        </Typography>
      </Stack>
    </Box>
  );
}
