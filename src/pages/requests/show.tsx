import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  IResourceComponentsProps,
  useNotification,
  useShow,
} from "@refinedev/core";
import { DateField, Show, useDataGrid } from "@refinedev/mui";
import html2canvas from "html2canvas";
import { useCallback, useMemo, useRef } from "react";
import QRCode from "react-qr-code";
import EmptyResourceMessage from "../../components/common/empty-resource-message";
import ValueDisplay from "../../components/common/valueDisplay";
import { RequestCard } from "../../components/request-card";
import Background from "../../components/request-card/background";
import { IRequest, IResponse } from "./list";

const QRCodeSection = ({ requestId }: { requestId: string }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrValue = `${window.location.origin}/r/${requestId}`;

  const downloadQRCode = async () => {
    if (!qrCodeRef.current) return;

    try {
      const canvas = await html2canvas(qrCodeRef.current);
      const link = document.createElement("a");
      link.download = `qr-code-${requestId}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography fontWeight={600} fontSize={24}>
        Scan Me!
      </Typography>
      <Stack gap={2}>
        <Box ref={qrCodeRef} width="min-content">
          <QRCode value={qrValue} />
        </Box>
        <Stack direction="row" gap={2} alignItems="center">
          <Button onClick={downloadQRCode} variant="outlined">
            Download QR Code
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

type TotalGuestsSectionProps = { responses: IResponse[] };
const TotalGuestsSection = ({ responses }: TotalGuestsSectionProps) => {
  const totalGuests = useMemo(
    () => responses.reduce((sum, item) => sum + item.num_attendees, 0),
    [responses]
  );

  if (!responses.length) {
    return (
      <EmptyResourceMessage message="No guests want to attend your event!" />
    );
  }

  if (!responses.length) {
    return (
      <EmptyResourceMessage message="No guests want to attend your event!" />
    );
  }

  return (
    <Box bgcolor="action.hover" p={2} borderRadius={2}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography fontSize={20} textTransform="capitalize" fontStyle="italic">
          Invitations: {responses.length}
        </Typography>
        <Typography fontSize={20} textTransform="capitalize" fontStyle="italic">
          Attendees: {totalGuests}
        </Typography>
      </Stack>
    </Box>
  );
};

type HeaderButtonsProps = {
  defaultButtons: React.ReactNode;
  requestId: string;
  onCopyLink: (id: string) => void;
};

const HeaderButtons = ({
  defaultButtons,
  requestId,
  onCopyLink,
}: HeaderButtonsProps) => (
  <>
    <Button onClick={() => onCopyLink(requestId)} variant="contained">
      Share RSVP Link
    </Button>
    {defaultButtons}
  </>
);

export const RequestShow: React.FC<IResourceComponentsProps> = () => {
  const { open } = useNotification();

  const copyLinkToClipboard = useCallback(
    (id: string) => {
      navigator.clipboard.writeText(`${window.location.origin}/r/${id}`);
      open?.({
        type: "success",
        key: "copy-link-success",
        description: "Link copied to clipboard",
        message:
          "Your RSVP link has been copied to your clipboard. Share it with your guests.",
      });
    },
    [open]
  );

  const responseColumns = useMemo(() => RESPONSE_COLUMNS, []);
  const { queryResult } = useShow<IRequest>();
  const { data, isLoading } = queryResult;
  const request = data?.data;

  const { dataGridProps: responseDataGridProps } = useDataGrid<IResponse>({
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
  });

  if (!request) return null;

  const {
    id,
    background_color,
    background_gradient,
    title,
    address,
    acceptance_label,
    rejection_label,
    close_date,
    secondary_color,
    secondary_gradient,
    primary_color,
    font_family,
    italicize,
    style,
  } = request;
  return (
    <Show
      isLoading={isLoading}
      canEdit={false}
      headerButtons={({ defaultButtons }) => (
        <HeaderButtons
          defaultButtons={defaultButtons}
          requestId={request.id}
          onCopyLink={copyLinkToClipboard}
        />
      )}
    >
      <Stack spacing={4}>
        <Background
          backgroundColor={background_color}
          background_gradient={background_gradient}
        >
          <RequestCard
            backgroundColor={background_color}
            title={title}
            address={address}
            acceptanceLabel={acceptance_label}
            rejectionLabel={rejection_label}
            closeDate={close_date}
            secondaryColor={secondary_color}
            secondary_gradient={secondary_gradient}
            primaryColor={primary_color}
            fontFamily={font_family}
            italicize={italicize}
            style={style}
          />
        </Background>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <QRCodeSection requestId={id} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Stack spacing={2}>
              <Typography fontWeight={600} fontSize={24}>
                Info
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(request).map(([key, value]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <ValueDisplay
                      label={key.replace(/_/g, " ")}
                      value={value}
                      isDate={key === "close_date"}
                      isColor={key.includes("color")}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        <Stack spacing={2}>
          <Typography fontWeight="bold" fontSize={24}>
            Total Guests
          </Typography>
          <TotalGuestsSection
            responses={responseDataGridProps.rows as IResponse[]}
          />
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography fontWeight="bold" fontSize={24}>
            Accepted:{" "}
            {responseDataGridProps.rows.filter((row) => row.accept).length}
          </Typography>
          <DataGrid
            columns={responseColumns}
            {...responseDataGridProps}
            autoHeight
          />
        </Stack>
      </Stack>
    </Show>
  );
};

const RESPONSE_COLUMNS: GridColDef[] = [
  {
    field: "accepted_at",
    flex: 1,
    headerName: "Accepted At",
    minWidth: 100,
    renderCell: ({ value }) => <DateField value={value} />,
  },
  {
    field: "responder_name",
    flex: 1,
    headerName: "Name",
    minWidth: 150,
  },
  {
    field: "accept",
    flex: 1,
    headerName: "Accept",
    type: "boolean",
    minWidth: 100,
  },
  {
    field: "num_attendees",
    flex: 1,
    headerName: "Num Attendees",
    type: "number",
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
];
