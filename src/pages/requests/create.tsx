import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  debounce,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { IResourceComponentsProps, useGetIdentity } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../../components/header";
import { RequestCard } from "../../components/request-card";
import Background from "../../components/request-card/background";
import { supabaseClient } from "../../utility";
import dayjs from "../../utility/dayjs";
import fonts from "../../utility/fonts";
import Map from "./map";
import { Address } from "@/utility/types";

export const RequestCreate: React.FC<IResourceComponentsProps> = () => {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [userId, setUserId] = useState("");
  const [addressOptions, setAddressOptions] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user } = useGetIdentity<IUser>();

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
  }, [userId]);

  const {
    refineCore: { formLoading, onFinish },
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const title = watch("title");
  const address = watch("address");
  const closeDate = watch("close_date");
  const acceptanceLabel = watch("acceptance_label");
  const rejectionLabel = watch("rejection_label");
  const secondaryColor = watch("secondary_color");
  const primaryColor = watch("primary_color");
  const fontFamily = watch("font_family");
  const backgroundColor = watch("background_color");
  const italicize = watch("italicize");
  const secondary_gradient = watch("secondary_gradient");
  const background_gradient = watch("background_gradient");
  const style = watch("style");
  const position = watch("position");

  useEffect(() => {
    setValue("secondary_color", "#F9F4D7");
    setValue("primary_color", "#846C15");
    setValue("acceptance_label", "Politely Accepts");
    setValue("rejection_label", "Respectfully Declines");
    setValue("font_family", fonts[0]);
    setValue("close_date", dayjs().add(7, "day").format("YYYY-MM-DD"));
    setValue("background_color", "#EEE6B4");
    setValue("italicize", false);
    setValue("secondary_gradient", false);
    setValue("background_gradient", false);
    setValue("style", "DEFAULT");
  }, [setValue]);

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
              lat: number;
              lon: number;
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackgroundImage(file);
  };

  const handleDeleteImage = async () => {
    setBackgroundImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Create
      isLoading={formLoading}
      footerButtons={() => (
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            if (user) {
              clearErrors();
              handleSubmit(async (values) => {
                let imageUrl = "";
                if (backgroundImage) {
                  // Upload to Supabase storage
                  const { data, error } = await supabaseClient.storage
                    .from("training")
                    .upload(userId + "/" + uuidv4(), backgroundImage);

                  if (error) {
                    console.error("Error uploading image:", error);
                    return;
                  }

                  // Get the public URL
                  const {
                    data: { publicUrl },
                  } = supabaseClient.storage
                    .from("training")
                    .getPublicUrl(data.path);

                  imageUrl = publicUrl;
                }
                await onFinish({
                  ...values,
                  background_image: imageUrl,
                  user_id: user.id,
                });
              })();
            }
          }}
          data-oid="cg29_7n"
        >
          Create Request
        </Button>
      )}
      data-oid="09lzdvh"
    >
      <Box marginBottom={4} data-oid="p-dakzw">
        <Box mb={2} data-oid="rtw48ps">
          <Typography component="h2" fontSize={24} data-oid="6xfmnf8">
            Preview
          </Typography>
        </Box>
        <Background
          backgroundImage={
            backgroundImage ? URL.createObjectURL(backgroundImage) : ""
          }
          backgroundColor={backgroundColor}
          background_gradient={background_gradient}
          data-oid="00.aqor"
        >
          <RequestCard
            backgroundColor={backgroundColor}
            title={title}
            address={address}
            acceptanceLabel={acceptanceLabel}
            rejectionLabel={rejectionLabel}
            closeDate={closeDate}
            secondaryColor={secondaryColor}
            primaryColor={primaryColor}
            fontFamily={fontFamily}
            italicize={italicize}
            secondary_gradient={secondary_gradient}
            background_gradient={background_gradient}
            style={style}
            isHaveBackGroundImage={!!backgroundImage}
            data-oid=":3n7y:a"
          />
        </Background>
      </Box>
      <Grid
        component="form"
        autoComplete="off"
        container
        spacing={2}
        data-oid="owq75ik"
      >
        <Grid
          container
          item
          xs={12}
          md={6}
          spacing={2}
          flex={1}
          data-oid="y9a9pry"
        >
          <Grid item xs={12} data-oid="ljl:o57">
            <Typography fontSize={24} fontWeight="semibold" data-oid=".g7oubc">
              General Information
            </Typography>
          </Grid>
          <Grid item xs={12} data-oid="qq2yuce">
            <TextField
              {...register("title", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.title}
              helperText={(errors as any)?.title?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Title"
              name="title"
              data-oid="uoxs3o6"
            />
          </Grid>
          <Grid item xs={12} data-oid="tpdlmyc">
            <Autocomplete
              {...register("address", {
                required: "This field is required",
              })}
              onChange={(e, value: Address | null) => {
                const { label, position } = value || {};
                setValue("address", label);
                setValue("position", position);
              }}
              autoComplete={false}
              filterOptions={(options: Address[]) => options}
              options={addressOptions}
              fullWidth
              onInputChange={(e, newInputValue: string) => {
                setAddressLoading(true);
                handleSearch(newInputValue);
              }}
              onBlur={() => setAddressLoading(false)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  //   error={!!(errors as any)?.address}
                  //   helperText={(errors as any)?.address?.message}
                  label="Address"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {addressLoading ? (
                          <CircularProgress
                            color="inherit"
                            size={20}
                            data-oid="3qofdqn"
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  data-oid="izyec_q"
                />
              )}
              data-oid="eo38_z1"
            />
          </Grid>
          <Grid item xs={6} data-oid="oxn37-6">
            <TextField
              {...register("acceptance_label", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.acceptance_label}
              helperText={(errors as any)?.acceptance_label?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Acceptance Label"
              name="acceptance_label"
              data-oid=".vhz-v3"
            />
          </Grid>
          <Grid item xs={6} data-oid=":tdycqz">
            <TextField
              {...register("rejection_label", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.rejection_label}
              helperText={(errors as any)?.rejection_label?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Rejection Label"
              name="rejection_label"
              data-oid="tnn6lzi"
            />
          </Grid>
          <Grid item xs data-oid="jkdzzgl">
            <TextField
              {...register("close_date", {
                required: "This field is required",
                validate: (value) =>
                  dayjs(value).isAfter(dayjs().subtract(1, "day")) ||
                  "Close date cannot be in the past",
              })}
              error={!!(errors as any)?.close_date}
              helperText={(errors as any)?.close_date?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="date"
              label="Close Date"
              name="close_date"
              data-oid="3nd4:rf"
            />
          </Grid>
          <Grid item xs={12} data-oid="4zxtc_7">
            <Box display="flex" gap={2} alignItems="center" data-oid="5yhstj0">
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="file"
                onChange={handleImageUpload}
                inputProps={{
                  accept: "image/*",
                  multiple: false,
                  ref: fileInputRef,
                }}
                InputProps={{
                  endAdornment: backgroundImage && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={handleDeleteImage}
                      sx={{ ml: 1 }}
                      data-oid="c9qyr6k"
                    >
                      Delete
                    </Button>
                  ),
                }}
                label="Background Image"
                data-oid="-ymhhtk"
              />
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={6}
          spacing={2}
          alignContent="flex-start"
          data-oid="2w7::p3"
        >
          <Grid item xs={12} data-oid="ll1l_e8">
            <Typography fontSize={24} fontWeight="semibold" data-oid="mws.4nr">
              Visual
            </Typography>
          </Grid>
          <Grid item xs={12} data-oid="f44-sxe">
            <TextField
              {...register("primary_color", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.primary_color}
              helperText={(errors as any)?.primary_color?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="color"
              label="Primary Color"
              name="primary_color"
              data-oid="gyu75o7"
            />
          </Grid>
          <Grid item xs={8} data-oid="a0csghy">
            <TextField
              {...register("secondary_color", {
                required: "This field is required",
              })}
              disabled={!!backgroundImage}
              error={!!(errors as any)?.secondary_color}
              helperText={(errors as any)?.secondary_color?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="color"
              label="Secondary Color"
              name="secondary_color"
              data-oid="e5_5hr2"
            />
          </Grid>

          <Grid
            item
            xs={4}
            display="flex"
            alignItems="center"
            data-oid="f:5h1r-"
          >
            <FormControlLabel
              control={
                <Switch
                  {...register("secondary_gradient")}
                  data-oid="bcq.wqz"
                />
              }
              label="Gradient"
              disabled={!!backgroundImage}
              data-oid="8gjn:2k"
            />
          </Grid>

          <Grid item xs={8} data-oid="e.skj.i">
            <TextField
              {...register("background_color", {
                required: "This field is required",
              })}
              disabled={!!backgroundImage}
              error={!!(errors as any)?.background_color}
              helperText={(errors as any)?.background_color?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="color"
              label="Background Color"
              name="background_color"
              data-oid="jucfht7"
            />
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            alignItems="center"
            data-oid="_0reeu:"
          >
            <FormControlLabel
              control={
                <Switch
                  {...register("background_gradient")}
                  data-oid="rjde_in"
                />
              }
              label="Gradient"
              disabled={!!backgroundImage}
              data-oid=".y8oopg"
            />
          </Grid>

          <Grid item xs={8} data-oid="r.yszcx">
            <FormControl fullWidth data-oid="zk7c2ib">
              <InputLabel id="font_family" data-oid="-p-:x-o">
                Font
              </InputLabel>
              <Select
                labelId="font_family"
                label="Age"
                error={!!(errors as any)?.font_family}
                {...register("font_family", {
                  required: "This field is required",
                })}
                defaultValue={fonts[0]}
                data-oid="m.u6:xv"
              >
                {fonts.map((font) => (
                  <MenuItem value={font} key={font} data-oid="3-sqnuo">
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            alignItems="center"
            data-oid="316am2u"
          >
            <FormControlLabel
              control={<Switch {...register("italicize")} data-oid="t1gx1si" />}
              label="Italicize"
              data-oid="7cnhyyi"
            />
          </Grid>
          <Grid item xs={12} data-oid="81.qe1u">
            <FormControl fullWidth data-oid="ynbdkao">
              <InputLabel id="style" data-oid="vg8ahv.">
                Style
              </InputLabel>
              <Select
                labelId="style"
                label="Style"
                error={!!(errors as any)?.style}
                {...register("style", {
                  required: "This field is required",
                })}
                defaultValue="DEFAULT"
                data-oid="16pk_fa"
              >
                <MenuItem value="DEFAULT" data-oid="euwxv66">
                  DEFAULT
                </MenuItem>
                <MenuItem value="FANCY" data-oid="6spkjyt">
                  FANCY
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{ marginTop: "20px" }} data-oid="pjb--_b">
        <Map
          position={position}
          address={address}
          data-oid="8cfwep9"
          height="30vh"
        />
      </Grid>
    </Create>
  );
};
