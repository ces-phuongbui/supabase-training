import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { IRequest } from "../../pages/requests/list";
import { supabaseClient } from "@/utility";

interface RequestListCardProps {
  request: IRequest;
  onDelete?: (id: string | number) => Promise<void>;
}

const RequestListCard = ({ request, onDelete }: RequestListCardProps) => {
  async function handleDelete() {
    try {
      const { error } = await supabaseClient
        .from("requests") // Replace with your actual table name
        .delete()
        .eq("id", request.id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting request card:", error);
      return { success: false, error };
    }
  }

  return (
    <Card
      className="overflow-hidden min-h-96 border border-gray-400 shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1F]"
      data-oid="n26a-s_"
    >
      {/* Image at the top */}
      <div className="w-full h-52 pt-4 px-4 overflow-hidden" data-oid=":ivuccs">
        <div
          className="h-full overflow-hidden rounded-[0.25rem] border border-gray-200"
          data-oid="5b-wvqj"
        >
          {request.background_image ? (
            <img
              src={request.background_image}
              alt={request.title}
              className="w-full h-full object-cover rounded-[0.25rem]"
              loading="lazy"
              decoding="async"
              data-oid="v-rwage"
            />
          ) : (
            <div
              className="w-full h-full rounded-[0.25rem] bg-gradient-to-r from-amber-300 to-amber-600 flex items-center justify-center"
              data-oid="7pj89fu"
            >
              <span
                className="text-white text-xl font-semibold"
                data-oid="2h7fhw4"
              >
                {request.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content section with name and description */}
      <CardContent className="p-4" data-oid="ez1-d4_">
        <CardTitle className="text-lg font-semibold" data-oid="lxgnz0h">
          {request.title}
        </CardTitle>
        <CardDescription className="mt-1 text-gray-500" data-oid="q1gkq6a">
          {request.address}
        </CardDescription>

        <div className="mt-3" data-oid="0-2yho_">
          <p
            className="text-sm text-muted-foreground text-gray-500"
            data-oid="fk-kenb"
          >
            Date: {request.close_date}
          </p>
        </div>
      </CardContent>

      {/* Footer with View Details button and Delete button */}
      <CardFooter className="p-4 pt-0 flex gap-2" data-oid="2:dtg:h">
        <Button
          variant="outline"
          className="w-full border-amber-600 text-amber-600 bg-amber-50 rounded-sm"
          asChild
          data-oid="s9lo7._"
        >
          <Link
            to={`/requests/show/${request.id}`}
            className="rounded-none"
            data-oid="xj:4n_r"
          >
            View Details
          </Link>
        </Button>

        <Button
          variant="outline"
          className="border-red-600 text-red-600 bg-red-50 rounded-sm"
          onClick={handleDelete}
        >
          Delete Event
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RequestListCard;
