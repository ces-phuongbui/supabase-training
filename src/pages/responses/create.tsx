import { HttpError, useOne, useTable } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { IRequest, IResponse } from "../requests/list";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { IChoice, IQuestion } from "../../utility/types";
import { DEFAULT_POSITION } from "../requests/map";
import { Card } from "@/components/ui/card";
import { InvitationCard } from "@/components/InvitationCard";
import { Loader2 } from "lucide-react";
import Background from "@/components/InvitationCard/background";

export const ResponseCreate: React.FC = () => {
  const { id } = useParams();

  const { data } = useOne<IRequest, HttpError>({
    resource: "requests",
    id,
  });

  const request = data?.data;
  const {
    title,
    background_image: backgroundImage,
    background_color: backgroundColor,
    background_gradient: backgroundGradient,
    address = "",
    acceptance_label: acceptanceLabel,
    rejection_label: rejectionLabel,
    close_date: closeDate,
    secondary_color: secondaryColor,
    primary_color: primaryColor,
    font_family: fontFamily,
    italicize,
    secondary_gradient: secondaryGradient,
    style,
    position = DEFAULT_POSITION,
    activity_date: activityDate,
    activity_time: activityTime,
  } = request || {};

  useDocumentTitle(`${title} | RSVQuick`);

  const { tableQueryResult: responseTableQueryResult } = useTable<
    IResponse,
    HttpError
  >({
    resource: "responses",
    queryOptions: {
      enabled: !!data?.data,
    },
    filters: {
      permanent: [
        {
          field: "request_id",
          operator: "eq",
          value: data?.data?.id ?? "",
        },
      ],
    },
  });

  return data && id && responseTableQueryResult.data ? (
    <div className="w-full h-[100vh]" data-oid="ib9625n">
      <Card
        className={`flex items-center justify-center bg-transparent border-none ${
          backgroundImage ? "backdrop-blur-md" : ""
        }`}
        data-oid="1zhmshc"
      >
        <InvitationCard
          activityTime={activityTime ?? ""}
          closeDate={new Date(closeDate ?? "")}
          event_id={id}
          backgroundImage={backgroundImage}
          backgroundColor={backgroundColor ?? ""}
          title={title ?? ""}
          address={address ?? ""}
          acceptanceLabel={acceptanceLabel ?? ""}
          rejectionLabel={rejectionLabel ?? ""}
          secondaryColor={secondaryColor ?? ""}
          primaryColor={primaryColor ?? ""}
          fontFamily={fontFamily ?? ""}
          italicize={italicize ?? false}
          activityDate={new Date(activityDate ?? "")}
          backgroundGradient={false}
          secondaryGradient={false}
          isEdit={true}
          data-oid="br155jl"
        />
      </Card>
    </div>
  ) : (
    <Background
      backgroundColor="background.default"
      responseView
      data-oid="v9e960y"
    >
      <Loader2 className="h-8 w-8 animate-spin" data-oid="jlx.5zp" />
    </Background>
  );
};
