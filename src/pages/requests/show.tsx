import {
  Box,
  Button,
  Divider,
  Grid,
  ListItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  IResourceComponentsProps,
  useNotification,
  useShow,
} from "@refinedev/core";
import { DateField, Show, useDataGrid } from "@refinedev/mui";
import html2canvas from "html2canvas";
import { useCallback, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import EmptyResourceMessage from "../../components/common/empty-resource-message";
import ValueDisplay from "../../components/common/valueDisplay";
import { RequestCard } from "../../components/request-card";
import Background from "../../components/request-card/background";
import { IRequest, IResponse } from "./list";
import Map from "./map";

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
    [responses],
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

const EXCLUDE_FIELDS = ["position", "background_image"];

export const RequestShow: React.FC<IResourceComponentsProps> = () => {
  const { open } = useNotification();
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
    [open],
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

  const mid = Math.ceil(Object.entries(request).length / 2);

  const leftColumn = Object.entries(request).slice(0, mid);
  const rightColumn = Object.entries(request)
    .slice(mid)
    .filter((value) => !EXCLUDE_FIELDS.includes(value[0]));

  const {
    id,
    background_color,
    background_gradient,
    background_image,
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
    position,
  } = request;

  return (
    <>
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
        <Background
          backgroundImage={background_image}
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
            isHaveBackGroundImage={!!background_image}
          />
        </Background>
        <Box sx={{ borderBottom: 1, marginTop: 2, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Information" {...a11yProps(0)} />
            <Tab label="Settings" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Stack spacing={4}>
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
            <Divider />
            <Stack spacing={2}>
              <QRCodeSection requestId={id} />
            </Stack>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Grid container spacing={2} marginTop={"0 !important"}>
            <Grid item xs={12} lg={6} padding={"0 !important"}>
              <Stack spacing={2}>
                <Typography fontWeight={600} fontSize={24} ml={3}>
                  Info
                </Typography>
                <Grid container spacing={3} marginTop={"0 !important"}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {leftColumn.map((item) => (
                        <ValueDisplay
                          key={item[0]}
                          label={item[0].replace(/_/g, " ")}
                          value={item[1]}
                          isDate={
                            item[0] === "close_date" || item[0] === "created_at"
                          }
                          isColor={item[0].includes("color")}
                          isImage={item[0] === "background_image"}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {rightColumn.map((item) => (
                        <ValueDisplay
                          key={item[0]}
                          label={item[0].replace(/_/g, " ")}
                          value={item[1]}
                          isDate={
                            item[0] === "close_date" || item[0] === "created_at"
                          }
                          isColor={item[0].includes("color")}
                          isImage={item[0] === "background_image"}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Map position={position} address={address} />
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Show>
    </>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

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
