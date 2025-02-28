import { Mail } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteButton, ShowButton, useDataGrid } from "@refinedev/mui";
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
    <Card className="min-w-[250px] flex-1">
      <CardHeader
        className="p-0 rounded-t-lg"
        style={{ backgroundColor: request.secondary_color }}
      >
        <Link
          to={`/requests/show/${request.id}`}
          className="block p-4 hover:opacity-80 transition-opacity"
          style={{ color: request.primary_color }}
        >
          <h3 className="font-bold">{request.title}</h3>
        </Link>
      </CardHeader>

      <CardContent className="p-4 h-full">
        <div className="flex justify-between pr-10">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground">
              Total Attendees
            </p>
            <p className="text-sm">{totalGuests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground">
              Close Date
            </p>
            <p className="text-sm">{request.close_date}</p>
          </div>
        </div>

        <div className="space-y-2 pt-6">
          <h4 className="font-bold">Actions</h4>
          <div className="flex items-center gap-2">
            <ShowButton hideText recordItemId={request.id} />
            <DeleteButton hideText recordItemId={request.id} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/r/${request.id}`}>
                      <Mail className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="bg-gray-800 text-white px-3 py-2 rounded-md shadow-md"
                >
                  <p>See how your guests will see your invite</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
