import { debounce } from "@mui/material";
import { CalendarIcon } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
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
import { formatDateTime } from "@/helpers";
import { cn } from "@/lib/utils";
import { invitationSchema } from "@/pages/CreateInvitation/schema";
import { STYLE_OPTIONS } from "@/utility/constant";
import webSafeFonts from "@/utility/fonts";
import { Address } from "@/utility/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { AutoComplete } from "../ui/autocomplete";
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

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
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");

  let controller: AbortController | null = null;

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return setAddressLoading(false);

      if (controller) {
        controller.abort();
      }

      try {
        controller = new AbortController();
        const { signal } = controller;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}&limit=5&format=json&addressdetails=1`,
          { signal },
        );
        const data = await response.json();

        setAddressOptions(
          data.map(
            ({
              display_name,
              lat,
              lon,
            }: {
              display_name: string;
              lat: string;
              lon: string;
            }) => ({
              label: display_name,
              position: { lat, lng: lon },
            }),
          ),
        );
        setAddressLoading(false);
      } catch (error) {
        console.error(error);
        setAddressLoading(false);
      }
    }, 500),
    [],
  );
  useEffect(() => {
    handleSearch(searchValue);
  }, [handleSearch, searchValue]);

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
    <Form {...form} data-oid="t5hzs._">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
        data-oid="1wvesww"
      >
        <CardContent className="p-2 space-y-6" data-oid="egl158q">
          <FormField
            control={form.control}
            name="title"
            disabled={!isEditing}
            render={({ field }) => (
              <FormItem data-oid="iwdywp:">
                <FormLabel data-oid="46p._r5">Event Title</FormLabel>
                <FormControl data-oid="lf8-7ti">
                  <Input
                    placeholder="Enter the title of your event"
                    {...field}
                    className="placeholder:text-gray-300"
                    data-oid=".uf98iw"
                  />
                </FormControl>
                <FormMessage className="text-red-500" data-oid="rtqwx-6" />
              </FormItem>
            )}
            data-oid="8f-xf8q"
          />

          <FormField
            control={form.control}
            name="address"
            disabled={!isEditing}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <AutoComplete
                    disabled={!isEditing}
                    selectedValue={field.value}
                    onSelectedValueChange={(value) => {
                      field.onChange(value);
                      setSearchValue(value);
                      const selectedAddress = addressOptions.find(
                        (option) => option.label === value,
                      );

                      if (selectedAddress) {
                        form.setValue(
                          "position",
                          selectedAddress.position as any,
                        );
                      }
                    }}
                    searchValue={searchValue}
                    onSearchValueChange={(value) => {
                      setSearchValue(value);
                      if (!value) {
                        setAddressOptions([]);
                      }
                    }}
                    items={addressOptions.map(({ label }) => ({
                      value: label,
                      label,
                    }))}
                    isLoading={addressLoading}
                    placeholder="Enter the address or location"
                    emptyMessage="No Address found"
                  />
                </FormControl>
                <FormMessage className="text-red-500" data-oid="d:mu5qi" />
              </FormItem>
            )}
            data-oid="lc:ri4u"
          />

          <div
            className="flex flex-col sm:flex-row items-center gap-4"
            data-oid="cjoo3qi"
          >
            <FormField
              control={form.control}
              name="activity_date"
              disabled={!isEditing}
              render={({ field }) => (
                <FormItem
                  className="flex flex-col w-full sm:w-2/3"
                  data-oid="d.wgkbg"
                >
                  <FormLabel className="pb-2" data-oid="re7kid0">
                    Event Date
                  </FormLabel>
                  <Popover data-oid="1qjom.o">
                    <PopoverTrigger asChild data-oid="0z-who7">
                      <FormControl data-oid="92nwpnq">
                        <Button
                          variant={"outline"}
                          disabled={!isEditing}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          data-oid="k.7u3il"
                        >
                          {field.value ? (
                            formatDateTime({
                              date: field.value,
                              formatDate: "PPP",
                            })
                          ) : (
                            <span data-oid="x_fx6qr">Pick a date</span>
                          )}
                          <CalendarIcon
                            className="ml-auto h-4 w-4 opacity-50"
                            data-oid="tjbqfp0"
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-white"
                      align="start"
                      data-oid="t-xfueq"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        data-oid="jtdx56i"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-red-500" data-oid="z7ti_g-" />
                </FormItem>
              )}
              data-oid="qom9oix"
            />

            <FormField
              control={form.control}
              name="activity_time"
              disabled={!isEditing}
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/3">
                  <FormLabel>Event Time</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="font-normal focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-[15rem] bg-white">
                          {Array.from({ length: 96 }).map((_, i) => {
                            const hour = Math.floor(i / 4)
                              .toString()
                              .padStart(2, "0");
                            const minute = ((i % 4) * 15)
                              .toString()
                              .padStart(2, "0");
                            const timeValue = `${hour}:${minute}`;
                            return (
                              <SelectItem
                                key={i}
                                value={timeValue}
                                className="cursor-pointer bg-white border border-gray-100 p-3"
                              >
                                {timeValue}
                              </SelectItem>
                            );
                          })}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-oid="2jhxt5y"
          >
            <FormField
              control={form.control}
              name="acceptance_label"
              disabled={!isEditing}
              render={({ field }) => (
                <FormItem data-oid="rfod270">
                  <FormLabel data-oid="jac01p0">Accept Button Text</FormLabel>
                  <FormControl data-oid="u:wda0r">
                    <Input
                      placeholder="Accept"
                      {...field}
                      className="placeholder:text-gray-300"
                      data-oid="483i1l1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" data-oid="1vc_-2q" />
                </FormItem>
              )}
              data-oid="551jes:"
            />

            <FormField
              control={form.control}
              name="rejection_label"
              disabled={!isEditing}
              render={({ field }) => (
                <FormItem data-oid="zienvkq">
                  <FormLabel data-oid="j:hm8l7">Decline Button Text</FormLabel>
                  <FormControl data-oid="m.nx2s8">
                    <Input
                      placeholder="Decline"
                      {...field}
                      className="placeholder:text-gray-300"
                      data-oid="qaarc:5"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" data-oid="h2h_ozl" />
                </FormItem>
              )}
              data-oid="radusvn"
            />
          </div>
          <FormField
            control={form.control}
            name="close_date"
            disabled={!isEditing}
            render={({ field }) => (
              <FormItem className="flex flex-col" data-oid="kh0j1_0">
                <FormLabel data-oid="soj0xtx">Close Date</FormLabel>
                <Popover data-oid="hfcl:gr">
                  <PopoverTrigger asChild data-oid="8p41yfp">
                    <FormControl data-oid="yhf5lkm">
                      <Button
                        variant={"outline"}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        data-oid="jw27:-j"
                      >
                        {field.value ? (
                          formatDateTime({
                            date: field.value,
                            formatDate: "PPP",
                          })
                        ) : (
                          <span data-oid="s0p180y">Pick a date</span>
                        )}
                        <CalendarIcon
                          className="ml-auto h-4 w-4 opacity-50"
                          data-oid="ej55b3f"
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white"
                    align="start"
                    data-oid="0c86znk"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      data-oid="elp4s1n"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" data-oid="ji4snk6" />
              </FormItem>
            )}
            data-oid="yajfbsz"
          />

          <FormField
            control={form.control}
            name="style"
            disabled={!isEditing}
            render={({ field }) => (
              <FormItem className="flex flex-col" data-oid="q9yxfws">
                <FormLabel data-oid="by:68ss">Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
                  data-oid="52f:i8."
                >
                  <FormControl data-oid="ss_b.rm">
                    <SelectTrigger data-oid="tr4pto0">
                      <SelectValue
                        placeholder="Select an event type"
                        data-oid="3n.ku.i"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white" data-oid="2gvrd4k">
                    {STYLE_OPTIONS.map((style) => (
                      <SelectItem
                        key={style.value}
                        value={style.value}
                        className="cursor-pointer text-black p-3 border border-gray-100"
                        data-oid=":gp7ivv"
                      >
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" data-oid="nppb2me" />
              </FormItem>
            )}
            data-oid="tfx75.e"
          />

          <FormField
            control={form.control}
            name="background_image"
            disabled={!isEditing}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem data-oid="t3lv-k1">
                <FormLabel data-oid="6rzf8wv">Background Image</FormLabel>
                <FormControl data-oid="-rqg6w7">
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
                    data-oid="3simymm"
                  />
                </FormControl>
                <FormMessage className="text-red-500" data-oid="_henx0_" />
              </FormItem>
            )}
            data-oid="54i5dnd"
          />

          <Accordion
            type="single"
            collapsible
            className="w-full"
            data-oid="w5_a8d5"
          >
            <AccordionItem value="colors" data-oid="00u06ep">
              <AccordionTrigger data-oid="lzt9t2i">Colors</AccordionTrigger>
              <AccordionContent className="space-y-6" data-oid="8-.zi3n">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-oid="izy54ca"
                >
                  <FormField
                    control={form.control}
                    name="primary_color"
                    disabled={!isEditing}
                    render={({ field }) => (
                      <FormItem data-oid="djomtu-">
                        <FormLabel data-oid="4sjsnp3">
                          Primary Text Color
                        </FormLabel>
                        <div className="mt-2" data-oid="-jk9zyw">
                          <HexColorPicker
                            color={field.value}
                            onChange={field.onChange}
                            data-oid="y1h3ffm"
                          />

                          <Input
                            {...field}
                            className="mt-2"
                            value={field.value}
                            onChange={field.onChange}
                            data-oid="sflz6:y"
                          />
                        </div>
                        <FormMessage
                          className="text-red-500"
                          data-oid="xf.0csv"
                        />
                      </FormItem>
                    )}
                    data-oid="f.s0_:e"
                  />

                  <FormField
                    control={form.control}
                    name="background_color"
                    disabled={!isEditing}
                    render={({ field }) => (
                      <FormItem data-oid="8ud92ac">
                        <FormLabel data-oid="zyh132g">
                          Background Color
                        </FormLabel>
                        <div className="mt-2" data-oid="8q39e9x">
                          <HexColorPicker
                            color={field.value}
                            onChange={field.onChange}
                            data-oid="0exwv_t"
                          />

                          <Input
                            {...field}
                            className="mt-2"
                            value={field.value}
                            onChange={field.onChange}
                            data-oid="wniqwzl"
                          />
                        </div>
                        <FormMessage
                          className="text-red-500"
                          data-oid="iol3mz3"
                        />
                      </FormItem>
                    )}
                    data-oid="k4:i4sg"
                  />

                  <FormField
                    control={form.control}
                    name="secondary_color"
                    disabled={!isEditing}
                    render={({ field }) => (
                      <FormItem data-oid="uqfz8fs">
                        <FormLabel data-oid="9up4ckf">
                          Secondary Color
                        </FormLabel>
                        <div className="mt-2" data-oid="scoh83c">
                          <HexColorPicker
                            color={field.value}
                            onChange={field.onChange}
                            data-oid="tt5-hj5"
                          />

                          <Input
                            {...field}
                            className="mt-2"
                            value={field.value}
                            onChange={field.onChange}
                            data-oid="ib37rv_"
                          />
                        </div>
                        <FormMessage
                          className="text-red-500"
                          data-oid="b.rmaug"
                        />
                      </FormItem>
                    )}
                    data-oid="0z00bn."
                  />
                </div>

                <div className="flex items-center space-x-2" data-oid="rb7qbvy">
                  <FormField
                    control={form.control}
                    name="background_gradient"
                    disabled={!isEditing}
                    render={({ field }) => (
                      <FormItem
                        className="flex flex-row items-center space-x-2"
                        data-oid="6afp1qm"
                      >
                        <FormControl data-oid="dn71m9_">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-oid="7ugjo6z"
                            className="border-gray-400"
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormLabel data-oid="yest.y2">
                          Use gradient for background
                        </FormLabel>
                      </FormItem>
                    )}
                    data-oid="9-uos56"
                  />
                </div>

                <div className="flex items-center space-x-2" data-oid="yoslg8q">
                  <FormField
                    control={form.control}
                    name="secondary_gradient"
                    disabled={!isEditing}
                    render={({ field }) => (
                      <FormItem
                        className="flex flex-row items-center space-x-2"
                        data-oid="ty0mcej"
                      >
                        <FormControl data-oid="6cqorl6">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-oid="akkr-0."
                            className="border-gray-400"
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormLabel data-oid="4q0f8-k">
                          Use gradient for secondary color
                        </FormLabel>
                      </FormItem>
                    )}
                    data-oid="u0x0l4d"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="typography" data-oid="y2if9_9">
              <AccordionTrigger data-oid="i8_bm-z">Typography</AccordionTrigger>
              <AccordionContent className="space-y-6" data-oid="4.e4h96">
                <FormField
                  control={form.control}
                  name="font_family"
                  disabled={!isEditing}
                  render={({ field }) => (
                    <FormItem data-oid="lrsqg7t">
                      <FormLabel data-oid="m.73qfv">Font Family</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        data-oid="usko7r1"
                        disabled={field.disabled}
                      >
                        <FormControl data-oid="mjb9pdr">
                          <SelectTrigger data-oid="5sngvfj">
                            <SelectValue
                              placeholder="Select a font"
                              data-oid="vqe.i01"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white" data-oid="5n:n80v">
                          {webSafeFonts.map((font) => (
                            <SelectItem
                              key={font}
                              value={font}
                              style={{ fontFamily: font }}
                              data-oid="ozjkkk1"
                              className="text-black cursor-pointer hover:bg-gray-300"
                            >
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage
                        className="text-red-500"
                        data-oid=":tvlj_i"
                      />
                    </FormItem>
                  )}
                  data-oid="sme0_au"
                />

                <FormField
                  control={form.control}
                  name="italicize"
                  disabled={!isEditing}
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-row items-center space-x-2"
                      data-oid="23j.--3"
                    >
                      <FormControl data-oid="lvn_yz4">
                        <Switch
                          disabled={field.disabled}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-oid="c5fdi2r"
                          className="border-gray-400"
                        />
                      </FormControl>
                      <FormLabel data-oid=".u60vyx">Italicize text</FormLabel>
                    </FormItem>
                  )}
                  data-oid="tg5r9gj"
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
