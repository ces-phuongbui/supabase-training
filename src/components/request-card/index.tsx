import { Button, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCreate, useCreateMany, useNotification } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import tc from "tinycolor2";
import { v4 as uuidv4 } from "uuid";
import { IResponse } from "../../pages/requests/list";
import dayjs from "../../utility/dayjs";
import { IAnswer, IChoice, IQuestion } from "../../utility/types";

interface Survey {
  question: IQuestion;
  choices: IChoice[];
}

interface SurveyAnswer {
  question_id: string;
  choice_id: string;
}

interface RequestCardProps {
  title: string;
  address: string;
  rejectionLabel: string;
  acceptanceLabel: string;
  closeDate: string;
  secondaryColor: string;
  primaryColor: string;
  fontFamily: string;
  backgroundColor: string;
  italicize: boolean;
  secondary_gradient?: boolean;
  background_gradient?: boolean;
  requestId?: string;
  surveys?: Survey[];
  style?: string;
  isHaveBackGroundImage?: boolean;
}

interface IResponseForm {
  responder_name: string;
  num_attendees: number;
  accept: boolean;
}

const ATTENDEE_COUNT_OPTIONS = [1, 2, 3, 4, 5] as const;
const DEFAULT_ATTENDEE_COUNT = ATTENDEE_COUNT_OPTIONS[0];

