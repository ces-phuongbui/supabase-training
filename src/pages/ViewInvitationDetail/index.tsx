"use client";

import {
  useGetIdentity,
  useNotification,
  useShow,
  useUpdate,
} from "@refinedev/core";
import html2canvas from "html2canvas";
import { ArrowLeft, Share, ArrowDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

// ShadcN UI components
import { IUser } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabaseClient } from "@/utility";
import { format } from "date-fns";
import { invitationSchema } from "../CreateInvitation/schema";
import { IRequest, IResponse } from "../requests/list";
import { TabDetailContent } from "./TabDetailContent";

export const ViewInvitationDetail = () => {
  const navigate = useNavigate();
  const { open } = useNotification();
  const { id } = useParams();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [responses, setResponses] = useState<IResponse[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { data: user } = useGetIdentity<IUser>();

  // Add pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const qrValue = `${window.location.origin}/r/${id}`;

  // Load invitation data
  const { queryResult } = useShow<IRequest>({
    resource: "requests",
    id: id as string,
  });

  const { data, isLoading } = queryResult;
  const request = data?.data;

  // Get responses for this invitation
  useEffect(() => {
    if (id) {
      // Initial fetch
      const fetchResponses = async () => {
        const { data } = await supabaseClient
          .from("responses")
          .select("*")
          .eq("request_id", id);
        if (data) {
          setResponses(data as IResponse[]);
        }
      };
      fetchResponses();

      // Set up realtime subscription
      const subscription = supabaseClient
        .channel("responses_channel")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "responses",
            filter: `request_id=eq.${id}`,
          },
          (payload) => {
            // Handle different types of changes
            switch (payload.eventType) {
              case "INSERT":
                setResponses((current) => [
                  ...current,
                  payload.new as IResponse,
                ]);
                break;
              case "UPDATE":
                setResponses((current) =>
                  current.map((response) =>
                    response.id === payload.new.id
                      ? (payload.new as IResponse)
                      : response,
                  ),
                );
                break;
              case "DELETE":
                setResponses((current) =>
                  current.filter((response) => response.id !== payload.old.id),
                );
                break;
            }
          },
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [id]);

  // Calculate total guests
  const totalGuests = useMemo(
    () => responses.reduce((sum, item) => sum + item.num_attendees, 0),
    [responses],
  );

  const totalAccepted = useMemo(
    () => responses.filter((r) => r.accept).length,
    [responses],
  );

  const downloadQRCode = async () => {
    if (!qrCodeRef.current) return;

    try {
      const canvas = await html2canvas(qrCodeRef.current, {
        backgroundColor: "#FFFFFF",
      });
      const link = document.createElement("a");
      link.download = `qr-code-${id}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      open?.({
        type: "success",
        message: "QR Code Downloaded",
        description: "QR Code has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Failed to download QR code:", error);
      open?.({
        type: "error",
        message: "Download Failed",
        description: "Failed to download QR code. Please try again.",
      });
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/r/${id}`);
    open?.({
      type: "success",
      message: "Link Copied",
      description: "RSVP link has been copied to your clipboard.",
    });
  };

  const { mutate } = useUpdate<IRequest>();

  const onSubmit = async (values: z.infer<typeof invitationSchema>) => {
    setIsDisabled(true);

    // Upload Image if it's a File
    let imageUrl = request?.background_image ?? "";
    if (values.background_image instanceof File) {
      // Upload to Supabase storage
      const { data, error } = await supabaseClient.storage
        .from("training")
        .upload(`${user?.id}/` + id, values.background_image);

      if (error) {
        console.error("Error uploading image:", error);
        setIsDisabled(false);
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
        id: id as string,
        values: {
          ...values,
          background_image: imageUrl,
        },
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Invitation updated successfully",
            description: "Your invitation has been updated.",
          });
          setIsEditing(false);
          setIsDisabled(false);
        },
        onError: (error) => {
          open?.({
            type: "error",
            message: "Failed to update invitation",
            description: error?.message || "Something went wrong",
          });
          setIsDisabled(false);
        },
      },
    );
  };

  // Add this function to get paginated responses
  const getPaginatedResponses = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return responses.slice(startIndex, endIndex);
  };

  // Add this to get the total pages
  const totalPages = Math.ceil(responses.length / rowsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Invitation not found</h2>
        <Button
          onClick={() => navigate("/requests")}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Back to Invitations
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center justify-center z-10"
        onClick={() => navigate("/requests")}
      >
        <ArrowLeft size={40} />
        Back
      </Button>

      <div className="container max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center pt-8 mb-6">
          Invitation Detail
        </h1>

        <Tabs
          defaultValue="information"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 space-x-2">
            <TabsTrigger value="details" className="border border-orange-400">
              Details
            </TabsTrigger>
            <TabsTrigger value="responses" className="border border-orange-400">
              Responses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <TabDetailContent
              request={request}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isDisabled={isDisabled}
              onSubmit={onSubmit}
            />
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 ">
                <div className="bg-white h-full p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Event Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Invitations</p>
                      <p className="text-2xl font-bold">{responses.length}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Accepted</p>
                      <p className="text-2xl font-bold">{totalAccepted}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Guests</p>
                      <p className="text-2xl font-bold">{totalGuests}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Days Left</p>
                      <p className="text-2xl font-bold">
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(request.close_date).getTime() -
                              Date.now()) /
                              (1000 * 60 * 60 * 24),
                          ),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl text-center font-bold mb-4">
                    Share Invitation
                  </h2>
                  <div className="flex flex-col items-center gap-4">
                    {/* QR Code with hover overlay */}
                    <div className="relative group">
                      <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
                        <QRCode value={qrValue} size={180} />
                      </div>
                      {/* Overlay on hover */}
                      <div
                        onClick={downloadQRCode}
                        className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer rounded-lg"
                      >
                        <Button variant="ghost" className="text-white">
                          <ArrowDown className="h-8 w-8" />
                        </Button>
                      </div>
                    </div>

                    {/* Share buttons in a grid */}
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={copyLinkToClipboard}
                        variant="default"
                        className="rounded-full w-10 h-10 p-0"
                        title="Copy Link"
                      >
                        <Share className="h-5 w-5" />
                      </Button>

                      <FacebookShareButton url={qrValue}>
                        <FacebookIcon size={40} round />
                      </FacebookShareButton>

                      <TwitterShareButton
                        url={qrValue}
                        title={`Join us at ${request.title}`}
                      >
                        <TwitterIcon size={40} round />
                      </TwitterShareButton>

                      <WhatsappShareButton
                        url={qrValue}
                        title={`Join us at ${request.title}`}
                      >
                        <WhatsappIcon size={40} round />
                      </WhatsappShareButton>

                      <TelegramShareButton
                        url={qrValue}
                        title={`Join us at ${request.title}`}
                      >
                        <TelegramIcon size={40} round />
                      </TelegramShareButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New Guest List Table - Full Width */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Guest List</h2>
              {getPaginatedResponses().length ? (
                <>
                  <div className="rounded-sm border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-orange-400">
                          <TableHead className="w-[200px]">
                            Guest Name
                          </TableHead>
                          <TableHead>Number Attendees</TableHead>
                          <TableHead>Accept</TableHead>
                          <TableHead className="text-right">
                            Response date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPaginatedResponses().map((response) => (
                          <TableRow key={response.id}>
                            <TableCell className="font-medium">
                              {response.responder_name}
                            </TableCell>
                            <TableCell>{response.num_attendees}</TableCell>
                            <TableCell>
                              {response.accept ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  No
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {format(response.accepted_at, "dd/MM/yyyy")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-end space-x-4 py-4">
                    <div className="w-1/2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 w-28">
                          Rows per page:
                        </span>
                        <Select
                          value={rowsPerPage.toString()}
                          onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={rowsPerPage} />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 min-w-16">
                        {`${(page - 1) * rowsPerPage + 1}–${Math.min(
                          page * rowsPerPage,
                          responses.length,
                        )} of ${responses.length}`}
                      </div>

                      <Pagination className="m-0 w-2/5">
                        <PaginationContent>
                          <PaginationItem
                            className={
                              page === 1 ? "cursor-default" : "cursor-pointer"
                            }
                          >
                            <PaginationPrevious
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              className={
                                page === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          <PaginationItem
                            className={
                              page === totalPages ? "" : "cursor-pointer"
                            }
                          >
                            <PaginationNext
                              onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                              }
                              className={
                                page === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                </>
              ) : (
                <>You have no response</>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewInvitationDetail;
