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
      return <DateField value={val} />;
    }

    if (isColor) {
      return <Box bgcolor={val} width={50} height={50}></Box>;
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
        />
      );
    }

    return <TextField value={val} />;
  };

  switch (typeof value) {
    case "string":
      valueDisplay = renderStringValue(value);
      break;
    case "number":
      valueDisplay = <NumberField value={value} />;
      break;
    case "boolean":
      valueDisplay = <BooleanField value={value} />;
      break;
    default:
      break;
  }

  return (
    <Stack spacing={2}>
      <Typography
        variant="body1"
        textTransform={"capitalize"}
        fontWeight="bold"
      >
        {label}
      </Typography>
      {valueDisplay}
    </Stack>
  );
}
