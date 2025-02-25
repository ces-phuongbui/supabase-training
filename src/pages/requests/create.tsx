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
import {
  IResourceComponentsProps,
  useGetIdentity,
  useTranslate,
} from "@refinedev/core";
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

  const translate = useTranslate();

  // Replace hardcoded text with translations
  const previewText = translate("request.create.preview");
  const generalInformationText = translate(
    "request.create.general-information",
  );
  const titleText = translate("request.create.title");
  const addressText = translate("request.create.address");
  const acceptanceLabelText = translate("request.create.acceptance-label");
  const rejectionLabelText = translate("request.create.rejection-label");
  const closeDateText = translate("request.create.close-date");
  const backgroundImageText = translate("request.create.background-image");
  const deleteText = translate("request.create.delete");
  const visualText = translate("request.create.visual");
  const primaryColorText = translate("request.create.primary-color");
  const secondaryColorText = translate("request.create.secondary-color");
  const gradientText = translate("request.create.gradient");
  const backgroundColorText = translate("request.create.background-color");
  const fontText = translate("request.create.font");
  const italicizeText = translate("request.create.italicize");
  const styleText = translate("request.create.style");
  const defaultStyleText = translate("request.create.default");
  const fancyStyleText = translate("request.create.fancy");
  const createRequestText = translate("request.create.create-request");
  const fieldRequiredText = translate("request.create.field-required");
  const closeDatePastErrorText = translate(
    "request.create.close-date-past-error",
  );

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
    // <Create
    //   isLoading={formLoading}
    //   footerButtons={() => (
    //     <Button
    //       variant="contained"
    //       onClick={(e) => {
    //         e.preventDefault();
    //         if (user) {
    //           clearErrors();
    //           handleSubmit(async (values) => {
    //             let imageUrl = "";
    //             if (backgroundImage) {
    //               // Upload to Supabase storage
    //               const { data, error } = await supabaseClient.storage
    //                 .from("training")
    //                 .upload(userId + "/" + uuidv4(), backgroundImage);

    //               if (error) {
    //                 console.error("Error uploading image:", error);
    //                 return;
    //               }

    //               // Get the public URL
    //               const {
    //                 data: { publicUrl },
    //               } = supabaseClient.storage
    //                 .from("training")
    //                 .getPublicUrl(data.path);

    //               imageUrl = publicUrl;
    //             }
    //             await onFinish({
    //               ...values,
    //               background_image: imageUrl,
    //               user_id: user.id,
    //             });
    //           })();
    //         }
    //       }}
    //     >
    //       Create Request
    //     </Button>
    //   )}
    // >
    //   <Box marginBottom={4}>
    //     <Box mb={2}>
    //       <Typography component="h2" fontSize={24}>
    //         Preview
    //       </Typography>
    //     </Box>
    //     <Background
    //       backgroundImage={
    //         backgroundImage ? URL.createObjectURL(backgroundImage) : ""
    //       }
    //       backgroundColor={backgroundColor}
    //       background_gradient={background_gradient}
    //     >
    //       <RequestCard
    //         backgroundColor={backgroundColor}
    //         title={title}
    //         address={address}
    //         acceptanceLabel={acceptanceLabel}
    //         rejectionLabel={rejectionLabel}
    //         closeDate={closeDate}
    //         secondaryColor={secondaryColor}
    //         primaryColor={primaryColor}
    //         fontFamily={fontFamily}
    //         italicize={italicize}
    //         secondary_gradient={secondary_gradient}
    //         background_gradient={background_gradient}
    //         style={style}
    //         isHaveBackGroundImage={!!backgroundImage}
    //       />
    //     </Background>
    //   </Box>
    //   <Grid component="form" autoComplete="off" container spacing={2}>
    //     <Grid container item xs={12} md={6} spacing={2} flex={1}>
    //       <Grid item xs={12}>
    //         <Typography fontSize={24} fontWeight="semibold">
    //           General Information
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           {...register("title", {
    //             required: "This field is required",
    //           })}
    //           error={!!(errors as any)?.title}
    //           helperText={(errors as any)?.title?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="text"
    //           label="Title"
    //           name="title"
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Autocomplete
    //           {...register("address", {
    //             required: "This field is required",
    //           })}
    //           onChange={(e, value: Address | null) => {
    //             const { label, position } = value || {};
    //             setValue("address", label);
    //             setValue("position", position);
    //           }}
    //           autoComplete={false}
    //           filterOptions={(options: Address[]) => options}
    //           options={addressOptions}
    //           fullWidth
    //           onInputChange={(e, newInputValue: string) => {
    //             setAddressLoading(true);
    //             handleSearch(newInputValue);
    //           }}
    //           onBlur={() => setAddressLoading(false)}
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               //   error={!!(errors as any)?.address}
    //               //   helperText={(errors as any)?.address?.message}
    //               label="Address"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <React.Fragment>
    //                     {addressLoading ? (
    //                       <CircularProgress color="inherit" size={20} />
    //                     ) : null}
    //                     {params.InputProps.endAdornment}
    //                   </React.Fragment>
    //                 ),
    //               }}
    //             />
    //           )}
    //         />
    //       </Grid>
    //       <Grid item xs={6}>
    //         <TextField
    //           {...register("acceptance_label", {
    //             required: "This field is required",
    //           })}
    //           error={!!(errors as any)?.acceptance_label}
    //           helperText={(errors as any)?.acceptance_label?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="text"
    //           label="Acceptance Label"
    //           name="acceptance_label"
    //         />
    //       </Grid>
    //       <Grid item xs={6}>
    //         <TextField
    //           {...register("rejection_label", {
    //             required: "This field is required",
    //           })}
    //           error={!!(errors as any)?.rejection_label}
    //           helperText={(errors as any)?.rejection_label?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="text"
    //           label="Rejection Label"
    //           name="rejection_label"
    //         />
    //       </Grid>
    //       <Grid item xs>
    //         <TextField
    //           {...register("close_date", {
    //             required: "This field is required",
    //             validate: (value) =>
    //               dayjs(value).isAfter(dayjs().subtract(1, "day")) ||
    //               "Close date cannot be in the past",
    //           })}
    //           error={!!(errors as any)?.close_date}
    //           helperText={(errors as any)?.close_date?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="date"
    //           label="Close Date"
    //           name="close_date"
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Box display="flex" gap={2} alignItems="center">
    //           <TextField
    //             fullWidth
    //             InputLabelProps={{ shrink: true }}
    //             type="file"
    //             onChange={handleImageUpload}
    //             inputProps={{
    //               accept: "image/*",
    //               multiple: false,
    //               ref: fileInputRef,
    //             }}
    //             InputProps={{
    //               endAdornment: backgroundImage && (
    //                 <Button
    //                   variant="text"
    //                   color="error"
    //                   onClick={handleDeleteImage}
    //                   sx={{ ml: 1 }}
    //                 >
    //                   Delete
    //                 </Button>
    //               ),
    //             }}
    //             label="Background Image"
    //           />
    //         </Box>
    //       </Grid>
    //     </Grid>
    //     <Grid
    //       container
    //       item
    //       xs={12}
    //       md={6}
    //       spacing={2}
    //       alignContent="flex-start"
    //     >
    //       <Grid item xs={12}>
    //         <Typography fontSize={24} fontWeight="semibold">
    //           Visual
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           {...register("primary_color", {
    //             required: "This field is required",
    //           })}
    //           error={!!(errors as any)?.primary_color}
    //           helperText={(errors as any)?.primary_color?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="color"
    //           label="Primary Color"
    //           name="primary_color"
    //         />
    //       </Grid>
    //       <Grid item xs={8}>
    //         <TextField
    //           {...register("secondary_color", {
    //             required: "This field is required",
    //           })}
    //           disabled={!!backgroundImage}
    //           error={!!(errors as any)?.secondary_color}
    //           helperText={(errors as any)?.secondary_color?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="color"
    //           label="Secondary Color"
    //           name="secondary_color"
    //         />
    //       </Grid>

    //       <Grid item xs={4} display="flex" alignItems="center">
    //         <FormControlLabel
    //           control={<Switch {...register("secondary_gradient")} />}
    //           label="Gradient"
    //           disabled={!!backgroundImage}
    //         />
    //       </Grid>

    //       <Grid item xs={8}>
    //         <TextField
    //           {...register("background_color", {
    //             required: "This field is required",
    //           })}
    //           disabled={!!backgroundImage}
    //           error={!!(errors as any)?.background_color}
    //           helperText={(errors as any)?.background_color?.message}
    //           fullWidth
    //           InputLabelProps={{ shrink: true }}
    //           type="color"
    //           label="Background Color"
    //           name="background_color"
    //         />
    //       </Grid>
    //       <Grid item xs={4} display="flex" alignItems="center">
    //         <FormControlLabel
    //           control={<Switch {...register("background_gradient")} />}
    //           label="Gradient"
    //           disabled={!!backgroundImage}
    //         />
    //       </Grid>

    //       <Grid item xs={8}>
    //         <FormControl fullWidth>
    //           <InputLabel id="font_family">Font</InputLabel>
    //           <Select
    //             labelId="font_family"
    //             label="Age"
    //             error={!!(errors as any)?.font_family}
    //             {...register("font_family", {
    //               required: "This field is required",
    //             })}
    //             defaultValue={fonts[0]}
    //           >
    //             {fonts.map((font) => (
    //               <MenuItem value={font} key={font}>
    //                 {font}
    //               </MenuItem>
    //             ))}
    //           </Select>
    //         </FormControl>
    //       </Grid>
    //       <Grid item xs={4} display="flex" alignItems="center">
    //         <FormControlLabel
    //           control={<Switch {...register("italicize")} />}
    //           label="Italicize"
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <FormControl fullWidth>
    //           <InputLabel id="style">Style</InputLabel>
    //           <Select
    //             labelId="style"
    //             label="Style"
    //             error={!!(errors as any)?.style}
    //             {...register("style", {
    //               required: "This field is required",
    //             })}
    //             defaultValue="DEFAULT"
    //           >
    //             <MenuItem value="DEFAULT">DEFAULT</MenuItem>
    //             <MenuItem value="FANCY">FANCY</MenuItem>
    //           </Select>
    //         </FormControl>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    //   <Grid sx={{ marginTop: "20px" }}>
    //     <Map position={position} address={address} />
    //   </Grid>
    // </Create>
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
        >
          {createRequestText}
        </Button>
      )}
    >
      <Box marginBottom={4}>
        <Box mb={2}>
          <Typography component="h2" fontSize={24}>
            {previewText}
          </Typography>
        </Box>
        <Background
          backgroundImage={
            backgroundImage ? URL.createObjectURL(backgroundImage) : ""
          }
          backgroundColor={backgroundColor}
          background_gradient={background_gradient}
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
          />
        </Background>
      </Box>
      <Grid component="form" autoComplete="off" container spacing={2}>
        <Grid container item xs={12} md={6} spacing={2} flex={1}>
          <Grid item xs={12}>
            <Typography fontSize={24} fontWeight="semibold">
              {generalInformationText}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("title", {
                required: fieldRequiredText,
              })}
              error={!!(errors as any)?.title}
              helperText={(errors as any)?.title?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label={titleText}
              name="title"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              {...register("address", {
                required: fieldRequiredText,
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
                  label={addressText}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {addressLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("acceptance_label", {
                required: fieldRequiredText,
              })}
              error={!!(errors as any)?.acceptance_label}
              helperText={(errors as any)?.acceptance_label?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label={acceptanceLabelText}
              name="acceptance_label"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("rejection_label", {
                required: fieldRequiredText,
              })}
              error={!!(errors as any)?.rejection_label}
              helperText={(errors as any)?.rejection_label?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label={rejectionLabelText}
              name="rejection_label"
            />
          </Grid>
          <Grid item xs>
            <TextField
              {...register("close_date", {
                required: fieldRequiredText,
                validate: (value) =>
                  dayjs(value).isAfter(dayjs().subtract(1, "day")) ||
                  closeDatePastErrorText,
              })}
              error={!!(errors as any)?.close_date}
              helperText={(errors as any)?.close_date?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="date"
              label={closeDateText}
              name="close_date"
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2} alignItems="center">
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
                    >
                      {deleteText}
                    </Button>
                  ),
                }}
                label={backgroundImageText}
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
        >
          <Grid item xs={12}>
            <Typography fontSize={24} fontWeight="semibold">
              {visualText}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("primary_color", {
                required: fieldRequiredText,
              })}
              error={!!(errors as any)?.primary_color}
              helperText={(errors as any)?.primary_color?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="color"
              label={primaryColorText}
              name="primary_color"
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              {...register("secondary_color", {
                required: fieldRequiredText,
              })}
              disabled={!!backgroundImage}
              error={!!(errors as any)?.secondary_color}
              helperText={(errors as any)?.secondary_color?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="color"
              label={secondaryColorText}
              name="secondary_color"
            />
          </Grid>

          <Grid item xs={4} display="flex" alignItems="center">
            <FormControlLabel
              control={<Switch {...register("secondary_gradient")} />}
              label={gradientText}
              disabled={!!backgroundImage}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              {...register("background_color", {
                required: fieldRequiredText,
              })}
              disabled={!!backgroundImage}
              error={!!(errors as any)?.background_color}
              helperText={(errors as any)?.background_color?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="color"
              label={backgroundColorText}
              name="background_color"
            />
          </Grid>
          <Grid item xs={4} display="flex" alignItems="center">
            <FormControlLabel
              control={<Switch {...register("background_gradient")} />}
              label={gradientText}
              disabled={!!backgroundImage}
            />
          </Grid>

          <Grid item xs={8}>
            <FormControl fullWidth>
              <InputLabel id="font_family">{fontText}</InputLabel>
              <Select
                labelId="font_family"
                label={fontText}
                error={!!(errors as any)?.font_family}
                {...register("font_family", {
                  required: fieldRequiredText,
                })}
                defaultValue={fonts[0]}
              >
                {fonts.map((font) => (
                  <MenuItem value={font} key={font}>
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} display="flex" alignItems="center">
            <FormControlLabel
              control={<Switch {...register("italicize")} />}
              label={italicizeText}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="style">{styleText}</InputLabel>
              <Select
                labelId="style"
                label={styleText}
                error={!!(errors as any)?.style}
                {...register("style", {
                  required: fieldRequiredText,
                })}
                defaultValue="DEFAULT"
              >
                <MenuItem value="DEFAULT">{defaultStyleText}</MenuItem>
                <MenuItem value="FANCY">{fancyStyleText}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{ marginTop: "20px" }}>
        <Map position={position} address={address} />
      </Grid>
    </Create>
  );
};
