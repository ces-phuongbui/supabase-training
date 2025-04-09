import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { IRequest } from "../requests/list";
import { invitationSchema } from "../CreateInvitation/schema";
import { InvitationForm } from "@/components/InvitationForm";
import { InvitationCard } from "@/components/InvitationCard";

interface TabDetailContentProps {
  request: IRequest;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isDisabled: boolean;
  onSubmit: (values: z.infer<typeof invitationSchema>) => Promise<void>;
}

export const TabDetailContent = ({
  request,
  isEditing,
  setIsEditing,
  isDisabled,
  onSubmit,
}: TabDetailContentProps) => {
  const {
    background_color,
    background_gradient,
    background_image,
    title,
    address,
    acceptance_label,
    rejection_label,
    activity_date,
    activity_time,
    close_date,
    secondary_color,
    secondary_gradient,
    primary_color,
    font_family,
    italicize,
    style,
  } = request;

  const invitationCardProps = {
    backgroundColor: request.background_color,
    backgroundGradient: request.background_gradient,
    backgroundImage: request.background_image,
    title: request.title,
    address: request.address,
    acceptanceLabel: request.acceptance_label,
    rejectionLabel: request.rejection_label,
    activityDate: new Date(request.activity_date),
    closeDate: new Date(request.close_date),
    secondaryColor: request.secondary_color,
    secondaryGradient: request.secondary_gradient,
    primaryColor: request.primary_color,
    fontFamily: request.font_family,
    italicize: request.italicize,
    style: request.style,
    isEdit: false,
  };

  const form = useForm<z.infer<typeof invitationSchema>>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      title: title ?? "",
      address: address ?? "",
      activity_date: new Date(activity_date ?? ""),
      activity_time: activity_time,
      acceptance_label: acceptance_label ?? "",
      rejection_label: rejection_label ?? "",
      background_image: background_image ?? "",
      close_date: new Date(close_date ?? ""),
      background_color: background_color ?? "#ffdbbb",
      primary_color: primary_color ?? "#000000",
      secondary_color: secondary_color ?? "#e57a05",
      font_family: font_family ?? "Roboto",
      italicize: italicize ?? false,
      background_gradient: background_gradient ?? false,
      secondary_gradient: secondary_gradient ?? false,
      style: style ?? "DEFAULT",
    },
  });

  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Event details</h2>
        {!isEditing ? (
          <Button
            disabled={true}
            onClick={() => setIsEditing(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Edit Details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isDisabled}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <InvitationForm form={form} onSubmit={onSubmit} isEditing={isEditing}>
        <InvitationCard {...invitationCardProps} />
      </InvitationForm>
    </div>
  );
};
