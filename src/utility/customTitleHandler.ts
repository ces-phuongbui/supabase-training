import type { Action, IResourceItem } from "@refinedev/core";

const capitalize = (str: string) => {
  const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalizedStr;
};

type handler =
  | ((options: {
      resource?: IResourceItem | undefined;
      action?: Action | undefined;
      params?: Record<string, string | undefined> | undefined;
      pathname?: string | undefined;
      autoGeneratedTitle: string;
    }) => string)
  | undefined;

const customTitleHandler: handler = ({ resource, action }) => {
  let title = "RSVQuick"; // Default title

  if (resource && action) {
    title = `${capitalize(action)} ${capitalize(resource.name)} | RSVQuick`;
  }

  return title;
};

export default customTitleHandler;
