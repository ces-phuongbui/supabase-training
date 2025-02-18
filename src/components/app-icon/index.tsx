import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import logo from "/ces-logo.png";
import icon from "/ces-icon.png";

export const AppIcon: React.FC<{ collapsed?: boolean; size?: number }> = ({
  collapsed = false,
  size = 90,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      component={Link}
      to="/requests"
    >
      <img src={collapsed ? icon : logo} width={collapsed ? 25 : size} />
    </Box>
  );
};
