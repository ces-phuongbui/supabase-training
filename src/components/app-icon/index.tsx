import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import logo from "/logo.png";

export const AppIcon: React.FC<{ collapsed?: boolean; size?: number }> = ({
  collapsed = false,
  size = 30,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      component={Link}
      to="/requests"
      data-oid="sypk8yx"
    >
      <img
        src={collapsed ? logo : logo}
        width={collapsed ? 25 : size}
        data-oid="ndy:.5_"
      />

      {!collapsed ? (
        <span
          className="text-xl font-semibold text-amber-500 ml-2"
          data-oid="xo.l_iu"
        >
          InviteMe
        </span>
      ) : null}
    </Box>
  );
};
