import { IResponse } from "@/pages/requests/list";
import { useCreate, useNotification } from "@refinedev/core";
import dayjs from "dayjs";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { formatDateTime } from "@/helpers";

interface InvitationCardProps {
  event_id?: string;
  title: string;
  address: string;
  activityDate: Date;
  activityTime: string;
  primaryColor: string;
  backgroundColor: string;
  secondaryColor: string;
  fontFamily: string;
  italicize: boolean;
  backgroundGradient: boolean;
  secondaryGradient: boolean;
  backgroundImage?: File | string;
  acceptanceLabel: string;
  rejectionLabel: string;
  isEdit: boolean;
  closeDate: Date;
}

const ATTENDEE_COUNT_OPTIONS = [1, 2, 3, 4, 5] as const;
const DEFAULT_ATTENDEE_COUNT = ATTENDEE_COUNT_OPTIONS[0];

const formSchema = z.object({
  responder_name: z.string().min(1, "Name is required"),
  num_attendees: z.number().min(0),
  accept: z.string(),
});

export const InvitationCard = ({
  event_id,
  title,
  address,
  activityDate,
  primaryColor,
  backgroundColor,
  secondaryColor,
  fontFamily,
  italicize,
  backgroundGradient,
  secondaryGradient,
  backgroundImage,
  acceptanceLabel,
  rejectionLabel,
  isEdit = true,
  closeDate,
  activityTime,
}: InvitationCardProps) => {
  const navigate = useNavigate();
  const { open } = useNotification();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responder_name: "",
      num_attendees: 0,
      accept: "",
    },
  });

  const { mutate } = useCreate<IResponse>();

  const responseAnswer: any = form.watch("accept");
  const accept = responseAnswer === "true";

  useMemo(() => {
    form.setValue("num_attendees", accept ? DEFAULT_ATTENDEE_COUNT : 0);
  }, [accept, form]);

  const onSubmit = async (data: FieldValues) => {
    if (event_id) {
      const responseId = uuidv4();

      mutate(
        {
          resource: "responses",
          values: {
            ...data,
            id: responseId,
            request_id: event_id,
          },
        },
        {
          onSuccess: () => {
            navigate(`/${event_id}/thank-you`);
          },
        },
      );
    }
  };

  const closed = useMemo(() => dayjs().isAfter(dayjs(closeDate)), [closeDate]);

  const getBackgroundStyle = () => {
    if (backgroundImage) {
      if (typeof backgroundImage === "string") {
        // Handle URL string case
        return `url(${backgroundImage}) center/cover no-repeat`;
      } else if (backgroundImage instanceof File) {
        // Handle File object case
        return `url(${URL.createObjectURL(
          backgroundImage,
        )}) center/cover no-repeat`;
      }
    }
    if (backgroundGradient) {
      return `linear-gradient(135deg, ${backgroundColor}, ${secondaryColor})`;
    }
    return backgroundColor;
  };

  const backgroundImageStyle = getBackgroundStyle();

  const styleBackgroundCard = {
    backgroundColor,
    background: backgroundImageStyle,
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      <div
        className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8"
        style={styleBackgroundCard}
      >
        <div
          className={`w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden`}
        >
          <div className="relative z-10 flex flex-col items-center justify-between h-full py-6 md:py-8 px-4 md:px-12 text-center">
            {/* Header Section */}
            <div className="space-y-4 mb-6" data-oid="ts66:rm">
              <h1
                className="text-3xl md:text-5xl text-center capitalize font-bold leading-tight"
                style={{
                  color: primaryColor,
                  fontStyle: italicize ? "italic" : "normal",
                  fontFamily,
                }}
                data-oid="f8t4o3c"
              >
                {title || "Please Join Us!"}
              </h1>

              <p
                className="text-sm md:text-base"
                style={{
                  color: primaryColor,
                  fontStyle: italicize ? "italic" : "normal",
                  fontFamily,
                }}
                data-oid="0xixjev"
              >
                {address}
              </p>

              {/* Date and Time Section */}
              <div className="flex flex-col items-center gap-2">
                <h2
                  className="text-2xl md:text-4xl font-bold"
                  style={{
                    color: primaryColor,
                    fontFamily,
                    fontStyle: italicize ? "italic" : "normal",
                  }}
                  data-oid="8ckqzb8"
                >
                  {formatDateTime({
                    date: activityDate,
                    formatDate: "dd MMM, yyyy",
                  })}{" "}
                  at {activityTime}
                  {closed && (
                    <span className="block text-sm md:text-base text-red-500 mt-1">
                      (CLOSED)
                    </span>
                  )}
                </h2>

                <p
                  className="text-xs md:text-sm"
                  style={{
                    color: primaryColor,
                    fontStyle: italicize ? "italic" : "normal",
                    fontFamily,
                  }}
                  data-oid="3777f67"
                >
                  Kindly Reply Before{" "}
                  {formatDateTime({
                    date: closeDate,
                    formatDate: "dd MMMM yyyy",
                  })}
                </p>
              </div>
            </div>

            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm mx-auto space-y-6"
              >
                <div className="space-y-6">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="responder_name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          className="text-sm md:text-base mb-2 block"
                          style={{
                            color: primaryColor,
                            fontStyle: italicize ? "italic" : "normal",
                            fontFamily,
                          }}
                        >
                          Your Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full h-12 text-base rounded-lg border-2 transition-colors focus:ring-2 focus:ring-offset-1"
                            style={{
                              color: primaryColor,
                              borderColor: `${primaryColor}40`,
                              fontStyle: italicize ? "italic" : "normal",
                              fontFamily,
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Radio Group */}
                  <FormField
                    control={form.control}
                    name="accept"
                    render={({ field }) => (
                      <FormItem className="w-full" data-oid="d4b1pdc">
                        <FormLabel
                          className="text-sm md:text-base"
                          style={{
                            color: primaryColor,
                            fontStyle: italicize ? "italic" : "normal",
                            fontFamily,
                          }}
                        >
                          Are you going?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8"
                          >
                            {/* Decline Option */}
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="false"
                                id="decline"
                                className="h-5 w-5 md:h-6 md:w-6"
                                style={{ borderColor: primaryColor }}
                              />
                              <label
                                htmlFor="decline"
                                className="text-sm md:text-base"
                                style={{
                                  color: primaryColor,
                                  fontStyle: italicize ? "italic" : "normal",
                                  fontFamily,
                                }}
                              >
                                {rejectionLabel}
                              </label>
                            </div>
                            {/* Accept Option */}
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value="true"
                                id="accept"
                                className="h-5 w-5 md:h-6 md:w-6"
                                style={{ borderColor: primaryColor }}
                              />
                              <label
                                htmlFor="accept"
                                className="text-sm md:text-base"
                                style={{
                                  color: primaryColor,
                                  fontStyle: italicize ? "italic" : "normal",
                                  fontFamily,
                                }}
                              >
                                {acceptanceLabel}
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Attendees Selection */}
                  {accept && (
                    <div className="w-full">
                      <div
                        className="rounded-lg p-4 md:p-5"
                        style={{
                          background: `linear-gradient(145deg, ${primaryColor}03, ${primaryColor}08)`,
                        }}
                      >
                        <FormField
                          control={form.control}
                          name="num_attendees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className="text-sm md:text-base block mb-3"
                                style={{
                                  color: primaryColor,
                                  fontStyle: italicize ? "italic" : "normal",
                                  fontFamily,
                                }}
                              >
                                Number of Attendees
                              </FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                value={String(field.value)}
                              >
                                <SelectTrigger
                                  className="w-full h-12 rounded-lg border-2 transition-colors focus:ring-2 focus:ring-offset-1"
                                  style={{
                                    color: primaryColor,
                                    borderColor: `${primaryColor}40`,
                                    fontStyle: italicize ? "italic" : "normal",
                                    fontFamily,
                                  }}
                                >
                                  <SelectValue placeholder="Select number" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <div className="grid grid-cols-5 gap-1 p-1">
                                    {ATTENDEE_COUNT_OPTIONS.map((value) => (
                                      <SelectItem
                                        key={value}
                                        value={String(value)}
                                        className="cursor-pointer text-center rounded-md hover:bg-gray-100 transition-colors"
                                      >
                                        <span
                                          className="text-base font-medium"
                                          style={{ color: primaryColor }}
                                        >
                                          {value}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </div>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    disabled={closed || !isEdit}
                    className="w-full mt-6 h-12 text-base font-medium transition-transform active:scale-95"
                    style={{
                      backgroundColor: secondaryColor,
                      background: secondaryGradient
                        ? `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`
                        : secondaryColor,
                      color: "#FFFFFF",
                      fontFamily,
                      fontStyle: italicize ? "italic" : "normal",
                    }}
                  >
                    Submit Response
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
