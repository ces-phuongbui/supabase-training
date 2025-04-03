import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import tc from "tinycolor2";

interface BackgroundProps {
  readonly children: React.ReactNode;
  readonly backgroundColor: string;
  readonly background_gradient?: boolean;
  readonly responseView?: boolean;
  readonly backgroundImage?: string;
  readonly className?: string;
}

export default function Background({
  children,
  backgroundColor,
  responseView = false,
  background_gradient = false,
  backgroundImage,
  className,
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
      const lightColor = tc(backgroundColor).lighten(30).toString();
      const analogousColor = tc(backgroundColor).analogous()[0].toString();

      return `radial-gradient(
        ${lightColor},
        ${backgroundColor},
        ${analogousColor}
      )`;
    }

    return backgroundColor;
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center",
        "px-4 md:p-8",
        responseView ? "min-h-screen" : "min-h-full",
        "transition-opacity duration-500 ease-in-out",
        loadedImage || !backgroundImage ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        backgroundColor: backgroundColor,
        background: getBackground(),
        backgroundSize: backgroundImage ? "cover" : "auto",
        backgroundPosition: backgroundImage ? "center" : "initial",
        backgroundRepeat: backgroundImage ? "no-repeat" : "repeat",
      }}
      data-oid="4bpelf1"
    >
      {children}
    </div>
  );
}
