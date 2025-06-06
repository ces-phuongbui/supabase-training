import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React from "react";

export type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { data: user } = useGetIdentity<IUser>();

  return (
    <div
      className={`${
        sticky ? "sticky top-0" : "relative"
      } bg-white dark:bg-background-dark z-10 shadow-sm`}
      data-oid="28p5nrb"
    >
      <div className="flex h-16 items-center px-6" data-oid="ex76u_z">
        <div
          className="flex w-full justify-end items-center gap-6"
          data-oid="yhdqdw5"
        >
          <div className="mr-auto" data-oid="3a8ezn2">
            <HamburgerMenu data-oid="bwd1o-k" />
          </div>

          {(user?.avatar || user?.name) && (
            <div className="flex items-center gap-3" data-oid="vqqmdy2">
              {user?.name && (
                <p className="sm:block text-sm font-medium " data-oid="kp-53qv">
                  {user?.name}
                </p>
              )}
              <Avatar className="h-8 w-8 " data-oid="v_fqqtj">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name}
                  data-oid=":v3orl8"
                />

                <AvatarFallback
                  className="text-sm bg-darkMain dark:bg-lightMain z-10 shadow-sm"
                  data-oid="l5-g:xj"
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
