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

    const { handleSubmit: handleSurveySubmit, getValues: getSurveyValues } = useForm<SurveyAnswer[]>();

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
                        navigate("/thank-you");
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
        () => `linear-gradient(${tc(secondaryColor).analogous().slice(1).reverse().toString()})`,
        [secondaryColor],
    );

    const getBackgroundStyle = (isDefault: boolean) => {
        if (!isDefault) {
            return "";
        }
        return secondary_gradient ? secondaryGradientColor : secondaryColor;
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    fontFamily: fontFamily,
                    fontStyle: italicize ? "italic" : "normal",
                    background: getBackgroundStyle(style === "DEFAULT"),
                }}
                color={defaultTextColor}
                width={800}
                maxWidth="md"
                component={Paper}
                elevation={4}
            >
                <Box
                    px={4}
                    pt={4}
                    pb={style === "DEFAULT" ? 0 : 8}
                    sx={{
                        background: getBackgroundStyle(style !== "DEFAULT"),
                    }}
                >
                    <Typography
                        fontSize={36}
                        textAlign="center"
                        textTransform={"capitalize"}
                        fontWeight="bold"
                        color={primaryColor}
                    >
                        {title || "Please Join Us!"}
                    </Typography>
                    <Typography textAlign="center" color={primaryColor}>
                        {address}
                    </Typography>
                    <Box mt={4}>
                        <Typography fontSize={32} fontWeight="bold" textAlign="center" color={primaryColor}>
                            RSVP{closed ? " (CLOSED)" : ""}
                        </Typography>
                        <Typography fontSize={24} textAlign="center" color={primaryColor}>
                            Kindly Reply Before {dayjs(closeDate).format("Do MMMM YYYY")}
                        </Typography>
                    </Box>
                </Box>
                <Box component="form" onSubmit={handleSubmit(onSubmit, (error) => console.log(error))} px={4} pb={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box my={2}>
                            <TextField
                                {...register("responder_name", {
                                    required: "This field is required",
                                })}
                                error={!!(errors as any)?.responder_name}
                                helperText={(errors as any)?.responder_name?.message}
                                InputLabelProps={{ shrink: true }}
                                type="text"
                                label="Your Name"
                                name="responder_name"
                                variant="standard"
                            />
                        </Box>
                        <FormControl error={!!(errors as any)?.accept}>
                            <FormLabel
                                id="demo-radio-buttons-group-label"
                                sx={{ textAlign: "center", color: primaryColor }}
                            >
                                Are you going?
                            </FormLabel>
                            <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
                                <Box display="flex" justifyContent="space-between" gap={4}>
                                    <FormControlLabel
                                        value={false}
                                        {...register("accept", {
                                            required: "This field is required",
                                        })}
                                        control={<Radio />}
                                        label={rejectionLabel}
                                    />
                                    <FormControlLabel
                                        value={true}
                                        {...register("accept", {
                                            required: "This field is required",
                                        })}
                                        control={<Radio />}
                                        label={acceptanceLabel}
                                    />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                        {accept && (
                            <Stack gap={2}>
                                <Typography fontSize={24} fontWeight="bold" color="primary.main" textAlign="center">
                                    Questions
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center">
                                    <Box border={2} borderRadius={1} borderColor="primary.main" padding={2}>
                                        <FormControl fullWidth>
                                            <FormLabel
                                                id="num-attendees-label"
                                                sx={{
                                                    textAlign: "left",
                                                    color: primaryColor,
                                                }}
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
                                            >
                                                <MenuItem value="">
                                                    <em>Select a value</em>
                                                </MenuItem>
                                                {ATTENDEE_COUNT_OPTIONS.map((value) => (
                                                    <MenuItem key={value} value={value}>
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
                    <Box mt={4} textAlign="center">
                        <Button variant="contained" type="submit" disabled={closed}>
                            Submit Response
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