export const RequestCard = ({
  title,
  address,
  fontFamily,
  rejectionLabel,
  acceptanceLabel,
  closeDate,
  secondaryColor,
  primaryColor,
  secondary_gradient = false,
  requestId,
  italicize,
  surveys,
  style = "DEFAULT",
  isHaveBackGroundImage = false,
}: RequestCardProps) => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IResponseForm>({
    defaultValues: {
      responder_name: "",
      num_attendees: 0,
      accept: false,
    },
  });

  const { handleSubmit: handleSurveySubmit, getValues: getSurveyValues } =
    useForm<SurveyAnswer[]>();

  const { mutate } = useCreate<IResponse>();
  const { mutate: createAnswers } = useCreateMany<IAnswer>();

  const navigate = useNavigate();
  const { open } = useNotification();

  const defaultTextColor = tc(secondaryColor).isLight() ? "black" : "white";

  const responseAnswer = watch("accept");
  const accept = responseAnswer === "true";

  useMemo(() => {
    setValue("num_attendees", accept ? DEFAULT_ATTENDEE_COUNT : 0);
  }, [accept, setValue]);

  const onSubmit = async (data: FieldValues) => {
    if (requestId) {
      const surveyAnswers = getSurveyValues()?.answers as IAnswer[];
      if (surveys && surveyAnswers && accept) {
        open?.({
          type: "error",
          key: "unanswered",
          description: "Please complete the survey.",
          message: "Answer the survey to complete your response.",
        });
        return;
      }

      const responseId = uuidv4();

      mutate(
        {
          resource: "responses",
          values: {
            ...data,
            id: responseId,
            request_id: requestId,
          },
        },
        {
          onSuccess: () => {
            if (accept) {
              handleSurveySubmit(
                async (values) => {
                  const surveyAnswers = values.answers as SurveyAnswer[];
                  createAnswers({
                    resource: "answers",
                    errorNotification: false,
                    successNotification: false,
                    values: surveyAnswers.map((answer) => ({
                      ...answer,
                      response_id: responseId,
                    })),
                  });
                },
                (error) => console.log(error, "ERROR"),
              )();
            }
            navigate(`/${requestId}/thank-you`);
          },
        },
      );
    }
  };

  const theme = createTheme({
    typography: {
      fontFamily: fontFamily,
    },
    components: {
      MuiFilledInput: {
        styleOverrides: {
          root: {
            ":before": {
              borderColor: defaultTextColor,
            },
            color: defaultTextColor,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: defaultTextColor,
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: defaultTextColor,
          },
        },
      },
    },
    palette: {
      primary: {
        main: primaryColor || "#000",
      },
    },
  });

  const closed = useMemo(() => dayjs().isAfter(dayjs(closeDate)), [closeDate]);

  const secondaryGradientColor = useMemo(
    () =>
      `linear-gradient(${tc(secondaryColor)
        .analogous()
        .slice(1)
        .reverse()
        .toString()})`,
    [secondaryColor],
  );

  const getBackgroundStyle = (isDefault: boolean) => {
    if (isHaveBackGroundImage) {
      return "rgba(255, 255, 255, 0.5)";
    }
    if (!isDefault || isHaveBackGroundImage) {
      return "";
    }
    return secondary_gradient ? secondaryGradientColor : secondaryColor;
  };

  return (
    <ThemeProvider theme={theme} data-oid="tzvl7rg">
      <Box
        sx={{
          width: { xs: "100%", sm: "800px" },
          borderRadius: 2,
          overflow: "hidden",
          fontFamily: fontFamily,
          fontStyle: italicize ? "italic" : "normal",
          background: getBackgroundStyle(style === "DEFAULT"),
          backdropFilter: isHaveBackGroundImage ? "blur(10px)" : "none",
          backgroundColor: isHaveBackGroundImage
            ? "rgba(255, 255, 255, 0.5)"
            : getBackgroundStyle(style === "DEFAULT"),
        }}
        color={defaultTextColor}
        maxWidth="md"
        component={Paper}
        elevation={4}
        data-oid="vf4otzp"
      >
        <Box
          px={4}
          pt={4}
          pb={style === "DEFAULT" ? 0 : 8}
          sx={{
            background: getBackgroundStyle(style !== "DEFAULT"),
          }}
          data-oid="7bq9nd_"
        >
          <Typography
            fontSize={36}
            textAlign="center"
            textTransform={"capitalize"}
            fontWeight="bold"
            color={primaryColor}
            data-oid="25h.kob"
          >
            {title || "Please Join Us!"}
          </Typography>
          <Typography
            textAlign="center"
            color={primaryColor}
            data-oid="vnev4dy"
          >
            {address}
          </Typography>
          <Box mt={4} data-oid="a4.r9_f">
            <Typography
              fontSize={32}
              fontWeight="bold"
              textAlign="center"
              color={primaryColor}
              data-oid="-4xrawf"
            >
              RSVP{closed ? " (CLOSED)" : ""}
            </Typography>
            <Typography
              fontSize={24}
              textAlign="center"
              color={primaryColor}
              data-oid="uibh53j"
            >
              Kindly Reply Before {dayjs(closeDate).format("Do MMMM yyyy")}
            </Typography>
          </Box>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
          px={4}
          pb={4}
          data-oid=".y5a0hg"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            data-oid="w0t4z.p"
          >
            <Box my={2} data-oid="kv_10au">
              <TextField
                {...register("responder_name", {
                  required: "This field is required",
                })}
                error={!!(errors as any)?.responder_name}
                helperText={(errors as any)?.responder_name?.message}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: isHaveBackGroundImage ? "black" : primaryColor,
                  },
                }}
                type="text"
                label="Your Name"
                name="responder_name"
                variant="standard"
                data-oid="-yg71ra"
              />
            </Box>
            <FormControl error={!!(errors as any)?.accept} data-oid="0hf04ge">
              <FormLabel
                id="demo-radio-buttons-group-label"
                sx={{ textAlign: "center", color: primaryColor }}
                data-oid="4fvsf-f"
              >
                Are you going?
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                data-oid="4p:nzpp"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  gap={4}
                  data-oid="hj.1r7v"
                >
                  <FormControlLabel
                    value={false}
                    {...register("accept", {
                      required: "This field is required",
                    })}
                    control={
                      <Radio
                        sx={{
                          color: isHaveBackGroundImage ? "black" : primaryColor,
                        }}
                        data-oid="nszgku2"
                      />
                    }
                    label={rejectionLabel}
                    sx={{
                      color: isHaveBackGroundImage ? "black" : primaryColor,
                    }}
                    data-oid="ym1lt_h"
                  />

                  <FormControlLabel
                    value={true}
                    {...register("accept", {
                      required: "This field is required",
                    })}
                    control={
                      <Radio
                        sx={{
                          color: isHaveBackGroundImage ? "black" : primaryColor,
                        }}
                        data-oid="_tgikub"
                      />
                    }
                    label={acceptanceLabel}
                    sx={{
                      color: isHaveBackGroundImage ? "black" : primaryColor,
                    }}
                    data-oid="_qae_7y"
                  />
                </Box>
              </RadioGroup>
            </FormControl>
            {accept && (
              <Stack gap={2} data-oid="pxygaxq">
                <Typography
                  fontSize={24}
                  fontWeight="bold"
                  color="primary.main"
                  textAlign="center"
                  data-oid="b22d94s"
                >
                  Questions
                </Typography>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={4}
                  justifyContent="center"
                  data-oid="341bh9s"
                >
                  <Box
                    border={2}
                    borderRadius={1}
                    borderColor="primary.main"
                    padding={2}
                    data-oid="_8k1v4f"
                  >
                    <FormControl fullWidth data-oid="1vjm1sb">
                      <FormLabel
                        id="num-attendees-label"
                        sx={{
                          textAlign: "left",
                          color: primaryColor,
                        }}
                        data-oid="g78zerk"
                      >
                        {"How many people will join with you?"}
                      </FormLabel>
                      <Select
                        labelId="num-attendees-label"
                        id={`select-num-attendees`}
                        {...register("num_attendees", {
                          required: "This field is required",
                        })}
                        defaultValue={ATTENDEE_COUNT_OPTIONS[0]}
                        data-oid="zmk8z-e"
                      >
                        <MenuItem value="" data-oid="ceul5sd">
                          <em data-oid="zto478e">Select a value</em>
                        </MenuItem>
                        {ATTENDEE_COUNT_OPTIONS.map((value) => (
                          <MenuItem
                            key={value}
                            value={value}
                            data-oid="wwi5kdz"
                          >
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Stack>
            )}
          </Box>
          <Box mt={4} textAlign="center" data-oid="03q.uld">
            <Button
              variant="contained"
              type="submit"
              disabled={closed}
              data-oid="zkq6kms"
            >
              Submit Response
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
