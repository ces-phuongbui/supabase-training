import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import RequestListCard from "../../components/request-card/list-card";
import { supabaseClient } from "@/utility";

export interface IRequest {
  id: string;
  background_color: string;
  title: string;
  address: string;
  acceptance_label: string;
  activity_date: string;
  activity_time: string;
  rejection_label: string;
  close_date: string;
  secondary_color: string;
  primary_color: string;
  font_family: string;
  italicize: boolean;
  background_gradient: boolean;
  background_image: string;
  secondary_gradient: boolean;
  style: string;
  position: LatLngExpression;
}

export interface IResponse {
  id: string;
  responder_name: string;
  accepted_at: string;
  num_attendees: number;
  accept: boolean;
}

const RequestGrid: React.FC<{
  requests: IRequest[];
  onDelete: (id: string) => void;
}> = ({ requests, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    {requests.map((req) => (
      <RequestListCard key={req.id} request={req} onDelete={onDelete} />
    ))}
  </div>
);

export const RequestList = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        setUser({ id: data.session.user.id });
      }
    };

    getCurrentUser();
  }, []);

  // Fetch initial requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("requests")
        .select("*")
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error fetching requests:", error);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleDelete(id: string) {
    try {
      const { error } = await supabaseClient
        .from("requests") // Replace with your actual table name
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting request card:", error);
      return { success: false, error };
    }
  }

  const onDelete = async (id: string) => {
    await handleDelete(id);
    await fetchRequests();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Events</h1>
        <Button
          variant="default"
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={() => (window.location.href = "/requests/create")}
        >
          Add New Event
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center mt-[25%]">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <RequestGrid requests={requests} onDelete={onDelete} />
      )}
    </div>
  );
};

export default RequestList;
