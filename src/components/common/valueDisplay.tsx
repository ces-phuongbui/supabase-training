import { Stack, Typography } from "@mui/material";
import {
  BooleanField,
  DateField,
  NumberField,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import React from "react";
import Box from "@mui/material/Box";

interface ValueDisplayProps {
  readonly label: string;
  readonly value: number | string | undefined | boolean;
  readonly isDate?: boolean;
  readonly isColor?: boolean;
  readonly isImage?: boolean;
}

export default function ValueDisplay({
  label,
  value,
  isDate = false,
  isColor = false,
  isImage = false,
}: ValueDisplayProps) {
  let valueDisplay: React.ReactNode | null = null;

  const normalizedLabel = label.toLowerCase().trim();

  const excludedLabels = ["id", "user id"];

  if (excludedLabels.includes(normalizedLabel)) {
    return null;
  }

  const renderStringValue = (val: string) => {
    if (isDate) {
      return <DateField value={val} data-oid="0:_irjj" />;
    }

    if (isColor) {
      return (
        <Box bgcolor={val} width={50} height={50} data-oid="t.8nyva"></Box>
      );
    }

    if (isImage) {
      return (
        <Box
          sx={{
            width: 100,
            height: 100,
            backgroundImage: `url(${val})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            border: "1px solid #ddd",
          }}
          data-oid="pcs.vrk"
        />
      );
    }

    return <TextField value={val} data-oid="5-1as9c" />;
  };

  switch (typeof value) {
    case "string":
      valueDisplay = renderStringValue(value);
      break;
    case "number":
      valueDisplay = <NumberField value={value} data-oid="3m5l51b" />;
      break;
    case "boolean":
      valueDisplay = <BooleanField value={value} data-oid="ps-hr_7" />;
      break;
    default:
      break;
  }

  return (
    <Stack spacing={2} data-oid="6u8dgrz">
      <Typography
        variant="body1"
        textTransform={"capitalize"}
        fontWeight="bold"
        data-oid="lfesxvl"
      >
        {label}
      </Typography>
      {valueDisplay}
    </Stack>
  );
}
