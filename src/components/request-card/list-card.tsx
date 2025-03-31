import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useDataGrid } from "@refinedev/mui";
import { IRequest, IResponse } from "../../pages/requests/list";

interface RequestListCardProps {
  request: IRequest;
}

export default function RequestListCard({ request }: RequestListCardProps) {
  const { dataGridProps: responseData } = useDataGrid<IResponse>({
    resource: "responses",
    queryOptions: {
      enabled: !!request,
    },
    filters: {
      permanent: [
        {
          field: "request_id",
          operator: "eq",
          value: request?.id ?? "",
        },
      ],
    },
    liveMode: "auto",
  });

  const totalGuests = useMemo(
    () => responseData.rows.reduce((sum, item) => sum + item.num_attendees, 0),
    [responseData],
  );

  return (
    <Card
      className="overflow-hidden border shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1F]"
      data-oid="7u_859o"
    >
      {/* Image at the top */}
      <div className="w-full pt-4 px-4 overflow-hidden" data-oid="099fhiz">
        <div
          className="h-[150px] overflow-hidden rounded-[0.25rem]"
          data-oid="85rn-.k"
        >
          {request.background_image ? (
            <img
              src={request.background_image}
              alt={request.title}
              className="w-full h-full object-cover rounded-[0.25rem]"
              loading="lazy"
              decoding="async"
              data-oid="6jpthlg"
            />
          ) : (
            <div
              className="w-full h-full rounded-[0.25rem] bg-gradient-to-r from-amber-300 to-amber-600 flex items-center justify-center"
              data-oid="6jpthlg"
            >
              <span className="text-white text-xl font-semibold">
                {request.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content section with name and description */}
      <CardContent className="p-4" data-oid="6t87cwm">
        <CardTitle className="text-lg font-semibold" data-oid="ghd.3oi">
          Seminar Invite
        </CardTitle>
        <CardDescription className="mt-1" data-oid="9f9bvct">
          Seminar - {request.title}
        </CardDescription>

        <div className="mt-3" data-oid="qd6p04r">
          <p className="text-sm text-muted-foreground" data-oid="2srfk3u">
            Date: {request.close_date}
          </p>
        </div>
      </CardContent>

      {/* Footer with View Details button */}
      <CardFooter className="p-4 pt-0" data-oid="8vjk1-y">
        <Button
          variant="outline"
          className="w-full border-amber-600 text-amber-600 bg-amber-50"
          asChild
          data-oid="fd9ut7_"
        >
          <Link
            to={`/requests/show/${request.id}`}
            data-oid="_qvucl:"
            className="rounded-none"
          >
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
