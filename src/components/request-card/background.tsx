import Box from "@mui/material/Box";
import { lighten } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import tc from "tinycolor2";

interface BackgroundProps {
  readonly children: React.ReactNode;
  readonly backgroundColor: string;
  readonly background_gradient?: boolean;
  readonly responseView?: boolean;
  readonly backgroundImage?: string;
}

export default function Background({
  children,
  backgroundColor,
  responseView = false,
  background_gradient = false,
  backgroundImage,
}: BackgroundProps) {
  const [loadedImage, setLoadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => setLoadedImage(backgroundImage);
    }
  }, [backgroundImage]);

  const getBackground = () => {
    if (backgroundImage) {
      return `url(${backgroundImage})`;
    }

    if (background_gradient) {
      const lightColor = lighten(backgroundColor, 0.3);
      const analogousColor = tc(backgroundColor).analogous().toString();

      return `radial-gradient(
                ${lightColor},
                ${backgroundColor},
                ${analogousColor}
            )`;
    }

    return backgroundColor;
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={backgroundColor}
      sx={{
        background: getBackground(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "opacity 0.5s ease-in-out",
        opacity: loadedImage || !backgroundImage ? 1 : 0,
      }}
      padding={{ xs: 1, md: 8 }}
      minHeight={responseView ? "100vh" : "100%"}
      data-oid="tx1_ty0"
    >
      {children}
    </Box>
  );
}
