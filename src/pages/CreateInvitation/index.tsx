"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCreate, useNotification } from "@refinedev/core";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Shadcn UI components
import { InvitationCard } from "@/components/InvitationCard";
import { InvitationForm } from "@/components/InvitationForm";
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/utility";
import { IRequest } from "../requests/list";
import { invitationSchema } from "./schema";
import { formatDateTime } from "@/helpers";

export const CreateInvitation = () => {
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
          background_image: imageUrl,
        },
      },
      {
        onSuccess: () => {
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
    closeDate: form.watch("close_date"),
    isEdit: false,
  };

  return (
    <div className="w-full h-full relative" data-oid="_cdgc4_">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center justify-center z-10"
        onClick={() => navigate("/requests")}
        data-oid="_c9ntln"
      >
        <ArrowLeft size={40} data-oid="27suo:8" />
        Back
      </Button>

      <div className="container max-w-6xl mx-auto py-8" data-oid="97wb-to">
        <h1
          className="text-4xl font-bold mb-6 text-center pt-8"
          data-oid="6ki17b9"
        >
          Create New Event
        </h1>

        <h4 className="text-lg font-bold mb-2" data-oid=":1tq2bu">
          Event Details
        </h4>
        <h5 className="text-sm text-gray-400" data-oid="t7kipl:">
          Provide the details of the event to create an invitation
        </h5>
        <InvitationForm
          form={form}
          onSubmit={onSubmit}
          isEditing={true}
          data-oid="s:.55f7"
        >
          <InvitationCard {...invitationCardProps} data-oid="1od:iuh" />
          <div className="flex justify-end w-full" data-oid="8i:x_46">
            <Button
              type="submit"
              disabled={isDisabled}
              className="bg-amber-600 w-full hover:bg-amber-700 text-white"
              data-oid="_i1_0vb"
            >
              Create Invitation
            </Button>
          </div>
        </InvitationForm>
      </div>
    </div>
  );
};

export default CreateInvitation;

const DEFAULT_INVITATION_VALUES = {
  title: "",
  address: "",
  activity_date: new Date(),
  activity_time: formatDateTime({ date: new Date(), formatDate: "HH:mm" }),
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
