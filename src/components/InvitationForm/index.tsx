import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ReactNode } from "react";
import { HexColorPicker } from "react-colorful";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { invitationSchema } from "@/pages/CreateInvitation/schema";
import { STYLE_OPTIONS } from "@/utility/constant";
import webSafeFonts from "@/utility/fonts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CardContent } from "../ui/card";

interface InvitationFormProps {
  children?: ReactNode;
  isEditing: boolean;
  onSubmit: (values: z.infer<typeof invitationSchema>) => Promise<void>;
  form: UseFormReturn<z.infer<typeof invitationSchema>>;
}

export const InvitationForm = ({
  children,
  isEditing,
  onSubmit,
  form,
}: InvitationFormProps) => {
  const handleSubmit = async (values: z.infer<typeof invitationSchema>) => {
    // Combine date and time before submitting
    if (values.activity_date && values.activity_time) {
      const [hours, minutes] = values.activity_time.split(":").map(Number);
      const combinedDate = new Date(values.activity_date);
      combinedDate.setHours(hours);
      combinedDate.setMinutes(minutes);
      values.activity_date = combinedDate;
    }

    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <CardContent className="p-2 space-y-6">
          <FormField
            control={form.control}
            name="title"
            disabled={!isEditing}
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
            disabled={!isEditing}
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

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <FormField
              control={form.control}
              name="activity_date"
              disabled={!isEditing}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full sm:w-2/3">
                  <FormLabel className="pb-2">Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={!isEditing}
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
              name="activity_time"
              disabled={!isEditing}
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/3">
                  <FormLabel>Event Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="w-full mt-0" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="acceptance_label"
              disabled={!isEditing}
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
              disabled={!isEditing}
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
            disabled={!isEditing}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Close Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={!isEditing}
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
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
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
            disabled={!isEditing}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
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
            disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Use gradient for secondary color</FormLabel>
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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

        {children}
      </form>
    </Form>
  );
};

// export const DEFAULT_INVITATION_VALUES = {
//   title: "",
//   address: "",
//   activity_date: new Date(),
//   activity_time: format(new Date(), "HH:mm"),
//   acceptance_label: "Accept",
//   rejection_label: "Decline",
//   close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//   background_color: "#ffdbbb",
//   primary_color: "#000000",
//   secondary_color: "#e57a05",
//   font_family: "Roboto",
//   italicize: false,
//   background_gradient: false,
//   secondary_gradient: false,
//   style: "DEFAULT",
//   background_image: undefined,
// };
