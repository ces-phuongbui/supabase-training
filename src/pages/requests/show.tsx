import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useNotification, useShow } from "@refinedev/core";
import { DateField, Show, useDataGrid } from "@refinedev/mui";
import html2canvas from "html2canvas";
import { useCallback, useMemo, useRef } from "react";
import QRCode from "react-qr-code";
import EmptyResourceMessage from "../../components/common/empty-resource-message";
import ValueDisplay from "../../components/common/valueDisplay";
import { RequestCard } from "../../components/request-card";
import Background from "../../components/request-card/background";
import { IRequest, IResponse } from "./list";

const QRCodeSection = ({ requestId, onCopy }: { requestId: string; onCopy: () => void }) => {
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const qrValue = `${window.location.origin}/r/${requestId}`;

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
                    <Button onClick={onCopy} variant="outlined">
                        Copy QR Code as Image
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

const TotalGuestsSection = ({ responses }: { responses: IResponse[] }) => {
    const totalGuests = useMemo(() => responses.reduce((sum, item) => sum + item.num_attendees, 0), [responses]);

    if (!responses.length) {
        return <EmptyResourceMessage message="No guests want to attend your event!" />;
    }

    return (
        <Box bgcolor="action.hover" p={2} borderRadius={2}>
            <Stack direction="row" gap={2} alignItems="center" justifyContent="space-between">
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

export const RequestShow: React.FC<IResourceComponentsProps> = () => {
    const { open } = useNotification();
    const qrCodeRef = useRef<HTMLDivElement>(null);

    const copyQRCodeAsImage = useCallback(async () => {
        try {
            if (!qrCodeRef.current) return;

            const canvas = await html2canvas(qrCodeRef.current);
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob)));

            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

                open?.({
                    type: "success",
                    key: "copy-success",
                    message: "Success",
                    description: "QR Code Copied to Clipboard",
                });
            }
        } catch (error) {
            console.error("Failed to copy QR code:", error);
        }
    }, [open]);

    const copyLinkToClipboard = useCallback(
        (id: string) => {
            navigator.clipboard.writeText(`${window.location.origin}/r/${id}`);
            open?.({
                type: "success",
                key: "copy-link-success",
                description: "Link copied to clipboard",
                message: "Your RSVP link has been copied to your clipboard. Share it with your guests.",
            });
        },
        [open],
    );

    const responseColumns = useMemo<GridColDef[]>(
        () => [
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
        ],
        [],
    );

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

    return (
        <Show
            isLoading={isLoading}
            canEdit={false}
            headerButtons={({ defaultButtons }) => (
                <>
                    <Button onClick={() => copyLinkToClipboard(request.id)} variant="contained">
                        Share RSVP Link
                    </Button>
                    {defaultButtons}
                </>
            )}
        >
            <Stack spacing={4}>
                <Background
                    backgroundColor={request.background_color}
                    background_gradient={request.background_gradient}
                >
                    <RequestCard
                        backgroundColor={request.background_color}
                        title={request.title}
                        address={request.address}
                        acceptanceLabel={request.acceptance_label}
                        rejectionLabel={request.rejection_label}
                        closeDate={request.close_date}
                        secondaryColor={request.secondary_color}
                        secondary_gradient={request.secondary_gradient}
                        primaryColor={request.primary_color}
                        fontFamily={request.font_family}
                        italicize={request.italicize}
                        responses={responseDataGridProps.rows as IResponse[]}
                    />
                </Background>

                <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                        <QRCodeSection requestId={request.id} onCopy={copyQRCodeAsImage} />
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
                    <Typography fontSize={24}>Total Guests</Typography>
                    <TotalGuestsSection responses={responseDataGridProps.rows as IResponse[]} />
                </Stack>

                <Divider />

                <Stack spacing={2}>
                    <Typography fontWeight="bold" fontSize={24}>
                        Accepted:
                        {responseDataGridProps.rows.filter((row) => row.accept).length}
                    </Typography>
                    <DataGrid columns={responseColumns} {...responseDataGridProps} autoHeight />
                </Stack>
            </Stack>
        </Show>
    );
};
