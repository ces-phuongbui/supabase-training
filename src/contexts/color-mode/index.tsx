import { ThemeProvider } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const LIGHT_MODE = "light";
const DARK_MODE = "dark";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType,
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const systemPreference = isSystemPreferenceDark ? DARK_MODE : LIGHT_MODE;
  const [mode, setMode] = useState(
    colorModeFromLocalStorage ?? systemPreference,
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const contextValue = React.useMemo(
    () => ({
      setMode: () => {
        setMode((prevMode) =>
          prevMode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE,
        );
      },
      mode,
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={contextValue} data-oid="knf0-pl">
      <ThemeProvider
        theme={
          mode === LIGHT_MODE ? RefineThemes.Orange : RefineThemes.OrangeDark
        }
        data-oid="j--7i2l"
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          data-oid="tzbkgfz"
        >
          {children}
        </NextThemesProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
