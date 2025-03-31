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
    <Stack spacing={2} data-oid="g:t2da4">
      <Typography fontWeight={600} fontSize={24} data-oid="0dm.-7n">
        Scan Me!
      </Typography>
      <Stack gap={2} data-oid="d8_82uw">
        <Box ref={qrCodeRef} width="min-content" data-oid="y:h0c42">
          <QRCode value={qrValue} data-oid="aqlfjyg" />
        </Box>
        <Stack direction="row" gap={2} alignItems="center" data-oid="gpiaos3">
          <Button
            onClick={downloadQRCode}
            variant="outlined"
            data-oid="gfsyelt"
          >
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
      <EmptyResourceMessage
        message="No guests want to attend your event!"
        data-oid="rzunid9"
      />
    );
  }

  if (!responses.length) {
    return (
      <EmptyResourceMessage
        message="No guests want to attend your event!"
        data-oid="g3t080_"
      />
    );
  }

  return (
    <Box bgcolor="action.hover" p={2} borderRadius={2} data-oid="ehu3bjj">
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        data-oid="bdgqjoo"
      >
        <Typography
          fontSize={20}
          textTransform="capitalize"
          fontStyle="italic"
          data-oid="1uudx8e"
        >
          Invitations: {responses.length}
        </Typography>
        <Typography
          fontSize={20}
          textTransform="capitalize"
          fontStyle="italic"
          data-oid="27ot6o5"
        >
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
    <Button
      onClick={() => onCopyLink(requestId)}
      variant="contained"
      data-oid="g5gokyf"
    >
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
    liveMode: "auto",
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
    <Show
      isLoading={isLoading}
      canEdit={false}
      headerButtons={({ defaultButtons }) => (
        <HeaderButtons
          defaultButtons={defaultButtons}
          requestId={request.id}
          onCopyLink={copyLinkToClipboard}
          data-oid="zoed72y"
        />
      )}
      data-oid="nqsd7jn"
    >
      <Background
        backgroundImage={background_image}
        backgroundColor={background_color}
        background_gradient={background_gradient}
        data-oid="wu-3jjm"
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
          data-oid="2435pfo"
        />
      </Background>
      <Box
        sx={{ borderBottom: 1, marginTop: 2, borderColor: "divider" }}
        data-oid="zbo44jd"
      >
        <Tabs value={value} onChange={handleChange} data-oid="dq:s24e">
          <Tab label="Information" {...a11yProps(0)} data-oid="6-0on9u" />
          <Tab label="Settings" {...a11yProps(1)} data-oid="j_y1eme" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} data-oid="rmqhauk">
        <Stack spacing={4} data-oid="yftnphh">
          <Stack spacing={2} data-oid="ej4g4pg">
            <Typography fontWeight="bold" fontSize={24} data-oid="4rrr2hw">
              Total Guests
            </Typography>
            <TotalGuestsSection
              responses={responseDataGridProps.rows as IResponse[]}
              data-oid="c.zdyw7"
            />
          </Stack>
          <Divider data-oid="1c3t67u" />
          <Stack spacing={2} data-oid="mcjbucl">
            <Typography fontWeight="bold" fontSize={24} data-oid="jhidbl-">
              Accepted:{" "}
              {responseDataGridProps.rows.filter((row) => row.accept).length}
            </Typography>
            <DataGrid
              columns={responseColumns}
              {...responseDataGridProps}
              autoHeight
              data-oid="z-8lp25"
            />
          </Stack>
          <Divider data-oid="n5bc1sq" />
          <Stack spacing={2} data-oid="s6ytl5j">
            <QRCodeSection requestId={id} data-oid="39mzf4m" />
          </Stack>
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1} data-oid="77p33ck">
        <Grid
          container
          spacing={2}
          marginTop={"0 !important"}
          data-oid="s6a2p3e"
        >
          <Grid item xs={12} lg={6} padding={"0 !important"} data-oid="i9ln-jb">
            <Stack spacing={2} data-oid="wh9ckue">
              <Typography
                fontWeight={600}
                fontSize={24}
                ml={3}
                data-oid="k_s:pl0"
              >
                Info
              </Typography>
              <Grid
                container
                spacing={3}
                marginTop={"0 !important"}
                data-oid="w1:uaov"
              >
                <Grid item xs={12} sm={6} data-oid="_yt1b58">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                    data-oid="m3miq-m"
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
                        data-oid="tq-717e"
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} data-oid="srxs6ym">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                    data-oid="okpelfl"
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
                        data-oid="yol07:o"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={6} data-oid="s2c3aq-">
            <Map position={position} address={address} data-oid="5bfc436" />
          </Grid>
        </Grid>
      </CustomTabPanel>
    </Show>
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
      data-oid="vovgwc1"
    >
      {value === index && (
        <Box sx={{ p: 2 }} data-oid="uv70uus">
          {children}
        </Box>
      )}
    </div>
  );
}

const RESPONSE_COLUMNS: GridColDef[] = [
  {
    field: "accepted_at",
    flex: 1,
    headerName: "Accepted At",
    minWidth: 100,
    renderCell: ({ value }) => <DateField value={value} data-oid="-u1.q9u" />,
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
