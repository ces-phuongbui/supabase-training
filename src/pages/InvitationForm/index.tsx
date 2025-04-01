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
    <div className="w-full h-full relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center justify-center z-10"
        onClick={() => navigate("/requests")}
      >
        <ArrowLeft size={40} />
        Back
      </Button>

      <div className="container max-w-6xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6 text-center pt-8">
          Create New Event
        </h1>

        <Form {...form}>
          <h4 className="text-lg font-bold mb-2">Event Details</h4>
          <h5 className="text-sm text-gray-400">
            Provide the details of the event to create an invitation
          </h5>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="p-2 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the title of your event"
                        {...field}
                        className="placeholder:text-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Location</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the address or location"
                        {...field}
                        className="placeholder:text-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activity_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="acceptance_label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accept Button Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Accept"
                          {...field}
                          className="placeholder:text-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rejection_label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decline Button Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Decline"
                          {...field}
                          className="placeholder:text-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="close_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {STYLE_OPTIONS.map((style) => (
                          <SelectItem
                            key={style.value}
                            value={style.value}
                            className="cursor-pointer"
                          >
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="background_image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
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
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="colors">
                  <AccordionTrigger>Colors</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="primary_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Text Color</FormLabel>
                            <div className="mt-2">
                              <HexColorPicker
                                color={field.value}
                                onChange={field.onChange}
                              />

                              <Input
                                className="mt-2"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </div>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="background_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <div className="mt-2">
                              <HexColorPicker
                                color={field.value}
                                onChange={field.onChange}
                              />

                              <Input
                                className="mt-2"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </div>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondary_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <div className="mt-2">
                              <HexColorPicker
                                color={field.value}
                                onChange={field.onChange}
                              />

                              <Input
                                className="mt-2"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </div>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="background_gradient"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Use gradient for background</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="secondary_gradient"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>
                              Use gradient for secondary color
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="typography">
                  <AccordionTrigger>Typography</AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="font_family"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font Family</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {webSafeFonts.map((font) => (
                                <SelectItem
                                  key={font}
                                  value={font}
                                  style={{ fontFamily: font }}
                                >
                                  {font}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="italicize"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Italicize text</FormLabel>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>

            {/*Preview Card*/}
            <InvitationCard {...invitationCardProps} />

            <div className="flex justify-end w-full">
              <Button
                type="submit"
                disabled={isDisabled}
                className="bg-amber-600 w-full hover:bg-amber-700 text-white"
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
