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
import { LatLngExpression } from "leaflet";

type Address = {
  label: string;
  position: LatLngExpression;
};

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
          data-oid="pr7maaz"
        >
          Create Request
        </Button>
      )}
      data-oid="wtqp983"
    >
      <Box marginBottom={4} data-oid="b0w2t31">
        <Box mb={2} data-oid="pyp3ya3">
          <Typography component="h2" fontSize={24} data-oid="g5h:kch">
            Preview
          </Typography>
        </Box>
        <Background
          backgroundImage={
            backgroundImage ? URL.createObjectURL(backgroundImage) : ""
          }
          backgroundColor={backgroundColor}
          background_gradient={background_gradient}
          data-oid=".0len6q"
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
            data-oid="ugmsaad"
          />
        </Background>
      </Box>
      <Grid
        component="form"
        autoComplete="off"
        container
        spacing={2}
        data-oid="h_ri2r5"
      >
        <Grid
          container
          item
          xs={12}
          md={6}
          spacing={2}
          flex={1}
          data-oid="npeugf."
        >
          <Grid item xs={12} data-oid="g-xbuwy">
            <Typography fontSize={24} fontWeight="semibold" data-oid="pvcsjtm">
              General Information
            </Typography>
          </Grid>
          <Grid item xs={12} data-oid="_yzb.3-">
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
              data-oid="ny.0nez"
            />
          </Grid>
          <Grid item xs={12} data-oid="eovfsea">
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
                            data-oid="6jq1mr1"
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  data-oid="i:q.x.q"
                />
              )}
              data-oid="7kss1fr"
            />
          </Grid>
          <Grid item xs={6} data-oid="xaa5apn">
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
              data-oid="sxpg.d8"
            />
          </Grid>
          <Grid item xs={6} data-oid="ze79p2g">
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
              data-oid="lnmhyow"
            />
          </Grid>
          <Grid item xs data-oid="92rt9an">
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
              data-oid="t_30ora"
            />
          </Grid>
          <Grid item xs={12} data-oid="rlbb9n.">
            <Box display="flex" gap={2} alignItems="center" data-oid="e-55xkn">
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
                      data-oid="iimjkht"
                    >
                      Delete
                    </Button>
                  ),
                }}
                label="Background Image"
                data-oid="g9qmb0e"
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
          data-oid="ied9ibd"
        >
          <Grid item xs={12} data-oid="2zsf00v">
            <Typography fontSize={24} fontWeight="semibold" data-oid="65hv06v">
              Visual
            </Typography>
          </Grid>
          <Grid item xs={12} data-oid="an5f1g5">
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
              data-oid="klswv07"
            />
          </Grid>
          <Grid item xs={8} data-oid="ym1185x">
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
              data-oid="f4mtfac"
            />
          </Grid>

          <Grid
            item
            xs={4}
            display="flex"
            alignItems="center"
            data-oid="49el7n1"
          >
            <FormControlLabel
              control={
                <Switch
                  {...register("secondary_gradient")}
                  data-oid="y3th315"
                />
              }
              label="Gradient"
              disabled={!!backgroundImage}
              data-oid="3cayne_"
            />
          </Grid>

          <Grid item xs={8} data-oid=":jljvf:">
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
              data-oid="ye1-4du"
            />
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            alignItems="center"
            data-oid="m_rr06h"
          >
            <FormControlLabel
              control={
                <Switch
                  {...register("background_gradient")}
                  data-oid="z92_2dc"
                />
              }
              label="Gradient"
              disabled={!!backgroundImage}
              data-oid="hvnfg.7"
            />
          </Grid>

          <Grid item xs={8} data-oid="xp-kdw7">
            <FormControl fullWidth data-oid="yq-865w">
              <InputLabel id="font_family" data-oid="56gbo5g">
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
                data-oid="pzl-9n9"
              >
                {fonts.map((font) => (
                  <MenuItem value={font} key={font} data-oid="5_-.l0b">
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
            data-oid="i_jgogw"
          >
            <FormControlLabel
              control={<Switch {...register("italicize")} data-oid="s2roefq" />}
              label="Italicize"
              data-oid="gyv3:5:"
            />
          </Grid>
          <Grid item xs={12} data-oid="g0x::r4">
            <FormControl fullWidth data-oid="2zyh0v2">
              <InputLabel id="style" data-oid="d-5q5hs">
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
                data-oid=".gfwux9"
              >
                <MenuItem value="DEFAULT" data-oid="juxv5-d">
                  DEFAULT
                </MenuItem>
                <MenuItem value="FANCY" data-oid="m_bej22">
                  FANCY
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{ marginTop: "20px" }} data-oid="rop6.09">
        <Map position={position} address={address} data-oid="ap33d43" />
      </Grid>
    </Create>
  );
};
