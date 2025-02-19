import { HttpError, useOne, useTable } from "@refinedev/core";
import { RequestCard } from "../../components/request-card";
import Background from "../../components/request-card/background";
import { useParams } from "react-router-dom";
import { IRequest, IResponse } from "../requests/list";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { IChoice, IQuestion } from "../../utility/types";
import { CircularProgress } from "@mui/material";

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
    address,
    acceptance_label: acceptanceLabel,
    rejection_label: rejectionLabel,
    close_date: closeDate,
    secondary_color: secondaryColor,
    primary_color: primaryColor,
    font_family: fontFamily,
    italicize,
    secondary_gradient: secondaryGradient,
    style,
  } = request || {};

  useDocumentTitle(`${title} | RSVQuick`);

  const { tableQueryResult: responseTableQueryResult } = useTable<IResponse, HttpError>({
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

  const { tableQueryResult: questionQueryResult } = useTable<IQuestion, HttpError>({
    resource: "questions",
    queryOptions: { enabled: !!request },
    filters: {
      permanent: [
        {
          field: "request_id",
          operator: "eq",
          value: request?.id,
        },
      ],
    },
  });

  const questions = questionQueryResult.data?.data;

  const { tableQueryResult: choicesQueryResult } = useTable<IChoice, HttpError>({
    resource: "choices",
    queryOptions: { enabled: !!questions },
    filters: {
      permanent: [
        {
          field: "question_id",
          operator: "in",
          value: questions?.map((q) => q.id),
        },
      ],
    },
  });

  const choices = choicesQueryResult.data?.data;

  return data && id && responseTableQueryResult.data ? (
    <Background
      backgroundImage={backgroundImage}
      backgroundColor={backgroundColor ?? ""}
      responseView
      background_gradient={backgroundGradient}
    >
      <RequestCard
        backgroundColor={backgroundColor ?? ""}
        title={title ?? ""}
        address={address ?? ""}
        acceptanceLabel={acceptanceLabel ?? ""}
        rejectionLabel={rejectionLabel ?? ""}
        closeDate={closeDate ?? ""}
        secondaryColor={secondaryColor ?? ""}
        primaryColor={primaryColor ?? ""}
        fontFamily={fontFamily ?? ""}
        italicize={italicize ?? false}
        requestId={id}
        secondary_gradient={secondaryGradient}
        style={style}
        surveys={questions?.map((q) => ({
          question: q,
          choices: choices?.filter((c) => c.question_id === q.id) || [],
        }))}
        isHaveBackGroundImage={!!backgroundImage}
      />
    </Background>
  ) : (
    <Background backgroundColor="background.default" responseView>
      <CircularProgress />
    </Background>
  );
};
