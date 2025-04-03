import { IResponse } from "@/pages/requests/list";
import { IChoice, IQuestion } from "@/utility/types";
import { useCreate, useNotification } from "@refinedev/core";
import { format } from "date-fns";
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

interface InvitationCardProps {
  event_id?: string;
  title: string;
  address: string;
  activityDate: Date;
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
    <div
      className={`border rounded-lg ${
        !isEdit ? "h-[40rem]" : "h-[100vh]"
      } w-full overflow-hidden`}
      data-oid="mihzskl"
    >
      <div
        className="h-full relative flex flex-col items-center justify-between"
        style={styleBackgroundCard}
        data-oid="by5_629"
      >
        <div
          className={`${
            isEdit ? "min-h-[55%] w-[50%]" : "min-h-[75%] w-[80%]"
          } m-auto inset-0 bg-white/60 rounded-sm`}
          data-oid="gl6ty4e"
        >
          <div
            className="relative z-10 flex flex-col items-center justify-between h-full py-8 px-6 text-center"
            data-oid="m64.p-u"
          >
            <div className="mt-4" data-oid="ts66:rm">
              <h1
                className="text-5xl text-center capitalize font-bold"
                style={{ color: primaryColor }}
                data-oid="f8t4o3c"
              >
                {title || "Please Join Us!"}
              </h1>
            </div>

            <div className="mt-3" data-oid="r_-1orx">
              <p
                className="text-center"
                style={{ color: primaryColor }}
                data-oid="0xixjev"
              >
                {address}
              </p>

              <h2
                style={{
                  color: primaryColor,
                  fontFamily,
                  fontStyle: italicize ? "italic" : "normal",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
                data-oid="8ckqzb8"
              >
                {format(activityDate, "dd MMM, yyyy")}{" "}
                {closed ? " (CLOSED)" : ""}
              </h2>

              <p
                className="text-1xl text-center mb-2"
                style={{ color: primaryColor }}
                data-oid="3777f67"
              >
                Kindly Reply Before {dayjs(closeDate).format("DD MMMM YYYY")}
              </p>
            </div>

            <Form {...form} data-oid="9vni6hv">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-4 pb-4"
                data-oid="8a01msz"
              >
                <div
                  className="flex flex-col items-center space-y-6"
                  data-oid="tbok50o"
                >
                  <FormField
                    control={form.control}
                    name="responder_name"
                    render={({ field }) => (
                      <FormItem data-oid="xxceq6y">
                        <FormLabel
                          style={{
                            color: primaryColor ?? "black",
                          }}
                          data-oid="_f51teg"
                        >
                          Your Name
                        </FormLabel>
                        <FormControl data-oid="ymp7av0">
                          <Input {...field} data-oid="p9x1c-e" />
                        </FormControl>
                        <FormMessage
                          className="text-[11px] text-red-500"
                          data-oid="6-ih5cm"
                        />
                      </FormItem>
                    )}
                    data-oid="-ct5mvr"
                  />

                  <FormField
                    control={form.control}
                    name="accept"
                    render={({ field }) => (
                      <FormItem data-oid="d4b1pdc">
                        <FormLabel
                          style={{ color: primaryColor }}
                          data-oid="q9z19ic"
                        >
                          Are you going?
                        </FormLabel>
                        <FormControl data-oid="7529jak">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex justify-between gap-4"
                            data-oid="vu0.02v"
                          >
                            <div
                              className="flex items-center space-x-2"
                              data-oid="5fvrzct"
                            >
                              <RadioGroupItem
                                value="false"
                                id="decline"
                                data-oid="1x4nsc4"
                              />

                              <label
                                htmlFor="decline"
                                style={{ color: primaryColor ?? "black" }}
                                data-oid="wzxwtvn"
                              >
                                {rejectionLabel}
                              </label>
                            </div>
                            <div
                              className="flex items-center space-x-2"
                              data-oid="l:5t:ro"
                            >
                              <RadioGroupItem
                                value="true"
                                id="accept"
                                data-oid="8yr.9qu"
                              />

                              <label
                                htmlFor="accept"
                                style={{ color: primaryColor ?? "black" }}
                                data-oid="cfkcp-q"
                              >
                                {acceptanceLabel}
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage data-oid="mwziy79" />
                      </FormItem>
                    )}
                    data-oid="dsd6dw9"
                  />

                  {accept && (
                    <div className="space-y-4 w-full" data-oid="0x_v6il">
                      <div
                        className="bg-white/5 backdrop-blur-sm border rounded-xl p-6 shadow-lg"
                        style={{
                          borderColor: `${primaryColor}40`, // Adding transparency to border
                          background: `linear-gradient(145deg, ${primaryColor}05, ${primaryColor}10)`,
                        }}
                        data-oid="xfhy7h0"
                      >
                        <FormField
                          control={form.control}
                          name="num_attendees"
                          render={({ field }) => (
                            <FormItem data-oid="ojfhv6x">
                              <FormLabel
                                style={{ color: primaryColor }}
                                data-oid="9fek5g-"
                              >
                                How many people will join with you?
                              </FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                value={String(field.value)}
                                data-oid="jgztob9"
                              >
                                <SelectTrigger data-oid="gbfthbh">
                                  <SelectValue
                                    placeholder="Select number of attendees"
                                    data-oid="53os.nz"
                                  />
                                </SelectTrigger>
                                <SelectContent
                                  className="bg-white "
                                  data-oid="03q43z1"
                                >
                                  {ATTENDEE_COUNT_OPTIONS.map((value) => (
                                    <SelectItem
                                      key={value}
                                      value={String(value)}
                                      className="cursor-pointer hover:bg-gray-300"
                                      data-oid="jwtqjnk"
                                    >
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage data-oid="nqtp:f." />
                            </FormItem>
                          )}
                          data-oid=":jstdyh"
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    disabled={closed || !isEdit}
                    className="mt-6 px-6 py-2 rounded mx-auto block"
                    style={{
                      backgroundColor: secondaryColor,
                      background: secondaryGradient
                        ? `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`
                        : secondaryColor,
                      color: "#FFFFFF",
                      fontFamily,
                      fontStyle: italicize ? "italic" : "normal",
                    }}
                    data-oid="qagfg7n"
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
