import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext } from "react";
import { useTheme } from "next-themes";
import { ColorModeContext } from "@/contexts/color-mode";

export type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`${
        sticky ? "sticky top-0" : "relative"
      } bg-lightMain dark:bg-background-dark z-10 shadow-sm`}
      data-oid="c52capd"
    >
      <div className="flex h-16 items-center px-6" data-oid="k8505dg">
        <div
          className="flex w-full justify-end items-center gap-6"
          data-oid="7dk77bz"
        >
          <div className="mr-auto" data-oid="jix7nnw">
            <HamburgerMenu data-oid="zjssjcv" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              setMode();
            }}
            data-oid="-1740_q"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" data-oid="6k.b2qf" />
            ) : (
              <Sun className="h-5 w-5" data-oid="n25kjxe" />
            )}
          </Button>

          {(user?.avatar || user?.name) && (
            <div className="flex items-center gap-3" data-oid="mbvs92q">
              {user?.name && (
                <p className="sm:block text-sm font-medium " data-oid="k3bxgta">
                  {user?.name}
                </p>
              )}
              <Avatar className="h-8 w-8 " data-oid="3z:qy.f">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name}
                  data-oid="69drkao"
                />

                <AvatarFallback
                  className="text-sm bg-darkMain dark:bg-lightMain z-10 shadow-sm"
                  data-oid="fmvum41"
                >
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
