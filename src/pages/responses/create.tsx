import { HttpError, useOne, useTable } from "@refinedev/core";
import { RequestCard } from "../../components/request-card";
import Background from "../../components/request-card/background";
import { useParams } from "react-router-dom";
import { IRequest, IResponse } from "../requests/list";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { IChoice, IQuestion } from "../../utility/types";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import Map, { DEFAULT_POSITION } from "../requests/map";
import { useState } from "react";

export const ResponseCreate: React.FC = () => {
  const { id } = useParams();
  const [showMap, setShowMap] = useState<boolean>(false);

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

  const { tableQueryResult: questionQueryResult } = useTable<
    IQuestion,
    HttpError
  >({
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

  const { tableQueryResult: choicesQueryResult } = useTable<IChoice, HttpError>(
    {
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
    },
  );

  const choices = choicesQueryResult.data?.data;

  return data && id && responseTableQueryResult.data ? (
    <Background
      backgroundImage={backgroundImage}
      backgroundColor={backgroundColor ?? ""}
      responseView
      background_gradient={backgroundGradient}
      data-oid="qw2goh5"
    >
      <IconButton
        color="primary"
        sx={{ position: "fixed", bottom: "16px", right: 0, zIndex: 2 }}
        onClick={() => setShowMap(!showMap)}
        data-oid="vyhmjqw"
      >
        <Box
          component="img"
          src="/map-icon.svg"
          alt="SVG Icon"
          sx={{ width: 60, height: 60 }}
          data-oid="2:nxul1"
        />
      </IconButton>
      <Box
        sx={{
          width: "100%",
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: showMap ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        data-oid="75095oh"
      >
        <Card
          sx={{
            position: "absolute",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "unset",
            backdropFilter: backgroundImage ? "blur(10px)" : "none",
          }}
          data-oid="mdocl:q"
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
            data-oid="o-kmla5"
          />
        </Card>
        <Card
          sx={{
            height: "100%",
            width: "100%",
            maxWidth: "900px",
            position: "absolute",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotateY(180deg)",
            "& > div": { height: "100% !important" },
          }}
          data-oid="va2-9d4"
        >
          <Map address={address} position={position} data-oid="3lr0fq-" />
        </Card>
      </Box>
    </Background>
  ) : (
    <Background
      backgroundColor="background.default"
      responseView
      data-oid="29wk4wz"
    >
      <CircularProgress data-oid="4mo2ic8" />
    </Background>
  );
};
