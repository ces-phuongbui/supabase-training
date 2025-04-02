"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCreate, useNotification } from "@refinedev/core";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// ShadcN UI components
import { InvitationCard } from "@/components/InvitationCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabaseClient } from "@/utility";
import { STYLE_OPTIONS } from "@/utility/constant";
import webSafeFonts from "@/utility/fonts";
import { IRequest } from "../requests/list";
import { invitationSchema } from "./schema";

export const InvitationForm = () => {
  const navigate = useNavigate();
  const { open } = useNotification();

  const [isDisabled, setIsDisabled] = useState(false);
  const [userId, setUserId] = useState("");

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (user !== null) {
        setUserId(user.id);
      } else {
        setUserId("");
      }
    } catch (e) {
      console.error("error get user: ", e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Shadcn form setup
  const form = useForm<z.infer<typeof invitationSchema>>({
    resolver: zodResolver(invitationSchema),
    defaultValues: DEFAULT_INVITATION_VALUES,
  });

  const { mutate } = useCreate<IRequest>();

  const onSubmit = async (values: z.infer<typeof invitationSchema>) => {
    const id = uuidv4();
    setIsDisabled(true);

    // Create form data to handle file upload
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    });

    // Upload Image
    let imageUrl = "";
    if (values.background_image) {
      // Upload to Supabase storage
      const { data, error } = await supabaseClient.storage
        .from("training")
        .upload(userId + "/" + uuidv4(), values.background_image);

      if (error) {
        console.error("Error uploading image:", error);
        return;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("training").getPublicUrl(data.path);

      imageUrl = publicUrl;
    }

    mutate(
      {
        resource: "requests",
        values: {
          ...values,
          id,
          user_id: userId,
          position: [0, 0],
          background_image: imageUrl,
        },
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Invitation created successfully",
            description:
              "Your invitation has been created and is ready to share.",
          });
          setIsDisabled(false);
          navigate(`/requests`);
        },
        onError: (error) => {
          open?.({
            type: "error",
            message: "Failed to create invitation",
            description: error?.message || "Something went wrong",
          });
          setIsDisabled(false);
        },
      },
    );
  };

  const invitationCardProps = {
    title: form.watch("title"),
    address: form.watch("address"),
    activityDate: form.watch("activity_date"),
    primaryColor: form.watch("primary_color"),
    backgroundColor: form.watch("background_color"),
    secondaryColor: form.watch("secondary_color"),
    fontFamily: form.watch("font_family"),
    italicize: form.watch("italicize"),
    backgroundGradient: form.watch("background_gradient"),
    secondaryGradient: form.watch("secondary_gradient"),
    backgroundImage: form.watch("background_image"),
    acceptanceLabel: form.watch("acceptance_label"),
    rejectionLabel: form.watch("rejection_label"),
    isEdit: false,
  };

  return (
    <div className="w-full h-full relative" data-oid="fzwgm4v">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center justify-center z-10"
        onClick={() => navigate("/requests")}
        data-oid="_pkbvhi"
      >
        <ArrowLeft size={40} data-oid="e6sh3wi" />
        Back
      </Button>

      <div className="container max-w-6xl mx-auto py-8" data-oid="z2awn17">
        <h1
          className="text-4xl font-bold mb-6 text-center pt-8"
          data-oid="7j-ffeo"
        >
          Create New Event
        </h1>

        <Form {...form} data-oid="hmnx6tg">
          <h4 className="text-lg font-bold mb-2" data-oid="tppuwtz">
            Event Details
          </h4>
          <h5 className="text-sm text-gray-400" data-oid="rsn29uq">
            Provide the details of the event to create an invitation
          </h5>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            data-oid="7gkqdkp"
          >
            <CardContent className="p-2 space-y-6" data-oid="j7fm52_">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem data-oid="kfnvc.2">
                    <FormLabel data-oid="odh:8hg">Event Title</FormLabel>
                    <FormControl data-oid="ajp.ydr">
                      <Input
                        placeholder="Enter the title of your event"
                        {...field}
                        className="placeholder:text-gray-300"
                        data-oid="c6hrfsc"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" data-oid="vpfk0s9" />
                  </FormItem>
                )}
                data-oid="7ei6gp6"
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem data-oid="f8g1:v8">
                    <FormLabel data-oid="wcj03j2">Event Location</FormLabel>
                    <FormControl data-oid="397mw4n">
                      <Textarea
                        placeholder="Enter the address or location"
                        {...field}
                        className="placeholder:text-gray-300"
                        data-oid="0_g8fo4"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" data-oid="k94-x0z" />
                  </FormItem>
                )}
                data-oid="te.3nh7"
              />

              <FormField
                control={form.control}
                name="activity_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col" data-oid="oo4:n72">
                    <FormLabel data-oid="-iw_n1s">Event Date</FormLabel>
                    <Popover data-oid="kxzk32d">
                      <PopoverTrigger asChild data-oid="zawd624">
                        <FormControl data-oid="uo4uefc">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            data-oid="optor14"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span data-oid="8v8asok">Pick a date</span>
                            )}
                            <CalendarIcon
                              className="ml-auto h-4 w-4 opacity-50"
                              data-oid="p7z14j-"
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white"
                        align="start"
                        data-oid="9tqx93r"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          data-oid="s83uive"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" data-oid="p-jh3ku" />
                  </FormItem>
                )}
                data-oid="eis20ph"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                data-oid="9m_vq2n"
              >
                <FormField
                  control={form.control}
                  name="acceptance_label"
                  render={({ field }) => (
                    <FormItem data-oid="bwuvqma">
                      <FormLabel data-oid="0tgorvz">
                        Accept Button Text
                      </FormLabel>
                      <FormControl data-oid=":il_8e0">
                        <Input
                          placeholder="Accept"
                          {...field}
                          className="placeholder:text-gray-300"
                          data-oid="q8x:2_4"
                        />
                      </FormControl>
                      <FormMessage
                        className="text-red-500"
                        data-oid="rfzcp5x"
                      />
                    </FormItem>
                  )}
                  data-oid="el0ub6z"
                />

                <FormField
                  control={form.control}
                  name="rejection_label"
                  render={({ field }) => (
                    <FormItem data-oid="b-gv77_">
                      <FormLabel data-oid="gniih2r">
                        Decline Button Text
                      </FormLabel>
                      <FormControl data-oid="4g9y7uu">
                        <Input
                          placeholder="Decline"
                          {...field}
                          className="placeholder:text-gray-300"
                          data-oid="dd5d8ac"
                        />
                      </FormControl>
                      <FormMessage
                        className="text-red-500"
                        data-oid=".ipfunl"
                      />
                    </FormItem>
                  )}
                  data-oid="1:1p99k"
                />
              </div>
              <FormField
                control={form.control}
                name="close_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col" data-oid="5:kq3l4">
                    <FormLabel data-oid="qecwgqa">Deadline</FormLabel>
                    <Popover data-oid="vdxut2:">
                      <PopoverTrigger asChild data-oid="_d3itv2">
                        <FormControl data-oid="84n:xfk">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            data-oid="8b2-e41"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span data-oid="kav6pds">Pick a date</span>
                            )}
                            <CalendarIcon
                              className="ml-auto h-4 w-4 opacity-50"
                              data-oid="bn.wk0t"
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white"
                        align="start"
                        data-oid="gh.en.7"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          data-oid="cnyxusk"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" data-oid="zt:6vb:" />
                  </FormItem>
                )}
                data-oid="6t8z:ag"
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem className="flex flex-col" data-oid="6x5gdt-">
                    <FormLabel data-oid="cmd2dnj">Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      data-oid="5797wj."
                    >
                      <FormControl data-oid="w377n_0">
                        <SelectTrigger data-oid="nw-dk_q">
                          <SelectValue
                            placeholder="Select an event type"
                            data-oid="m9xdllg"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white" data-oid="w75oj8g">
                        {STYLE_OPTIONS.map((style) => (
                          <SelectItem
                            key={style.value}
                            value={style.value}
                            className="cursor-pointer"
                            data-oid="hugv3sv"
                          >
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" data-oid="locfx9w" />
                  </FormItem>
                )}
                data-oid="vhfvt8s"
              />

              <FormField
                control={form.control}
                name="background_image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem data-oid="w:065da">
                    <FormLabel data-oid=":fqb25w">Background Image</FormLabel>
                    <FormControl data-oid="v:-.jrd">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                        data-oid="0f43vxz"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" data-oid="04slgau" />
                  </FormItem>
                )}
                data-oid="z2-xw84"
              />

              <Accordion
                type="single"
                collapsible
                className="w-full"
                data-oid="gb5n59l"
              >
                <AccordionItem value="colors" data-oid="cef3h-j">
                  <AccordionTrigger data-oid="n_iq1c_">Colors</AccordionTrigger>
                  <AccordionContent className="space-y-6" data-oid="m73a.8e">
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      data-oid="zi6_3w:"
                    >
                      <FormField
                        control={form.control}
                        name="primary_color"
                        render={({ field }) => (
                          <FormItem data-oid="0:.fpje">
                            <FormLabel data-oid="nl6bma9">
                              Primary Text Color
                            </FormLabel>
                            <div className="mt-2" data-oid="1ibn9fb">
                              <HexColorPicker
                                color={field.value}
                                onChange={field.onChange}
                                data-oid="sr7dtz4"
                              />

                              <Input
                                className="mt-2"
                                value={field.value}
                                onChange={field.onChange}
                                data-oid="myog-2v"
                              />
                            </div>
                            <FormMessage
                              className="text-red-500"
                              data-oid="w7sn:gr"
                            />
                          </FormItem>
                        )}
                        data-oid="-0buyws"
                      />

                      <FormField
                        control={form.control}
                        name="background_color"
                        render={({ field }) => (
                          <FormItem data-oid="1spr495">
                            <FormLabel data-oid="3bt84ei">
                              Background Color
                            </FormLabel>
                            <div className="mt-2" data-oid="vq-vjfr">
                              <HexColorPicker
                                color={field.value}
                                onChange={field.onChange}
                                data-oid=".9zha5m"
                              />

                              <Input
                                className="mt-2"
                                value={field.value}
                                onChange={field.onChange}
                                data-oid="w5t-ua7"
                              />
                            </div>
                            <FormMessage
                              className="text-red-500"
                              data-oid="hskokvp"
                            />
                          </FormItem>
                        )}
                        data-oid="x.e:yqi"
                      />

                      <FormField
                        control={form.control}
                        name="secondary_color"
                        render={({ field }) => (
                          <FormItem data-oid="urdww9e">
                            <FormLabel data-oid="k9ve:37">
                              Secondary Color
                            </FormLabel>
                            <div className="mt-2" data-oid="l26y90r">
                              <HexColorPicker
                                color={field.value}
                                onChange={field.onChange}
                                data-oid="v99p4b."
                              />

                              <Input
                                className="mt-2"
                                value={field.value}
                                onChange={field.onChange}
                                data-oid="ob9l-7x"
                              />
                            </div>
                            <FormMessage
                              className="text-red-500"
                              data-oid="u.86gbv"
                            />
                          </FormItem>
                        )}
                        data-oid="tpuixop"
                      />
                    </div>

                    <div
                      className="flex items-center space-x-2"
                      data-oid="xzex770"
                    >
                      <FormField
                        control={form.control}
                        name="background_gradient"
                        render={({ field }) => (
                          <FormItem
                            className="flex flex-row items-center space-x-2"
                            data-oid="bk2mrs_"
                          >
                            <FormControl data-oid="1esi0yw">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-oid="d6:qvuc"
                              />
                            </FormControl>
                            <FormLabel data-oid="-:gqpng">
                              Use gradient for background
                            </FormLabel>
                          </FormItem>
                        )}
                        data-oid="om-0wqx"
                      />
                    </div>

                    <div
                      className="flex items-center space-x-2"
                      data-oid="mggb16j"
                    >
                      <FormField
                        control={form.control}
                        name="secondary_gradient"
                        render={({ field }) => (
                          <FormItem
                            className="flex flex-row items-center space-x-2"
                            data-oid="hwg:-1s"
                          >
                            <FormControl data-oid="m64a:8-">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-oid="-7igt7v"
                              />
                            </FormControl>
                            <FormLabel data-oid="g4iifkd">
                              Use gradient for secondary color
                            </FormLabel>
                          </FormItem>
                        )}
                        data-oid="ntz3z.i"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="typography" data-oid="l_x01ae">
                  <AccordionTrigger data-oid="qg:5dw4">
                    Typography
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6" data-oid="9km5xrq">
                    <FormField
                      control={form.control}
                      name="font_family"
                      render={({ field }) => (
                        <FormItem data-oid="-kt5zg_">
                          <FormLabel data-oid="mtu_0uq">Font Family</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            data-oid="fcssr6h"
                          >
                            <FormControl data-oid="ez7-uuc">
                              <SelectTrigger data-oid="kyalb6:">
                                <SelectValue
                                  placeholder="Select a font"
                                  data-oid=".q9lkc7"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent
                              className="bg-white"
                              data-oid="3d6j4cr"
                            >
                              {webSafeFonts.map((font) => (
                                <SelectItem
                                  key={font}
                                  value={font}
                                  style={{ fontFamily: font }}
                                  data-oid="v6hpv_g"
                                >
                                  {font}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage
                            className="text-red-500"
                            data-oid="jpt6clz"
                          />
                        </FormItem>
                      )}
                      data-oid=":ba4z-2"
                    />

                    <FormField
                      control={form.control}
                      name="italicize"
                      render={({ field }) => (
                        <FormItem
                          className="flex flex-row items-center space-x-2"
                          data-oid=".2vtu1c"
                        >
                          <FormControl data-oid="qlce0f4">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-oid="ba9p47:"
                            />
                          </FormControl>
                          <FormLabel data-oid="0i6zmxb">
                            Italicize text
                          </FormLabel>
                        </FormItem>
                      )}
                      data-oid="oow5-5_"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>

            {/*Preview Card*/}
            <InvitationCard {...invitationCardProps} data-oid="oqaya2z" />

            <div className="flex justify-end w-full" data-oid="nhyba0d">
              <Button
                type="submit"
                disabled={isDisabled}
                className="bg-amber-600 w-full hover:bg-amber-700 text-white"
                data-oid="rz0dxbj"
              >
                Create Invitation
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InvitationForm;

const DEFAULT_INVITATION_VALUES = {
  title: "",
  address: "",
  activity_date: new Date(),
  acceptance_label: "Accept",
  rejection_label: "Decline",
  close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  background_color: "#ffdbbb",
  primary_color: "#000000",
  secondary_color: "#e57a05",
  font_family: "Roboto",
  italicize: false,
  background_gradient: false,
  secondary_gradient: false,
  style: "DEFAULT",
  background_image: undefined,
};
