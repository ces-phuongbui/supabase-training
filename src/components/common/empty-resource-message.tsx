import Box from "@mui/material/Box";

interface EmptyResourceMessageProps {
  readonly message: string;
  readonly padding?: number;
}

export default function EmptyResourceMessage({
  message,
  padding = 4,
}: EmptyResourceMessageProps) {
  return (
    <Box
      bgcolor="action.hover"
      p={padding}
      display="flex"
      justifyContent="center"
      alignItems="center"
      data-oid="7hfh_4p"
    >
      {message}
    </Box>
  );
}
